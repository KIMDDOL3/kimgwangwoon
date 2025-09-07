


// FIX: Corrected import paths
import { ExternalScholarship } from '../types';
import { EXTERNAL_SCHOLARSHIPS } from '../constants';

/**
 * Simulates calling an external API or service (like a LangChain tool)
 * to search for scholarships from outside foundations.
 */
export const searchExternalScholarships = async (
  query: string,
  topK: number = 3
): Promise<ExternalScholarship[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const queryWords = new Set(query.toLowerCase().split(/\s+/).filter(w => w.length > 1));
  if (queryWords.size === 0) {
    return [];
  }

  const scoredScholarships = EXTERNAL_SCHOLARSHIPS.map(scholarship => {
    const content = `${scholarship.title} ${scholarship.foundation} ${scholarship.summary}`.toLowerCase();
    let score = 0;
    
    queryWords.forEach(word => {
      if (content.includes(word)) {
        score++;
      }
    });

    // Bonus for matching foundation or title directly
    if (scholarship.title.toLowerCase().includes(query) || scholarship.foundation.toLowerCase().includes(query)) {
        score += 2;
    }

    return { scholarship, score };
  });

  return scoredScholarships
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.scholarship);
};