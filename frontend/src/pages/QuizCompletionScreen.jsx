// components/quiz/QuizCompletionScreen.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Trophy, CheckCircle, XCircle, Clock, Target, Home, Sparkles } from "lucide-react";

const QuizCompletionScreen = ({ quizStats, totalQuestions, totalTime }) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const scorePercent = ((quizStats.correct / totalQuestions) * 100).toFixed(1);

  // Dynamic performance message and colors
  let performance = {
    text: "",
    color: "",
    bg: "",
  };

  if (scorePercent >= 80) {
    performance.text = "Outstanding! 🌟 You nailed it!";
    performance.color = "text-green-600";
    performance.bg = "from-green-400 via-emerald-500 to-green-600";
  } else if (scorePercent >= 50) {
    performance.text = "Good Effort 💪 Keep Improving!";
    performance.color = "text-yellow-600";
    performance.bg = "from-yellow-400 via-amber-500 to-orange-500";
  } else {
    performance.text = "Don’t Give Up! 🔥 Practice Makes Perfect!";
    performance.color = "text-red-600";
    performance.bg = "from-red-400 via-rose-500 to-pink-500";
  }

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br ${performance.bg} animate-gradient-x`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] p-8 sm:p-10 text-center relative overflow-hidden border border-white/20">
        {/* Animated Sparkles */}
        <Sparkles className="absolute top-4 right-4 text-yellow-400 animate-pulse" size={24} />

        {/* Trophy Icon */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500 p-5 rounded-full shadow-lg animate-bounce">
            <Trophy size={48} className="text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Header */}
        <h2 className="text-3xl font-extrabold mt-16 mb-2 text-gray-800">
          Quiz Completed 🎉
        </h2>
        <p className={`text-lg border-b-2 border-black pb-2 font-semibold mb-6 ${performance.color}`}>
          {performance.text}
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 text-gray-700 mb-8">
          <div className="bg-green-50 rounded-xl p-4 hover:scale-105 transition">
            <CheckCircle className="mx-auto text-green-500 mb-2" size={26} />
            <p className="font-semibold text-lg">{quizStats.correct}</p>
            <p className="text-sm text-gray-500">Correct</p>
          </div>

          <div className="bg-red-50 rounded-xl p-4 hover:scale-105 transition">
            <XCircle className="mx-auto text-red-500 mb-2" size={26} />
            <p className="font-semibold text-lg">{quizStats.incorrect}</p>
            <p className="text-sm text-gray-500">Incorrect</p>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 hover:scale-105 transition">
            <Clock className="mx-auto text-blue-500 mb-2" size={26} />
            <p className="font-semibold text-lg">{formatTime(totalTime)}</p>
            <p className="text-sm text-gray-500">Time Taken</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 hover:scale-105 transition">
            <Target className="mx-auto text-yellow-500 mb-2" size={26} />
            <p className="font-semibold text-lg">{scorePercent}%</p>
            <p className="text-sm text-gray-500">Score</p>
          </div>
        </div>

        {/* Return Button */}
        <Link
          to="/analytics"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-black to-gray-800 text-white px-6 py-3 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-200"
        >
          <Home size={18} />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default QuizCompletionScreen;
