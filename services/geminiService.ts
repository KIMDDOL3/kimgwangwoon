import { GoogleGenAI, Type } from "@google/genai";
import { Scholarship, ExternalScholarship, AllScholarships } from '../types';
import { searchExternalScholarships } from './externalScholarshipService';
import { EXTERNAL_SCHOLARSHIPS } from '../constants';

let ai: GoogleGenAI | null = null;

const getAi = (): GoogleGenAI => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

const retrieveRelevantScholarships = (query: string, scholarships: AllScholarships[], topK: number = 3): AllScholarships[] => {
  const queryWords = new Set(query.toLowerCase().split(/\s+/).filter(w => w.length > 1));
  if (queryWords.size === 0) return [];

  const scoredScholarships = scholarships.map(scholarship => {
    const content = `${scholarship.title} ${scholarship.summary} ${scholarship.fullDescription}`.toLowerCase();
    let score = 0;
    queryWords.forEach(word => {
      if (content.includes(word)) score++;
    });
    // Give a huge bonus for exact title match to prioritize it
    if (scholarship.title.toLowerCase().includes(query.toLowerCase())) score += 10;
    return { scholarship, score };
  });

  return scoredScholarships.filter(item => item.score > 0).sort((a, b) => b.score - a.score).slice(0, topK).map(item => item.scholarship);
};

type Intent = 'INTERNAL_SEARCH' | 'EXTERNAL_SEARCH' | 'GENERAL_CHAT';

interface IntentResponse {
    intent: Intent;
    query: string;
}

const getIntent = async (userMessage: string): Promise<IntentResponse> => {
    const ai = getAi();
    const systemInstruction = `You are an intent detection agent for a university scholarship chatbot.
    Your task is to analyze the user's message and classify it into one of three intents:
    1.  'INTERNAL_SEARCH': The user is asking about any scholarship, including the national scholarship ("국가장학금"), or scholarships specifically offered by Chonnam National University (e.g., "교내 장학금", "성적우수 장학금").
    2.  'EXTERNAL_SEARCH': The user is asking about scholarships from outside foundations or companies (e.g., "교외 장학금", "삼성 장학금", "외부 장학금").
    3.  'GENERAL_CHAT': The user is asking a general question, a greeting, or something unrelated to a specific scholarship search.

    You must also extract a concise search query from the user's message.
    Respond ONLY with a JSON object.`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            intent: {
                type: Type.STRING,
                enum: ['INTERNAL_SEARCH', 'EXTERNAL_SEARCH', 'GENERAL_CHAT'],
            },
            query: {
                type: Type.STRING,
                description: "A concise search query based on the user's message. For '국가장학금', the query should be '국가장학금'."
            },
        },
        required: ["intent", "query"]
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `User message: "${userMessage}"`,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    return JSON.parse(response.text.trim());
};

export interface RagResponse {
  answer: string;
  sources: (AllScholarships | ExternalScholarship)[];
}

const generateFinalResponse = async (userMessage: string, context: string, availableSources: (AllScholarships | ExternalScholarship)[]): Promise<RagResponse> => {
    const ai = getAi();
    const systemInstruction = `You are a friendly and helpful scholarship assistant for Chonnam National University.
    - Your goal is to answer student questions based ONLY on the provided context.
    - Do NOT invent information. If the context doesn't contain the answer, state that clearly.
    - You MUST identify the scholarships used for the answer by their ID in the 'source_ids' field.
    - CRITICAL RULE: If the context for a scholarship includes an 'Application URL', your response MUST conclude with a clear call-to-action encouraging the user to apply via that link. This is not optional.
    - For the '국가장학금' (National Scholarship) specifically, providing the application link is the MOST IMPORTANT part of your answer. Ensure your response guides the user to apply at the URL provided in the context.
    - Always respond in Korean.`;
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING, description: "The synthesized answer to the user's question in Korean." },
          source_ids: { type: Type.ARRAY, items: { type: Type.STRING, description: "The IDs of the scholarships used as sources." } },
        },
        required: ["answer", "source_ids"]
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Context:\n${context}\n\nUser question: "${userMessage}"`,
        config: {
            systemInstruction,
            temperature: 0.1,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    const parsedResponse = JSON.parse(response.text.trim());
    const sourceIds = new Set(parsedResponse.source_ids || []);
    const sources = availableSources.filter(s => sourceIds.has(s.id));

    return { answer: parsedResponse.answer, sources };
};


export const getChatbotResponse = async (
  userMessage: string,
  allInternalScholarships: AllScholarships[],
  onStatusUpdate: (status: string) => void
): Promise<RagResponse> => {
  try {
    onStatusUpdate("사용자 의도 파악 중...");
    const { intent, query } = await getIntent(userMessage);

    switch (intent) {
        case 'INTERNAL_SEARCH': {
            onStatusUpdate("교내 및 국가장학금 정보 검색 중...");
            const relevantDocs = retrieveRelevantScholarships(query, allInternalScholarships, 5);
            if (relevantDocs.length === 0) return { answer: "관련 교내 장학금 정보를 찾지 못했습니다.", sources: [] };
            
            const context = relevantDocs.map(s => `ID: ${s.id}\nTitle: ${s.title}\nDetails: ${s.fullDescription}\nApplication URL: ${s.applicationUrl}`).join('\n---\n');
            return generateFinalResponse(userMessage, context, relevantDocs);
        }

        case 'EXTERNAL_SEARCH': {
            onStatusUpdate("외부 장학재단 정보 검색 중...");
            const relevantDocs = await searchExternalScholarships(query);
            if (relevantDocs.length === 0) return { answer: "관련 교외 장학금 정보를 찾지 못했습니다.", sources: [] };

            const context = relevantDocs.map(s => `ID: ${s.id}\nFoundation: ${s.foundation}\nTitle: ${s.title}\nSummary: ${s.summary}\nApplication URL: ${s.applicationUrl}`).join('\n---\n');
            const allSources = [...allInternalScholarships, ...EXTERNAL_SCHOLARSHIPS];
            return generateFinalResponse(userMessage, context, allSources);
        }

        case 'GENERAL_CHAT':
        default:
            return { answer: "안녕하세요! 전남대학교 장학금에 대해 무엇이든 물어보세요. '국가장학금'에 대해 질문하거나 '자가진단'을 시작할 수 있습니다.", sources: [] };
    }

  } catch (error) {
    console.error("Error in getChatbotResponse:", error);
    return { answer: "죄송합니다. 시스템에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", sources: [] };
  }
};