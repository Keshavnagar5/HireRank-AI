const knownSkills = [
  "Java", "Python", "SQL", "React", "Node.js", "Express",
  "MongoDB", "MySQL", "AWS", "Docker", "Redis",
  "Machine Learning", "Data Structures", "Algorithms"
];

// -------- SKILLS --------
function extractSkills(text) {
  const foundSkills = [];

  knownSkills.forEach(skill => {
    const regex = new RegExp(skill, "i");
    if (regex.test(text)) {
      foundSkills.push(skill);
    }
  });

  return foundSkills;
}

// -------- EXPERIENCE (Resume) --------
function extractExperience(text) {
  const experienceRegex = /(\d+)\+?\s*(years|year)/gi;
  let match;
  let maxYears = 0;

  while ((match = experienceRegex.exec(text)) !== null) {
    const years = parseInt(match[1]);
    if (years > maxYears) {
      maxYears = years;
    }
  }

  // Detect internship as 1 year for MVP
  if (/intern/i.test(text)) {
    maxYears = Math.max(maxYears, 1);
  }

  return maxYears;
}

// -------- EXPERIENCE (JD Requirement) --------
function extractRequiredExperience(text) {
  const regex = /(\d+)\+?\s*(years|year)/gi;
  const match = regex.exec(text);

  if (match) {
    return parseInt(match[1]);
  }

  return 0; // if not mentioned in JD
}

// -------- EDUCATION --------
function extractEducation(text) {
  if (/B\.?Tech|Bachelor/i.test(text)) return "Bachelors";
  if (/M\.?Tech|Master/i.test(text)) return "Masters";
  if (/PhD/i.test(text)) return "PhD";
  return "Unknown";
}

// -------- EXPLANATION --------
function generateExplanation({
  matchedSkills,
  jdSkills,
  resumeExperience,
  requiredExperience,
  resumeEducation,
  requiredEducation
}) {
  let explanation = "";

  explanation += `Matched ${matchedSkills.length} out of ${jdSkills.length} required skills. `;

  if (requiredExperience === 0) {
    explanation += "No minimum experience specified in JD. ";
  } else if (resumeExperience >= requiredExperience) {
    explanation += `Meets required experience of ${requiredExperience} years. `;
  } else {
    explanation += `Has ${resumeExperience} years experience, below required ${requiredExperience} years. `;
  }

  if (resumeEducation === requiredEducation) {
    explanation += "Education meets requirement.";
  } else {
    explanation += `Education level detected as ${resumeEducation}.`;
  }

  return explanation;
}

module.exports = {
  extractSkills,
  extractExperience,
  extractRequiredExperience,
  extractEducation,
  generateExplanation
};