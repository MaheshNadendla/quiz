import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../../services/apiConnectors.jsx";
import {
  setCourseData,
  setTotalNoOfSubjects,
} from "../../slices/subjectsSlice.jsx";
import {
  FaFlask,
  FaCalculator,
  FaBook,
  FaGlobeAsia,
  FaLanguage,
} from "react-icons/fa";

// Define the colors and descriptions explicitly for fallbacks and styling
const subjectMeta = [
  {
    name: "Science",
    icon: <FaFlask className="text-purple-600 text-5xl" />,
    color: "#9333ea", // purple-600
    description: "Explore the wonders of biology, chemistry, and physics.",
    buttonClass: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-600/50",
  },
  {
    name: "Math",
    icon: <FaCalculator className="text-indigo-600 text-5xl" />,
    color: "#4f46e5", // indigo-600
    description: "Sharpen your problem-solving skills with algebra and geometry.",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-600/50",
  },
  {
    name: "English",
    icon: <FaBook className="text-pink-600 text-5xl" />,
    color: "#ec4899", // pink-600
    description: "Improve your grammar, vocabulary, and literary knowledge.",
    buttonClass: "bg-pink-600 hover:bg-pink-700 focus:ring-pink-600/50",
  },
  {
    name: "Hindi",
    icon: <FaLanguage className="text-red-600 text-5xl" />,
    color: "#dc2626", // red-600
    description: "Test your Hindi language comprehension and script knowledge.",
    buttonClass: "bg-red-600 hover:bg-red-700 focus:ring-red-600/50",
  },
  {
    name: "Geography",
    icon: <FaGlobeAsia className="text-teal-600 text-5xl" />,
    color: "#0d9488", // teal-600
    description: "Learn about our planet, its landscapes, and diverse cultures.",
    buttonClass: "bg-teal-600 hover:bg-teal-700 focus:ring-teal-600/50",
  },
];

const Section4 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { courseData } = useSelector((state) => state.viewSubject);

  // Fetch courses dynamically
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiConnector("GET", "/dashboard");
        if (response.data.subjects) {
          dispatch(setCourseData(response.data.subjects));
        }
        if (response.data.totalSubjects !== undefined) {
          dispatch(setTotalNoOfSubjects(response.data.totalSubjects));
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    fetchData();
  }, [dispatch]);

  // Map API data (courseData) to renderable subject objects
  const subjects = courseData?.length
    ? courseData.map((course) => {
        const meta = subjectMeta.find(
          (s) => s.name.toLowerCase() === course.name.toLowerCase()
        ) || {
          name: course.name,
          icon: <FaBook className="text-gray-600 text-5xl" />,
          color: "#6b7280", // gray-500 fallback
          description: "Explore the topics in this subject.",
          buttonClass: "bg-gray-600 hover:bg-gray-700 focus:ring-gray-600/50",
        };

        return {
          name: course.name,
          icon: meta.icon,
          color: meta.color,
          description: meta.description,
          buttonClass: meta.buttonClass,
          path: `/courses/${course.name.toLowerCase().replace(/\s+/g, "-")}/${
            course._id
          }`,
        };
      })
    : // Fallback using the rich metadata
      subjectMeta.map((meta) => ({
        ...meta,
        path: `/quiz/${meta.name.toLowerCase()}`,
      }));

  // Duplicate for infinite scroll
  const infiniteSubjects = [...subjects, ...subjects];

  return (
    <section className="min-h-screen bg-[#f7f0ff] flex flex-col items-center py-24 px-4 sm:px-6 overflow-hidden relative font-sans">
      {/* Title Section */}
      <h1 className="text-4xl sm:text-6xl font-extrabold text-center mb-16 leading-tight text-gray-900">
        Choose Your <span className="text-purple-700">Learning Path</span> 🚀
      </h1>

      {/* Masked Scrolling Container */}
      <div className="relative w-full max-w-7xl overflow-hidden group">
        {/* Left & Right Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#f7f0ff] via-[#f7f0ff]/90 to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#f7f0ff] via-[#f7f0ff]/90 to-transparent z-10"></div>

        {/* Scrollable Cards */}
        <div className="flex w-max animate-scroll hover:[animation-play-state:paused] py-4">
          {infiniteSubjects.map((subject, index) => (
            <div
              key={index}
              className={`relative w-64 h-64 mx-8 flex-shrink-0 bg-white rounded-full 
                          border-4 border-transparent shadow-xl hover:shadow-2xl 
                          hover:scale-[1.03] transition-all duration-300 ease-in-out 
                          flex flex-col justify-center items-center text-center p-6 cursor-pointer group/card`}
              onClick={() => navigate(subject.path)}
              // Dynamic Border Effect using inline style and event handlers
              style={{
                transition: "border-color 0.3s ease-in-out",
                borderColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = subject.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {/* Icon */}
              <div className="mb-2 transition-transform duration-300 group-hover/card:scale-110">
                {subject.icon}
              </div>

              {/* Name */}
              <h2 className="text-xl font-bold text-gray-900 tracking-wide mt-2">
                {subject.name}
              </h2>

              {/* Description (Adjusted vertical space) */}
              <p className="text-gray-500 text-xs mt-1 mb-6 px-4 leading-snug line-clamp-2">
                {subject.description}
              </p>

              {/* Start Quiz Button (Improved) */}
              <div className="absolute bottom-6 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <button
                  className={`px-5 py-2 text-sm rounded-full ${subject.buttonClass} 
                             text-white font-medium shadow-lg transition-all 
                             transform hover:scale-[1.1] hover:shadow-xl focus:outline-none focus:ring-4`}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(subject.path);
                  }}
                >
                  Start Quiz →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-600 text-base mt-16 font-medium italic text-center">
        Hover over a subject to pause the scroll and start the quiz.
      </p>

      {/* Scroll Animation */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Section4;