const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const {
  extractSkills,
  extractExperience,
  extractEducation,
  extractRequiredExperience,
  generateExplanation
} = require("../services/extractor");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload-resumes", upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const jobDescription = req.body.jd;
    if (!jobDescription) {
      return res.status(400).json({ error: "Job Description missing" });
    }

    const jdSkills = extractSkills(jobDescription);
    const requiredExperience = extractRequiredExperience(jobDescription);
    const requiredEducation = "Bachelors"; // MVP hardcoded


    // Get weights from request (or use defaults)
const skillWeight = parseFloat(req.body.skillWeight) || 0.5;
const experienceWeight = parseFloat(req.body.experienceWeight) || 0.3;
const educationWeight = parseFloat(req.body.educationWeight) || 0.2;

// Normalize weights (ensure total = 1)
const totalWeight = skillWeight + experienceWeight + educationWeight;

const normalizedSkillWeight = skillWeight / totalWeight;
const normalizedExperienceWeight = experienceWeight / totalWeight;
const normalizedEducationWeight = educationWeight / totalWeight;

    const results = [];

    for (let file of req.files) {
      const dataBuffer = fs.readFileSync(file.path);
      const pdfData = await pdfParse(dataBuffer);

      const resumeSkills = extractSkills(pdfData.text);
      const resumeExperience = extractExperience(pdfData.text);
      const resumeEducation = extractEducation(pdfData.text);

      const matchedSkills = resumeSkills.filter(skill =>
        jdSkills.includes(skill)
      );

      // Skills Score
      const skillScore =
        jdSkills.length === 0
          ? 100
          : (matchedSkills.length / jdSkills.length) * 100;

      // Experience Score
      const experienceScore =
        requiredExperience === 0
          ? 100
          : resumeExperience >= requiredExperience
            ? 100
            : (resumeExperience / requiredExperience) * 100;

      // Education Score
      const educationScore =
        resumeEducation === requiredEducation ? 100 : 50;

      // Final Weighted Score
      const finalScore =
  (normalizedSkillWeight * skillScore) +
  (normalizedExperienceWeight * experienceScore) +
  (normalizedEducationWeight * educationScore);

      // Generate Explanation
      const explanation = generateExplanation({
        matchedSkills,
        jdSkills,
        resumeExperience,
        requiredExperience,
        resumeEducation,
        requiredEducation
      });

      results.push({
        fileName: file.originalname,
        resumeSkills,
        resumeExperience,
        resumeEducation,
        matchedSkills,
        skillScore: Math.round(skillScore),
        experienceScore: Math.round(experienceScore),
        educationScore,
        finalScore: Math.round(finalScore),
        explanation
      });

      fs.unlinkSync(file.path);
    }

  results.sort((a, b) => b.finalScore - a.finalScore);

res.json({
  jdSkills,
  weightsUsed: {
    skill: normalizedSkillWeight,
    experience: normalizedExperienceWeight,
    education: normalizedEducationWeight
  },
  biasAudit: {
    scoringFactors: ["skills", "experience", "education"],
    excludedFactors: [
      "name",
      "gender",
      "location",
      "university prestige",
      "age"
    ],
    usesDemographics: false
  },
  rankedCandidates: results
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;