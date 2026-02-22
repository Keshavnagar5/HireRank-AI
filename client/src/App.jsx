import { useState } from "react";
import axios from "axios";

function App() {
  const [jd, setJd] = useState("");
  const [files, setFiles] = useState([]);
  const [skillWeight, setSkillWeight] = useState(0.5);
  const [experienceWeight, setExperienceWeight] = useState(0.3);
  const [educationWeight, setEducationWeight] = useState(0.2);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("jd", jd);
    formData.append("skillWeight", skillWeight);
    formData.append("experienceWeight", experienceWeight);
    formData.append("educationWeight", educationWeight);

    for (let i = 0; i < files.length; i++) {
      formData.append("resumes", files[i]);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/upload-resumes",
        formData
      );
      setResults(res.data);
    } catch (err) {
      alert("Error processing resumes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        dark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 via-white to-blue-100"
      }`}
    >
      <div className="flex justify-end p-4">
        <button
          onClick={() => setDark(!dark)}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm"
        >
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8 bg-white/80 dark:bg-gray-800 shadow-2xl rounded-2xl backdrop-blur-lg transition-all">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-600 dark:text-indigo-400">
          HireRank AI
        </h1>

        {/* JD */}
        <textarea
          className="w-full p-3 border rounded-lg mb-6 dark:bg-gray-700 dark:border-gray-600"
          rows="4"
          placeholder="Paste Job Description..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />

        {/* Upload */}
        <input
          type="file"
          multiple
          className="mb-6"
          onChange={(e) => setFiles(e.target.files)}
        />

        {/* Sliders */}
        <Slider label="Skills" value={skillWeight} setValue={setSkillWeight} />
        <Slider
          label="Experience"
          value={experienceWeight}
          setValue={setExperienceWeight}
        />
        <Slider
          label="Education"
          value={educationWeight}
          setValue={setEducationWeight}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold mt-6 transition-all"
        >
          {loading ? "Processing..." : "Screen Candidates"}
        </button>

        {/* Results */}
        {results && (
          <div className="mt-10 space-y-4">
            {results.rankedCandidates.map((candidate, index) => (
              <CandidateCard
                key={index}
                index={index}
                candidate={candidate}
                dark={dark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({ label, value, setValue }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full accent-indigo-600"
      />
    </div>
  );
}

function CandidateCard({ candidate, index, dark }) {
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div
      className={`p-6 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] ${
        dark ? "bg-gray-700" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">
          #{index + 1} – {candidate.fileName}
        </h3>
        <span
          className={`${getScoreColor(
            candidate.finalScore
          )} text-white px-4 py-1 rounded-full font-bold`}
        >
          {candidate.finalScore}
        </span>
      </div>

      <p className="mt-3 text-sm opacity-80">
        {candidate.explanation}
      </p>
    </div>
  );
}

export default App;