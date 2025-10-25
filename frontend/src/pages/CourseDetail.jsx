import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnectors.jsx";
import toast from "react-hot-toast";
import { setSubjectData, setModulesData, setTotalModules } from "../slices/viewCoursesSlice.jsx";
import {
  Calculator,
  Atom,
  Globe,
  BookOpen,
  Languages,
  Palette,
  Music,
  Code,
  Brain,
  FlaskConical,
  Dna,
  History,
  Users,
  Lock,
  Unlock,
  Play,
  RotateCcw,
  BarChart3,
  CheckCircle2,
  Clock,
  Trophy,
  Star,
  ArrowLeft,
  Zap,
  Target,
} from "lucide-react";

// Subject icon mapping (same as Dashboard)
const subjectIcons = {
  mathematics: { icon: Calculator, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50" },
  math: { icon: Calculator, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50" },
  science: { icon: Atom, color: "from-purple-500 to-pink-500", bg: "bg-purple-50" },
  physics: { icon: Atom, color: "from-indigo-500 to-purple-500", bg: "bg-indigo-50" },
  chemistry: { icon: FlaskConical, color: "from-green-500 to-emerald-500", bg: "bg-green-50" },
  biology: { icon: Dna, color: "from-teal-500 to-cyan-500", bg: "bg-teal-50" },
  english: { icon: BookOpen, color: "from-rose-500 to-pink-500", bg: "bg-orange-50" },
  language: { icon: Languages, color: "from-pink-500 to-rose-500", bg: "bg-pink-50" },
  history: { icon: History, color: "from-amber-500 to-orange-500", bg: "bg-amber-50" },
  geography: { icon: Globe, color: "from-emerald-500 to-teal-500", bg: "bg-emerald-50" },
  "social science": { icon: Users, color: "from-violet-500 to-purple-500", bg: "bg-violet-50" },
  art: { icon: Palette, color: "from-rose-500 to-pink-500", bg: "bg-rose-50" },
  music: { icon: Music, color: "from-fuchsia-500 to-purple-500", bg: "bg-fuchsia-50" },
  computer: { icon: Code, color: "from-slate-500 to-gray-500", bg: "bg-slate-50" },
  default: { icon: Brain, color: "from-purple-500 to-indigo-500", bg: "bg-purple-50" },
};

const getSubjectIcon = (subjectName) => {
  const name = subjectName.toLowerCase();
  if (subjectIcons[name]) return subjectIcons[name];

  for (const [key, value] of Object.entries(subjectIcons)) {
    if (name.includes(key) || key.includes(name)) {
      return value;
    }
  }
  return subjectIcons.default;
};

const CourseDetail = () => {
  const { courseName, courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subject, modules, totalModules } = useSelector((state) => state.viewCourse);
  const { signupData } = useSelector((state) => state.auth);
  const googleId = signupData?.googleId;

  const [attemptedList, setAttemptedList] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedSubModuleId, setSelectedSubModuleId] = useState(null);
  const [loading, setLoading] = useState(true);

  const subjectConfig = subject ? getSubjectIcon(subject.name) : subjectIcons.default;
  const IconComponent = subjectConfig.icon;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await apiConnector("GET", `/courses/${courseName}`);
        dispatch(setSubjectData(response.data.subject));
        dispatch(setModulesData(response.data.modules));
        dispatch(setTotalModules(response.data.totalModules));
      } catch (err) {
        console.error("Error fetching course details:", err);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseName, dispatch]);

  useEffect(() => {
    const fetchAttemptedSubModules = async () => {
      try {
        const response = await apiConnector(
          "GET",
          `users/attempted-submodule/?googleId=${googleId}&subjectId=${courseId}`
        );
        setAttemptedList(response.data?.attemptedSubmodules || []);
      } catch (err) {
        console.error("Error fetching attempted submodules:", err);
      }
    };

    if (googleId && courseId) {
      fetchAttemptedSubModules();
    }
  }, [googleId, courseId]);

  const resetQuizData = async (googleId, subModuleId) => {
    try {
      const response = await apiConnector("POST", "/users/reset-quiz", {
        data: { googleId, subModuleId },
      });
      toast.success("Quiz reset successfully!");
    } catch (error) {
      console.error("Error resetting quiz data:", error);
      toast.error("Failed to reset quiz");
    }
  };

  const continueHandler = () => {
    resetQuizData(signupData?.googleId, selectedSubModuleId);
    setConfirmationModal(false);
    if (selectedSubModuleId) {
      navigate(`/course/${subject.id}/${selectedSubModuleId}`);
    }
  };

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      easy: { color: "bg-green-500", text: "text-green-700", border: "border-green-200", icon: "🟢" },
      medium: { color: "bg-yellow-500", text: "text-yellow-700", border: "border-yellow-200", icon: "🟡" },
      hard: { color: "bg-red-500", text: "text-red-700", border: "border-red-200", icon: "🔴" },
    };
    return configs[difficulty?.toLowerCase()] || configs.medium;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdebff] pt-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!subject || !modules) {
    return (
      <div className="min-h-screen bg-[#fdebff] pt-4 flex items-center justify-center">
        <div className="text-center">
          <Brain size={64} className="mx-auto text-purple-400 mb-4" />
          <p className="text-gray-600 text-lg">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdebff] pt-4 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Confirmation Modal */}
        {confirmationModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
              <div className="text-center mb-6">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw size={32} className="text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Reset Quiz Progress?</h3>
                <p className="text-gray-600">
                  This will clear all your previous attempts and statistics for this quiz.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmationModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Cancel
                </button>
                <button
                  onClick={continueHandler}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium">
                  Reset & Start
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate("/quizzes")}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-purple-200 text-purple-700 font-medium shadow-sm hover:bg-white/60 hover:shadow-md transition-all mb-4"
        >
          <ArrowLeft
            size={22}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          <span>Back to Quizzes</span>
        </button>


        {/* Course Header */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className={`bg-gradient-to-br ${subjectConfig.color} p-8 relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10 flex items-start gap-6">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm p-4 rounded-2xl">
                <IconComponent size={48} className="text-white" />
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold mb-3">{subject.name}</h1>
                <p className="text-white text-opacity-90 text-lg mb-4">
                  {subject.description || "Master this subject with comprehensive modules and quizzes"}
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Star size={18} className="text-yellow-300" />
                    <span className="font-semibold">4.8 Rating</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Target size={18} />
                    <span className="font-semibold">{totalModules} Modules</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Trophy size={18} />
                    <span className="font-semibold">
                      {modules.reduce((acc, m) => acc + m.subModules.length, 0)} Quizzes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-6">
          {modules.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
              <Brain size={64} className="mx-auto text-purple-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Modules Available</h3>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          ) : (
            modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Module Header */}
                <div className="bg-[#b84dff] p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{moduleIndex + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white">{module.name}</h3>
                      <p className="text-white text-opacity-80 text-sm mt-1">
                        {module.subModules.length} quizzes available
                      </p>
                    </div>
                  </div>
                </div>

                {/* SubModules */}
                <div className="p-6 space-y-3">
                  {module.subModules.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No quizzes available in this module</p>
                  ) : (
                    module.subModules.map((subModule) => {
                      const difficultyConfig = getDifficultyConfig(subModule.difficulty);
                      const isAttempted = attemptedList.includes(subModule.id);
                      const isLocked = !signupData.isSubscribed && subModule.isPro;

                      return (
                        <div
                          key={subModule.id}
                          className={`group relative bg-gradient-to-r ${
                            isAttempted ? "from-green-50 to-emerald-50" : "from-gray-50 to-gray-100"
                          } p-5 rounded-xl hover:shadow-lg transition-all border-2 ${
                            isAttempted ? "border-green-200" : "border-gray-200"
                          }`}>
                          <div className="flex items-center justify-between">
                            {/* Left Side - Quiz Info */}
                            <div className="flex items-center gap-4 flex-1">
                              {/* Lock/Unlock Icon */}
                              <div
                                className={`p-3 rounded-lg ${
                                  isLocked ? "bg-gray-200" : isAttempted ? "bg-green-100" : "bg-purple-100"
                                }`}>
                                {isLocked ? (
                                  <Lock size={24} className="text-gray-600" />
                                ) : isAttempted ? (
                                  <CheckCircle2 size={24} className="text-green-600" />
                                ) : (
                                  <Unlock size={24} className="text-purple-600" />
                                )}
                              </div>

                              {/* Quiz Details */}
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-lg font-semibold text-gray-800">{subModule.name}</h4>
                                  {subModule.isPro && (
                                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                      <Zap size={12} />
                                      PRO
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                  <span
                                    className={`${difficultyConfig.color} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                                    {subModule.difficulty}
                                  </span>
                                  <span className="text-gray-500 flex items-center gap-1">
                                    <Clock size={14} />
                                    {subModule.questionCount || 10} questions
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right Side - Action Buttons */}
                            <div className="flex items-center gap-3">
                              {isAttempted ? (
                                <>
                                  {/* <Link to={`/courses/view-stats/${subModule.id}`}>
                                    <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium">
                                      <BarChart3 size={18} />
                                      View Stats
                                    </button>
                                  </Link> */}
                                  <button
                                    onClick={() => {
                                      setSelectedSubModuleId(subModule.id);
                                      setConfirmationModal(true);
                                    }}
                                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium">
                                    <RotateCcw size={18} />
                                    Retry
                                  </button>
                                </>
                              ) : (
                                <>
                                  {isLocked ? (
                                    <button
                                      onClick={() => toast.error("Upgrade to Pro to access this quiz")}
                                      className="flex items-center gap-2 bg-gray-300 text-gray-600 px-5 py-2.5 rounded-lg cursor-not-allowed font-medium">
                                      <Lock size={18} />
                                      Locked
                                    </button>
                                  ) : (
                                    <Link to={`/course/${subject.id}/${subModule.id}`}>
                                      <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-5 py-2.5 rounded-lg hover:shadow-lg transition-all font-medium">
                                        <Play size={18} />
                                        Start Quiz
                                      </button>
                                    </Link>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
