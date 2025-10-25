import { useState, useEffect } from "react";
import { apiConnector } from "../services/apiConnectors";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import QuizCompletionScreen from "./QuizCompletionScreen";
import TrueFalseQuestion from "../components/quiz/TrueFalseQuestion";
import FillBlanksQuestion from "../components/quiz/FillBlanksQuestion";
import MatchFollowingQuestion from "../components/quiz/MatchFollowingQuestion";
import { CheckCircle, XCircle, Circle } from "lucide-react";

const QuizInterface = () => {
  const { subModule_id, subjectId } = useParams();
  const submoduleId = subModule_id;

  // Enhanced state management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [notes, setNotes] = useState("");
  const [importance, setImportance] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isCorrect, setIsCorrect] = useState(null);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
  });
  const [data, setData] = useState([]);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const { signupData } = useSelector((state) => state.auth);
  const googleId = signupData.googleId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await apiConnector("GET", `admin/submodules/${submoduleId}`);
        console.log("this is the data", response.data);
        setData(response.data.submodule.questions);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading courses:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [submoduleId]);

  // Load saved response when changing questions
  useEffect(() => {
    if (data.length > 0) {
      const currentQuestionId = data[currentQuestionIndex]._id;
      const savedResponse = userResponses.find((response) => response.questionId === currentQuestionId);

      if (savedResponse) {
        setNotes(savedResponse.notes || "");
        setImportance(savedResponse.importance || null);
      } else {
        setNotes("");
        setImportance(null);
      }
    }
  }, [currentQuestionIndex, data, userResponses]);

  // Timer effects
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        setQuestionTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const checkAnswer = (userAnswer, isCorrect, questionIndex) => {
    const question = data[questionIndex];

    if (!answers[question._id]) {
      setStats((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      }));
    }

    setIsCorrect(isCorrect);
    setShowAnimation(true);

    setAnswers((prev) => ({
      ...prev,
      [question._id]: {
        userAnswer,
        isCorrect: isCorrect,
      },
    }));

    setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
  };

  const handleOptionSelect = (optionId) => {
    const question = data[currentQuestionIndex];
    const selectedAnswer = question.options.find((opt) => opt._id === optionId);
    const correct = selectedAnswer.isCorrect;

    setSelectedOption(optionId);
    checkAnswer(optionId, correct, currentQuestionIndex);
  };

  const handleQuestionAnswer = (userAnswer, isCorrect) => {
    checkAnswer(userAnswer, isCorrect, currentQuestionIndex);
  };

  const saveResponse = (index = currentQuestionIndex) => {
    const currentQuestionId = data[index]._id;
    const responseData = {
      questionId: currentQuestionId,
      userAnswer: answers[currentQuestionId]?.userAnswer || null,
      isCorrect: answers[currentQuestionId]?.isCorrect || false,
      timeSpent: questionTimer,
      notes,
      importance,
      timestamp: new Date().toISOString(),
    };

    setUserResponses((prev) => {
      const existingResponseIndex = prev.findIndex((response) => response.questionId === currentQuestionId);

      if (existingResponseIndex !== -1) {
        const updatedResponses = [...prev];
        updatedResponses[existingResponseIndex] = {
          ...updatedResponses[existingResponseIndex],
          ...responseData,
        };
        return updatedResponses;
      } else {
        return [...prev, responseData];
      }
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < data.length - 1) {
      saveResponse();
      setCurrentQuestionIndex((prev) => prev + 1);
      const nextQuestion = data[currentQuestionIndex + 1];
      const savedAnswer = answers[nextQuestion._id];

      setSelectedOption(savedAnswer?.userAnswer || null);
      setIsCorrect(savedAnswer?.isCorrect || null);
      setQuestionTimer(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      saveResponse();
      setCurrentQuestionIndex((prev) => prev - 1);
      const prevQuestion = data[currentQuestionIndex - 1];
      const savedAnswer = answers[prevQuestion._id];

      setSelectedOption(savedAnswer?.userAnswer || null);
      setIsCorrect(savedAnswer?.isCorrect || null);
      setQuestionTimer(0);
    }
  };

  const prepareAnalyticsData = () => {
    const allResponses = data.map((question) => {
      const existingResponse = userResponses.find((response) => response.questionId === question._id);

      if (!existingResponse) {
        return {
          questionId: question._id,
          userAnswer: answers[question._id]?.userAnswer || null,
          isCorrect: answers[question._id]?.isCorrect || false,
          timeSpent: 0,
          notes: "",
          importance: null,
          timestamp: new Date().toISOString(),
        };
      }
      return existingResponse;
    });

    const tagCounts = {
      bad: [],
      ok: [],
      important: [],
    };

    const questionAnswers = allResponses.map((response) => {
      if (response.importance) {
        tagCounts[response.importance].push(response.questionId);
      }

      return {
        questionId: response.questionId,
        userAnswer: response.userAnswer,
        isCorrect: response.isCorrect,
        notes: response.notes,
        tag: response.importance || null,
        timeSpent: response.timeSpent,
      };
    });

    return {
      subjectId,
      googleId,
      subModuleId: submoduleId,
      tagCounts,
      questionAnswers,
      totalTimeSpent: timer,
      correctAnswers: stats.correct,
      incorrectAnswers: stats.incorrect,
      progress: (stats.correct / data.length) * 100,
    };
  };

  const handleQuizSubmit = async () => {
    try {
      saveResponse();

      data.forEach((_, index) => {
        if (index !== currentQuestionIndex) {
          saveResponse(index);
        }
      });

      setIsRunning(false);
      const analyticsData = prepareAnalyticsData();
      console.log(analyticsData, "analyticsData");
      await apiConnector("POST", "/users/submit-analytics", analyticsData);
      setIsQuizCompleted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleRevisionClick = () => {
    const samplePdfUrl = "https://scert.telangana.gov.in/pdf/publication/ebooks2019/ix%20physics%20em.pdf";
    window.open(samplePdfUrl, "_blank");
  };

  // Get question status for sidebar
  const getQuestionStatus = (index) => {
    const questionId = data[index]._id;
    const hasAnswer = answers[questionId] !== undefined;
    const response = userResponses.find((r) => r.questionId === questionId);
    const isImportant = response?.importance === "important";

    if (hasAnswer) {
      return isImportant ? "important" : "answered";
    }
    return "not-visited";
  };

  if (isLoading || !data?.length) {
    return (
      <div className="min-h-screen bg-[#f3e5f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-xl font-semibold">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (isQuizCompleted) {
    return <QuizCompletionScreen quizStats={stats} totalQuestions={data.length} totalTime={timer} />;
  }

  const currentQuestion = data[currentQuestionIndex];
  const currentQuestionId = currentQuestion._id;
  const savedAnswer = answers[currentQuestionId];
  const isAnswered = savedAnswer !== undefined;

  return (
    <div className="min-h-screen bg-[#f5ddff] px-32 py-12 ">
      {/* Toast Notification - Top Right */}
      {showAnimation && (
        <div className="fixed top-6 right-6 z-50 animate-slideInRight">
          <div
            className={`${
              isCorrect
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-300"
                : "bg-gradient-to-r from-rose-500 to-pink-600 border-rose-300"
            } text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2`}>
            <div
              className={`w-12 h-12 rounded-full ${
                isCorrect ? "bg-white/20" : "bg-white/20"
              } flex items-center justify-center`}>
              <span className="text-3xl">{isCorrect ? "✓" : "✗"}</span>
            </div>
            <div>
              <div className="font-bold text-lg">{isCorrect ? "Correct!" : "Incorrect!"}</div>
              <div className="text-sm opacity-90">
                {isCorrect ? "Great job! Keep it up!" : "Don't worry, try again!"}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex gap-10 h-[calc(100vh-5rem)]">
        {/* Left Sidebar - Compact */}
        <div className="h-[80vh] w-64 bg-[#e8c7f6] backdrop-blur-sm rounded-2xl p-4 border-2 border-[#440067] flex flex-col ">
          {/* Timer */}
          <div className="bg-yellow-400 text-gray-900 font-bold px-3 py-1.5 rounded-full flex items-center justify-center gap-2 mb-4 text-sm">
            <span>⏱</span>
            <span>{formatTime(timer)}</span>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-1.5 mb-4 flex-shrink-0">
            {data.map((_, index) => {
              const status = getQuestionStatus(index);
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={index}
                  onClick={() => {
                    saveResponse();
                    setCurrentQuestionIndex(index);
                    const question = data[index];
                    const savedAns = answers[question._id];
                    setSelectedOption(savedAns?.userAnswer || null);
                    setIsCorrect(savedAns?.isCorrect || null);
                    setQuestionTimer(0);
                  }}
                  className={`
                    aspect-square rounded-md font-semibold text-xs relative
                    transition-all duration-200 hover:scale-110
                    ${isCurrent ? "ring-2 ring-purple-600 ring-offset-1" : ""}
                    ${
                      status === "answered"
                        ? "bg-green-500 text-white"
                        : status === "important"
                        ? "bg-orange-500 text-white"
                        : "bg-white text-gray-600 border border-gray-300"
                    }
                  `}>
                  {index + 1}
                  {status === "important" && <span className="absolute -top-0.5 -right-0.5 text-[10px]">⭐</span>}
                </button>
              );
            })}
          </div>

          {/* Legend - With Icons */}
          <div className="space-y-2 text-xs flex-shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-gray-700">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-orange-500" />
              <span className="text-gray-700">Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle size={16} className="text-gray-400" />
              <span className="text-gray-700">Not Visited</span>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="w-[70%] flex flex-col h-[85vh] ">
          <div className="flex-1  space-y-4 pr-2">
            {/* Question Card - Compact */}
            <div className=" bg-[#FACDFF] backdrop-blur-sm rounded-2xl p-3 border-2 border-[#440067] mb-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {data.length}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRevisionClick}
                    className="px-3 py-1.5 text-sm bg-white border border-purple-300 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-all">
                    Revision
                  </button>
                  <button
                    onClick={() => setImportance(importance === "important" ? null : "important")}
                    className={`text-xl transition-all ${
                      importance === "important" ? "scale-125" : "opacity-50 hover:opacity-100"
                    }`}>
                    ⭐
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-xl font-bold text-purple-950 mb-2">{currentQuestion.questionText}</h2>

              {/* Options - Compact */}
              <div className="space-y-2 mb-4">
                {(() => {
                  switch (currentQuestion.questionType) {
                    case "mcq":
                      return currentQuestion.options.map((option) => {
                        const isSelected = selectedOption === option._id || savedAnswer?.userAnswer === option._id;
                        const showCorrectness = isSelected && (isCorrect !== null || savedAnswer?.isCorrect !== null);
                        const isCorrectAnswer = isCorrect || savedAnswer?.isCorrect;

                        return (
                          <button
                            key={option._id}
                            className={`w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-all flex items-center gap-3 ${
                              isSelected
                                ? showCorrectness && isCorrectAnswer
                                  ? "bg-[#e2bbf3] border-purple-600 text-purple-900"
                                  : showCorrectness
                                  ? "bg-red-100 border-red-400 text-red-800"
                                  : "bg-purple-200 border-purple-400 text-purple-900"
                                : "bg-[#faefff] border-gray-300 text-purple-800 font-bold hover:border-purple-300 hover:bg-purple-50"
                            }`}
                            onClick={() => handleOptionSelect(option._id)}
                            disabled={isAnswered}>
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected ? "border-purple-600 bg-purple-600" : "border-gray-400"
                              }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                            </div>
                            <span className="flex-1">{option.optionText}</span>
                          </button>
                        );
                      });

                    case "truefalse":
                      return (
                        <TrueFalseQuestion
                          question={currentQuestion}
                          onAnswer={handleQuestionAnswer}
                          savedAnswer={savedAnswer?.userAnswer}
                          isAnswered={isAnswered}
                        />
                      );

                    case "fillblanks":
                      return (
                        <FillBlanksQuestion
                          question={currentQuestion}
                          onAnswer={handleQuestionAnswer}
                          savedAnswer={savedAnswer}
                          isAnswered={isAnswered}
                        />
                      );

                    case "matchfollowing":
                      return (
                        <MatchFollowingQuestion
                          question={currentQuestion}
                          onAnswer={handleQuestionAnswer}
                          savedAnswer={savedAnswer}
                          isAnswered={isAnswered}
                        />
                      );

                    default:
                      return (
                        <div className="text-center text-red-500 p-3 bg-red-50 rounded-xl text-sm">
                          Unsupported question type: {currentQuestion.questionType}
                        </div>
                      );
                  }
                })()}
              </div>

              {/* Importance Indicator */}
              {importance && (
                <div className="flex items-center gap-2 text-xs text-gray-600 bg-purple-50 p-2 rounded-lg">
                  <span className="text-purple-600">ℹ️</span>
                  <span>
                    This is a <span className="font-semibold">{importance}</span> importance question.
                  </span>
                </div>
              )}
            </div>

            {/* Notes Card - Compact */}
            <div className="bg-[#FACDFF] backdrop-blur-sm rounded-2xl p-4 border-2 border-[#440067]">
              <div className="flex items-center gap-2 mb-2 text-purple-700">
                <span className="text-lg">📝</span>
                <span className="font-semibold text-sm">Add Notes for this Question</span>
              </div>
              <textarea
                placeholder="Write your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 border-2 border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none bg-white text-sm"
                rows={2}
              />
            </div>
          </div>

          {/* Navigation Buttons - Fixed at Bottom */}
          <div className="flex justify-center gap-8 pt-1 pb-2 flex-shrink-0">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-8 py-2 rounded-lg font-bold text-lg transition-all duration-300 flex items-center gap-3 transform hover:scale-105 ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-800 hover:to-purple-800 shadow-[0_8px_20px_rgba(147,51,234,0.4)] hover:shadow-[0_12px_28px_rgba(147,51,234,0.5)]"
              }`}>
              ← Previous
            </button>

            {currentQuestionIndex === data.length - 1 ? (
              <button
                onClick={handleQuizSubmit}
                disabled={isQuizCompleted}
                className="px-6 py-1 rounded-lg font-bold bg-green-600 text-white text-sm hover:bg-green-700 hover:shadow-lg transition-all flex items-center gap-2">
                {isQuizCompleted ? "Submitted!" : "Submit Quiz"} ✓
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-10 py-1! rounded-lg font-bold bg-gradient-to-r from-purple-800 to-purple-600 text-white text-lg hover:from-purple-800 hover:to-purple-800 shadow-[0_8px_20px_rgba(147,51,234,0.4)] hover:shadow-[0_12px_28px_rgba(147,51,234,0.5)] transition-all duration-300 flex items-center gap-3 transform hover:scale-105">
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;
