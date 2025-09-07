import { GoogleGenAI } from "@google/genai";
import { AllScholarships, ChatMessage, ExternalScholarship } from "../types";
import { searchExternalScholarships } from "./externalScholarshipService";

// According to guidelines, initialize with apiKey from environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const RAG_PROMPT_TEMPLATE = `You are a helpful and friendly AI assistant for students at Chonnam National University. Your goal is to provide accurate and relevant information about scholarships.

CONVERSATION HISTORY:
---
{conversation_history}
---

CONTEXT FOR THE CURRENT QUESTION:
Here is a list of available scholarships with their descriptions and requirements. Use this information to answer the user's question.
---
{scholarship_context}
---

If the user's question is about external scholarships (e.g., from foundations like Samsung, Hyundai), use the information from the external scholarship search results.
---
{external_scholarship_context}
---

If the context does not contain the answer, state that you don't have enough information but can answer questions about the provided scholarships. Do not make up information.
If the question is a general greeting or not related to scholarships, provide a friendly and helpful response.

CURRENT QUESTION:
{user_question}

ANSWER:
`;

/**
 * Generates a response from the chatbot using a RAG approach.
 */
export const getChatbotResponse = async (
  query: string,
  history: ChatMessage[],
  internalScholarships: AllScholarships[],
  onStatusUpdate: (status: string) => void
): Promise<{ answer: string; sources: (AllScholarships | ExternalScholarship)[] }> => {
  try {
    onStatusUpdate("Analyzing your question...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate analysis

    const queryLower = query.toLowerCase();
    const isExternalQuery = ['samsung', 'hyundai', 'posco', '외부', '교외'].some(kw => queryLower.includes(kw));
    
    let externalSources: ExternalScholarship[] = [];
    if (isExternalQuery) {
      onStatusUpdate("Searching for external scholarships...");
      externalSources = await searchExternalScholarships(query);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    onStatusUpdate("Finding relevant information...");
    // Simple keyword matching for RAG context
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const relevantInternalScholarships = internalScholarships.filter(s => {
      const content = `${s.title} ${s.summary} ${s.fullDescription}`.toLowerCase();
      return queryWords.some(word => content.includes(word));
    });

    const sources: (AllScholarships | ExternalScholarship)[] = [...relevantInternalScholarships, ...externalSources];

    if (sources.length === 0 && !isExternalQuery) {
       // If no specific internal scholarships match, provide all internal ones for broader context.
       sources.push(...internalScholarships);
    }

    const scholarshipContext = sources.map(s => `Title: ${s.title}\nSummary: ${s.summary}`).join('\n\n');
    const externalContext = externalSources.map(s => `Title: ${s.title}\nFoundation: ${s.foundation}\nSummary: ${s.summary}`).join('\n\n');
    
    const historyText = history.map(m => {
        return `${m.sender === 'user' ? 'User' : 'Bot'}: ${m.text || ''}`;
    }).join('\n');


    const finalPrompt = RAG_PROMPT_TEMPLATE
      .replace('{conversation_history}', historyText || 'No conversation history yet.')
      .replace('{scholarship_context}', scholarshipContext || 'No internal scholarship information available.')
      .replace('{external_scholarship_context}', externalContext || 'No external scholarship information available.')
      .replace('{user_question}', query);

    onStatusUpdate("Generating a response with AI...");
    
    // Following the Gemini API guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
    });
    
    const answer = response.text;

    return { answer, sources };

  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return {
      answer: "I'm sorry, but I encountered an error while processing your request. Please try again later.",
      sources: [],
    };
  }
};

/**
 * Uses Gemini to review a student's scholarship application statement.
 */
export const getStatementReview = async (statement: string): Promise<string> => {
  if (!statement.trim()) {
    return "Please provide a statement to review.";
  }
  try {
    const prompt = `You are an expert scholarship application advisor. Review the following personal statement and provide constructive feedback. Focus on clarity, persuasiveness, and impact. Provide specific suggestions for improvement in a friendly and encouraging tone. The feedback should be in Korean.

STATEMENT:
---
${statement}
---

FEEDBACK:`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error getting statement review:", error);
    return "Sorry, an error occurred while reviewing your statement. Please try again.";
  }
};