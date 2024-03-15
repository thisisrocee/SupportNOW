import { DiscussionClient, Message } from './base_class';
import { logger } from 'firebase-functions/v1';
import {
  Content,
  GenerateContentRequest,
  Part,
  SafetySetting as VertexSafetySetting,
  VertexAI,
} from '@google-cloud/vertexai';
import config from '../config';
import { DocumentSnapshot } from 'firebase-functions/lib/v1/providers/firestore';

interface GeminiChatOptions {
  history?: Message[];
  model: string;
  temperature?: number;
  candidateCount?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  projectId: string;
  location: string;
  context?: string;
  safetySettings?: VertexSafetySetting[];
}

type ApiMessage = {
  role: string;
  parts: Part[];
};

enum Role {
  USER = 'user',
  GEMINI = 'model',
}

export class VertexDiscussionClient extends DiscussionClient<
  VertexAI,
  GeminiChatOptions,
  ApiMessage
> {
  modelName: string;
  after: DocumentSnapshot;
  constructor({
    modelName,
    after,
  }: {
    apiKey?: string;
    modelName: string;
    after: DocumentSnapshot;
  }) {
    super();
    this.after = after;
    this.client = new VertexAI({
      project: config.projectId,
      location: config.location,
    });
    if (!modelName) {
      throw new Error('Model name required.');
    }
    this.modelName = modelName;
  }

  createApiMessage(
    messageContent: string,
    role: 'user' | 'model' = 'user',
  ): ApiMessage {
    const apiRole = role === 'user' ? Role.USER : Role.GEMINI;
    return {
      role: apiRole,
      parts: [{ text: messageContent }],
    };
  }

  async generateResponse(
    history: Message[],
    latestApiMessage: ApiMessage,
    options: GeminiChatOptions,
  ) {
    if (!this.client) {
      throw new Error('Client not initialized.');
    }

    const text = JSON.stringify({ options, history, latestApiMessage });
    await this.after.ref.update({ response: text + ' connecting...' });
    let result;
    const generativeModel = this.client.preview.getGenerativeModel({
      model: options.model,
    });
    await this.after.ref.update({
      response: options.model + ' connecting...',
    });

    const contents = [...this.messagesToApi(history), latestApiMessage];

    const request: GenerateContentRequest = {
      contents,
      generation_config: {
        top_k: options.topK,
        top_p: options.topP,
        temperature: options.temperature,
        candidate_count: options.candidateCount,
        max_output_tokens: options.maxOutputTokens,
      },
      safety_settings: options.safetySettings,
    };
    try {
      let fieldResponse = '';
      const responseStream =
        await generativeModel.generateContentStream(request);

      for await (const result of responseStream.stream) {
        const contentCandidates = result.candidates.filter((c) => {
          return (
            c &&
            c.content &&
            c.content.parts &&
            c.content.parts.length > 0 &&
            c.content.parts[0].text &&
            typeof c.content.parts[0].text === 'string'
          );
        });
        fieldResponse += contentCandidates[0]!.content!.parts![0].text!;

        await this.after.ref.update({
          response: fieldResponse,
        });
      }

      result = await responseStream.response;
      // result = await chatSession.sendMessage(latestApiMessage.parts[0].text);
    } catch (e) {
      logger.error(e);
      // TODO: the error message provided exposes the API key, so we should handle this/ get the Gemini team to fix it their side.
      throw new Error(
        'Failed to generate response, see function logs for more details.',
      );
    }

    if (
      !result.candidates ||
      !Array.isArray(result.candidates) ||
      result.candidates.length === 0
    ) {
      // TODO: handle blocked responses
      throw new Error('No candidates returned');
    }

    const candidates = result.candidates.filter((c) => {
      return (
        c &&
        c.content &&
        c.content.parts &&
        c.content.parts.length > 0 &&
        c.content.parts[0].text &&
        typeof c.content.parts[0].text === 'string'
      );
    });
    return {
      response: candidates[0]!.content!.parts![0].text!,
      candidates: candidates?.map((c) => c.content!.parts![0].text!) ?? [],
      safetyMetadata: result.promptFeedback,
      history,
    };
  }

  private messagesToApi(messages: Message[]) {
    const out: Content[] = [];
    for (const message of messages) {
      if (!message.prompt || !message.response) {
        // logs.warnMissingPromptOrResponse(message.path!);
        continue;
      }
      out.push({ role: Role.USER, parts: [{ text: message.prompt! }] });
      out.push({ role: Role.GEMINI, parts: [{ text: message.response! }] });
    }
    return out;
  }
}
