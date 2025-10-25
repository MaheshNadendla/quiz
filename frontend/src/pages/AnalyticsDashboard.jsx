import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { apiConnector } from "../services/apiConnectors";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import { Clock, CheckCircle, XCircle, Star, TrendingUp, Award, Target, Activity, Calendar, Zap } from "lucide-react";

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    stats: {
      totalTimeSpent: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalQuestions: 0,
      totalQuizzes: 0,
      bestScore: 0,
    },
    questionClassification: {
      important: [],
      ok: [],
      bad: [],
      common: [],
    },
    timeline: [],
    activity: [],
  });
  const [loading, setIsLoading] = useState(false);

  const { signupData } = useSelector((state) => state.auth);
  const googleId = signupData.googleId;
  const { subModuleId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiConnector(
          "GET",
          `/users/analytics?googleId=${googleId}&subModuleId=${subModuleId || ""}`
        );
        console.log("Analytics Response:", response);
        setData(response.data.responseData || {});
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading analytics:", err);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [googleId, subModuleId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes("Score") || entry.name.includes("Accuracy") ? "%" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl font-semibold">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  const totalCorrect = data.stats.correctAnswers || 0;
  const totalIncorrect = data.stats.incorrectAnswers || 0;
  const totalQuestions = data.stats.totalQuestions || 0;
  const totalQuizzes = data.stats.totalQuizzes || 0;
  const bestScore = data.stats.bestScore || 0;
  const answered = totalCorrect + totalIncorrect;
  const avgScore = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const accuracy = answered ? Math.round((totalCorrect / answered) * 100) : 0;

  // Use actual timeline data from backend
  const processedTimeline =
    data.timeline && data.timeline.length > 0 ? data.timeline : [{ label: "No Data", score: 0, accuracy: 0 }];

  // Use actual activity data from backend
  const processedActivity =
    data.activity && data.activity.length > 0
      ? data.activity
      : Array.from({ length: 14 }, (_, i) => ({
          day: `Day ${i + 1}`,
          count: 0,
        }));

  // Question classification data
  const classificationData = [
    {
      name: "Important",
      value: data.questionClassification?.important?.length || 0,
      color: "#f59e0b",
      icon: "⭐",
    },
    {
      name: "Got It",
      value: data.questionClassification?.ok?.length || 0,
      color: "#10b981",
      icon: "👍",
    },
    {
      name: "Difficult",
      value: data.questionClassification?.bad?.length || 0,
      color: "#ef4444",
      icon: "🚫",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fdebff] p-4 md:p-8 pt-20 md:pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-600 bg-clip-text text-transparent">
              Your Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Track your progress and performance</p>
          </div>
          
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Quizzes Attempted */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
              <div className="bg-white/20 rounded-full p-2">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalQuizzes}</div>
            <div className="text-blue-100 text-sm font-medium">Quizzes Attempted</div>
          </div>

          {/* Correct Answers */}
          <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-2xl shadow-lg text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-80" />
              <div className="bg-white/20 rounded-full p-2">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalCorrect}</div>
            <div className="text-green-100 text-sm font-medium">Correct Answers</div>
          </div>

          {/* Incorrect Answers */}
          <div className="bg-gradient-to-br from-red-400 to-red-500 p-6 rounded-2xl shadow-lg text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 opacity-80" />
              <div className="bg-white/20 rounded-full p-2">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalIncorrect}</div>
            <div className="text-red-100 text-sm font-medium">Incorrect Answers</div>
          </div>

          {/* Average Score */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-6 rounded-2xl shadow-lg text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 opacity-80" />
              <div className="bg-white/20 rounded-full p-2">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{avgScore}%</div>
            <div className="text-purple-100 text-sm font-medium">Average Score</div>
          </div>

          {/* Accuracy */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-2xl shadow-lg text-white transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 opacity-80" />
              <div className="bg-white/20 rounded-full p-2">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{accuracy}%</div>
            <div className="text-orange-100 text-sm font-medium">Accuracy Rate</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Trend Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Score Trend</h3>
                  <p className="text-sm text-gray-500">Your performance over time</p>
                </div>
              </div>
              {/* Latest Score Display */}
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {processedTimeline[processedTimeline.length - 1]?.score || 0}%
                </div>
                <div
                  className={`text-sm font-semibold ${
                    (processedTimeline[processedTimeline.length - 1]?.score || 0) >=
                    (processedTimeline[processedTimeline.length - 2]?.score || 0)
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                  {(processedTimeline[processedTimeline.length - 1]?.score || 0) >=
                  (processedTimeline[processedTimeline.length - 2]?.score || 0)
                    ? "↑"
                    : "↓"}{" "}
                  {Math.abs(
                    (processedTimeline[processedTimeline.length - 1]?.score || 0) -
                      (processedTimeline[processedTimeline.length - 2]?.score || 0)
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>
            <div className="h-80 bg-gray-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScoreStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorScoreStock)"
                    dot={{ fill: "#10b981", r: 4, strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Activity</h3>
                  <p className="text-sm text-gray-500">Last 14 days</p>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={{ stroke: "#e5e7eb" }} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={{ stroke: "#e5e7eb" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="url(#colorBar)" radius={[8, 8, 0, 0]} name="Quizzes" />
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Question Classification & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Question Classification */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-2 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Question Classification</h3>
                <p className="text-sm text-gray-500">How you marked questions</p>
              </div>
            </div>
            <div className="space-y-4">
              {classificationData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{item.name}</span>
                      <span className="font-bold text-lg" style={{ color: item.color }}>
                        {item.value}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${totalQuestions ? (item.value / totalQuestions) * 100 : 0}%`,
                          backgroundColor: item.color,
                        }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 p-2 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Highlights</h3>
                <p className="text-sm text-gray-500">Your best achievements</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {/* Best Score */}
              <div className="p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-500 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-600 font-medium">Best Score</span>
                </div>
                <div className="text-3xl font-bold text-yellow-600">{bestScore}%</div>
              </div>

              {/* Total Questions */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-600 font-medium">Total Questions</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{totalQuestions}</div>
              </div>

              {/* Time Spent */}
              <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-purple-500 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-gray-600 font-medium">Time Spent</span>
                </div>
                <div className="text-3xl font-bold text-purple-600">{formatTime(data.stats.totalTimeSpent || 0)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8" />
            <h3 className="font-bold text-2xl">Performance Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
              <div className="text-white/80 text-sm mb-2">Overall Progress</div>
              <div className="text-4xl font-bold mb-2">{avgScore}%</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${avgScore}%` }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
              <div className="text-white/80 text-sm mb-2">Success Rate</div>
              <div className="text-4xl font-bold mb-2">{accuracy}%</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-green-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${accuracy}%` }}></div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20">
              <div className="text-white/80 text-sm mb-2">Completion Rate</div>
              <div className="text-4xl font-bold mb-2">
                {totalQuestions ? Math.round((answered / totalQuestions) * 100) : 0}%
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${totalQuestions ? (answered / totalQuestions) * 100 : 0}%`,
                  }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
