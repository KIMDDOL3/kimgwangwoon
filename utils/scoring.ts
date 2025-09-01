import { DiagnosticAnswers, AllScholarships, ScoredScholarship } from '../types';

export const scoreScholarships = (
  answers: DiagnosticAnswers,
  scholarships: AllScholarships[]
): ScoredScholarship[] => {
  const scoredList: ScoredScholarship[] = [];

  const userGpa = Number(answers.gpa);
  const userYear = Number(answers.year);
  const userDept = String(answers.department);
  const userIncome = Number(answers.incomeBracket);

  scholarships.forEach(s => {
    // Only score scholarships that have requirements defined.
    if (!s.requirements) {
      return;
    }

    let isDisqualified = false;

    // Hard requirements check for disqualification.
    // If a requirement exists on the scholarship, the user must meet it.
    if (s.requirements.allowedYears && !s.requirements.allowedYears.includes(userYear)) {
      isDisqualified = true;
    }
    if (s.requirements.allowedDepartments && !s.requirements.allowedDepartments.includes(userDept)) {
      isDisqualified = true;
    }
    if (s.requirements.minGpa && userGpa < s.requirements.minGpa) {
      isDisqualified = true;
    }
    if (s.requirements.incomeBracket && userIncome > s.requirements.incomeBracket) {
      isDisqualified = true;
    }

    if (isDisqualified) {
      // Exclude disqualified scholarships entirely from recommendations.
      return;
    }

    // If not disqualified, calculate a score based on the specificity of the scholarship.
    // More specific scholarships (with more criteria) get a higher score.
    const reasons: string[] = [];
    let points = 0;
    const maxPoints = 100; // Total possible points for all criteria types

    if (s.requirements.minGpa) {
        points += 40;
        reasons.push(`성적 요건 충족 (기준: ${s.requirements.minGpa}+)`);
    }
    if (s.requirements.incomeBracket) {
        points += 30;
        reasons.push(`소득분위 요건 충족 (기준: ${s.requirements.incomeBracket}구간 이하)`);
    }
    if (s.requirements.allowedYears) {
        points += 15;
        reasons.push(`학년 요건 충족 (${s.requirements.allowedYears.join(', ')}학년)`);
    }
    if (s.requirements.allowedDepartments) {
        points += 15;
        reasons.push(`학과 요건 충족 (${s.requirements.allowedDepartments.join(', ')})`);
    }

    // The proportion of points reflects how specific this scholarship is.
    const specificityProportion = points / maxPoints;

    // Every eligible scholarship gets a base score for visibility.
    const baseScore = 50;
    
    // The final score is the base score plus a proportional amount of the remaining score range.
    // This scales from 50 (for a general scholarship) to 100 (for a very specific one).
    const finalScore = Math.round(baseScore + (specificityProportion * (100 - baseScore)));
    
    if (reasons.length === 0) {
        reasons.push("기본 요건을 충족합니다.");
    }

    // FIX: Construct ScoredScholarship by spreading the original scholarship object to ensure all properties from AllScholarships are carried over.
    const scoredItem: ScoredScholarship = {
        ...s,
        score: finalScore,
        reasons,
    };
    scoredList.push(scoredItem);
  });

  return scoredList.sort((a, b) => b.score - a.score);
};