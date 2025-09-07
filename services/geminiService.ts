import { GoogleGenAI } from "@google/genai";
import { AllScholarships, ChatMessage, ExternalScholarship } from "../types";
import { searchExternalScholarships } from "./externalScholarshipService";

// According to guidelines, initialize with apiKey from environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const RAG_PROMPT_TEMPLATE = `You are an expert AI assistant for students at Chonnam National University, specializing in scholarships. Your primary goal is to provide accurate, clear, and helpful information based *only* on the context provided. You must be friendly and encouraging.

**INSTRUCTIONS:**
1.  **Analyze the User's Question:** Carefully understand what the student is asking about.
2.  **Use Provided Context Only:** Base your entire answer on the "Scholarship Information" and "Conversation History" provided below. Do not use any external knowledge.
3.  **Check Eligibility:** When a student asks if they are eligible for a scholarship, meticulously check the requirements (GPA, income bracket, department, year) from the context. Clearly state which requirements are met and which are not.
4.  **Be Clear and Direct:** If the information is not in the context, state that clearly. For example, say "The provided information does not specify the exact application deadline for that scholarship."
5.  **Do Not Make Promises:** Never guarantee that a student will receive a scholarship. Use phrases like "You may be eligible" or "This scholarship seems like a good fit."
6.  **Friendly Tone:** Maintain a supportive and helpful tone throughout the conversation.

---
**CONVERSATION HISTORY:**
{conversation_history}
---
**SCHOLARSHIP INFORMATION (CONTEXT):**

**Internal Scholarships:**
{scholarship_context}

**External Scholarships:**
{external_scholarship_context}
---

**CURRENT QUESTION:**
{user_question}

**YOUR ANSWER (in Korean):**
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

    const scholarshipContext = sources
      .filter((s): s is AllScholarships => 'fullDescription' in s)
      .map(s => {
        let reqText = '';
        if (s.requirements) {
          reqText = `\nRequirements: 
- Minimum GPA: ${s.requirements.minGpa || 'Not specified'}
- Max Income Bracket: ${s.requirements.incomeBracket ? `${s.requirements.incomeBracket} or lower` : 'Not specified'}
- Allowed Years: ${s.requirements.allowedYears?.join(', ') || 'All years'}
- Allowed Departments: ${s.requirements.allowedDepartments?.join(', ') || 'All departments'}`;
        }
        return `Title: ${s.title}\nProvider: ${s.provider}\nSummary: ${s.summary}\nFull Description: ${s.fullDescription}${reqText}`;
      }).join('\n\n---\n\n');

    const externalContext = sources
      .filter((s): s is ExternalScholarship => 'foundation' in s)
      .map(s => `Title: ${s.title}\nFoundation: ${s.foundation}\nSummary: ${s.summary}`).join('\n\n---\n\n');
    
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