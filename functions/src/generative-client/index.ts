import config, { GenerativeAIProvider } from '../config';
import { DiscussionClient } from './base_class';
import { v1 } from '@google-ai/generativelanguage';
// import {GenerativeLanguageDiscussionClient} from './generative_language';
import { VertexDiscussionClient } from './vertex_ai';
import { VertexAI } from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DocumentSnapshot } from 'firebase-functions/lib/v1/providers/firestore';

type Client = v1.GenerativeServiceClient | VertexAI | GoogleGenerativeAI;

// TODO fix any
export const getGenerativeClient = (
  after: DocumentSnapshot,
): DiscussionClient<Client, any, any> => {
  switch (config.provider as GenerativeAIProvider) {
    case 'vertex-ai':
      return new VertexDiscussionClient({
        modelName: config.vertex.model,
        after,
      });
    default:
      throw new Error('Invalid provider');
  }
};
