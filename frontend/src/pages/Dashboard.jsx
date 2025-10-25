import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { apiConnector } from "../services/apiConnectors.jsx";
import {
  setCourseData,
  setTotalNoOfSubjects,
} from "../slices/subjectsSlice.jsx";

import {
  FaFlask,
  FaCalculator,
  FaBookOpen,
  FaGlobeAsia,
  FaBrain,
  FaCode,
  FaPalette,
  FaLanguage,
  FaFeatherAlt,
  FaLaptopCode,
  FaAtom,
  FaLeaf,
  FaHistory,
  FaLightbulb,
} from "react-icons/fa";

import { BarChart3, TrendingUp, Sparkles, Zap, Trophy } from "lucide-react";

const iconMap = {
  science: <FaFlask />,
  physics: <FaAtom />,
  chemistry: <FaFlask />,
  biology: <FaLeaf />,
  mathematics: <FaCalculator />,
  math: <FaCalculator />,
  english: <FaBookOpen />,
  hindi: <FaLanguage />,
  sanskrit: <FaFeatherAlt />,
  socialscience: <FaGlobeAsia />,
  geography: <FaGlobeAsia />,
  history: <FaHistory />,
  civics: <FaLightbulb />,
  economics: <FaBrain />,
  computer: <FaLaptopCode />,
  "information technology": <FaCode />,
  art: <FaPalette />,
  drawing: <FaPalette />,
  gk: <FaBrain />,
  general: <FaBrain />,
  moral: <FaLightbulb />,
};

const gradientMap = {
  science: "from-blue-400 to-cyan-500",
  physics: "from-indigo-400 to-purple-500",
  chemistry: "from-green-400 to-emerald-500",
  biology: "from-emerald-400 to-green-600",
  mathematics: "from-orange-400 to-red-500",
  math: "from-orange-400 to-red-500",
  english: "from-pink-400 to-rose-500",
  hindi: "from-amber-400 to-orange-500",
  sanskrit: "from-yellow-400 to-amber-500",
  socialscience: "from-teal-400 to-cyan-500",
  geography: "from-sky-400 to-blue-500",
  history: "from-violet-400 to-purple-500",
  civics: "from-fuchsia-400 to-pink-500",
  economics: "from-purple-400 to-indigo-500",
  computer: "from-cyan-400 to-blue-500",
  "information technology": "from-blue-500 to-indigo-600",
  art: "from-rose-400 to-pink-500",
  drawing: "from-pink-400 to-purple-500",
  gk: "from-indigo-400 to-blue-500",
  general: "from-slate-400 to-gray-500",
  moral: "from-lime-400 to-green-500",
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.viewSubject);
  const { signupData } = useSelector((state) => state.auth);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiConnector("GET", "/dashboard");
        dispatch(setCourseData(response.data.subjects));
        dispatch(setTotalNoOfSubjects(response.data.totalSubjects));
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  const getIconForCourse = (name) => {
    const key = name.toLowerCase();
    const foundKey = Object.keys(iconMap).find((subject) =>
      key.includes(subject)
    );
    const Icon = foundKey && iconMap[foundKey] ? iconMap[foundKey] : <FaBookOpen />;
    
    const gradientKey = Object.keys(gradientMap).find((subject) =>
      key.includes(subject)
    );
    const gradient = gradientKey ? gradientMap[gradientKey] : "from-purple-400 to-indigo-500";

    return { Icon, gradient };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 py-16">
        {/* Header Section with Floating Animation */}
        {/* Header Section */}
      <div className="max-w-5xl mx-auto px-6 text-center mb-10 mt-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-2 mt-2">
          Explore <span className="text-purple-600">CBSE Quizzes</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-5">
          Strengthen your Class 9 & 10 subjects with interactive quizzes powered
          by AI — track progress, master topics, and boost your learning path.
        </p>



          {/* Action Buttons */}
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Link
              to="/analytics"
              className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold"
            >
              <BarChart3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              View Analytics
            </Link>
            {signupData?.isAdmin && (
              <Link
                to="/admin/dashboard"
                className="group flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold border-2 border-purple-200"
              >
                <TrendingUp className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Cards Section with Staggered Animation */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courseData?.map((course, index) => {
            const path = `/courses/${course.name
              .toLowerCase()
              .replace(/\s+/g, "-")}/${course._id}`;
            
            const { Icon, gradient } = getIconForCourse(course.name);
            const isHovered = hoveredCard === course._id;

            return (
              <Link
                key={course._id}
                to={path}
                onMouseEnter={() => setHoveredCard(course._id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Animated Corner Accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500`}></div>

                {/* Icon with Gradient */}
                <div className="relative">
                  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl w-20 h-20 flex items-center justify-center text-white text-4xl mx-auto shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {Icon}
                  </div>
                  
                  {/* Pulse Ring Effect */}
                  {isHovered && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl w-20 h-20 mx-auto animate-ping opacity-20`}></div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center mt-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  {course.name}
                </h3>
                
                <p className="text-gray-500 text-sm mb-6 leading-relaxed text-center min-h-[60px]">
                  {course.description ||
                    "Engaging chapter-wise quiz sets designed for conceptual clarity and exam readiness."}
                </p>

                {/* Call to Action */}
                <div className="text-center">
                  <span className={`inline-flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r ${gradient} font-semibold text-sm group-hover:gap-3 transition-all duration-300`}>
                    Start Learning
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </div>

                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"></div>
              </Link>
            );
          })}
        </div>

        
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;