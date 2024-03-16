/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('dotenv').config();
import * as functions from 'firebase-functions';
import config from './config';
import { FirestoreOnWriteProcessor } from './firestore-onwrite-processor';
import { generateChatResponse } from './generate_chat_response';
import { createErrorMessage } from './errors';

import * as admin from 'firebase-admin';
admin.initializeApp();

// TODO: needs logging/error logging, and fixing tests

//TODO: redact googleAi.apiKey from logs
//logs.init(config);

const processorOptions = {
  inputField: config.promptField,
  processFn: generateChatResponse,
  errorFn: createErrorMessage,
};

const processor = new FirestoreOnWriteProcessor<
  string,
  Record<string, string | string[]>
>(processorOptions);

export const generateChatMessage = functions.firestore
  .document(config.collectionName)
  .onWrite(async (change) => {
    return processor.run(change);
  });

export const suggest_appointment_date = functions.https.onRequest(
  async (req: any, res: any) => {
    const sessionId = req.query.session_id as string;

    console.log('Session ID:', sessionId);

    const suggestedDates = [];
    const today = new Date();
    const nextDay = new Date(today);
    while (suggestedDates.length < 2) {
      if (nextDay.getDay() != 0 && nextDay.getDay() != 6) {
        suggestedDates.push(nextDay.toISOString().split('T')[0]);
      }
      nextDay.setDate(nextDay.getDate() + 1);
    }
    await updateSession(sessionId, { suggestedDates: suggestedDates });
    res.status(200).json({ results: suggestedDates });
  },
);

// Select appointment date
export const select_appointment_date = functions.https.onRequest(
  async (req: any, res: any) => {
    const sessionId = req.query.session_id as string;
    console.log('Session ID:', sessionId);

    const { appointment_date } = req.body;
    console.log('appointment_date:', appointment_date);
    // Placeholder logic
    const result = `Appointment date set to ${appointment_date}`;
    await updateSession(sessionId, { appointment_date: appointment_date });
    res.status(200).json({ results: [result] });
  },
);

export const get_available_appointment_time = functions.https.onRequest(
  async (req: any, res: any) => {
    const sessionId = req.query.session_id as string;
    console.log('Session ID:', sessionId);

    const { appointment_date } = req.query;
    console.log('appointment_date:', appointment_date);

    const availableTimes = ['9:30', '11:00', '11:30'];

    await updateSession(sessionId, { availableTimes: availableTimes });
    res.status(200).json({ results: availableTimes });
  },
);

export const select_appointment_time = functions.https.onRequest(
  async (req: any, res: any) => {
    const sessionId = req.query.session_id as string;
    console.log('Session ID:', sessionId);

    const { appointment_time } = req.body;
    console.log('appointment_time:', appointment_time);
    // Placeholder logic
    const result = `Appointment time set to ${appointment_time}`;
    await updateSession(sessionId, { appointment_time: appointment_time });
    res.status(200).json({ results: [result] });
  },
);

export const get_session_information = functions.https.onRequest(
  async (req: any, res: any) => {
    const sessionId = req.query.session_id as string;
    console.log('Session ID:', sessionId);

    const sessionRef = admin.firestore().collection('sessions').doc(sessionId);
    const session = await sessionRef.get();
    const data = session.data();
    res.status(200).json({ results: [data] });
  },
);

export const book_appointment = functions.https.onRequest(
  async (req: any, res: any) => {
    const sessionId = req.query.session_id as string;
    console.log('Session ID:', sessionId);

    const sessionRef = admin.firestore().collection('sessions').doc(sessionId);
    const session = await sessionRef.get();
    const data: any = session.data();
    const { appointment_date, appointment_time, number } = data;

    const userRef = admin
      .firestore()
      .collection('users')
      .where('number', '==', number);
    const user = await userRef.get();
    const userId = user.docs[0].id;

    const appointments = admin
      .firestore()
      .collection(`users/${userId}/calendar/appointments`)
      .doc();

    await appointments.set({
      appointment_date: appointment_date,
      appointment_time: appointment_time,
      sessionId: sessionId,
    });
    const result = `Appointment booked for ${appointment_date} at ${appointment_time}`;
    res.status(200).json({ results: [result] });
  },
);

const updateSession = async (sessionId: string, obj: any) => {
  const sessionRef = admin.firestore().collection('sessions').doc(sessionId);

  await sessionRef.set(
    {
      sessionId: sessionId,
      number: '(203) 584-9130',
      ...obj,
    },
    { merge: true },
  );
};
