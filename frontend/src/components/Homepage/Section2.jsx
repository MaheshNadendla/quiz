import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";
import { LuNotebookPen } from "react-icons/lu";
import { FaRegLightbulb } from "react-icons/fa";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { GiStopwatch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";


function Section2() {
  const navigate = useNavigate();
  return (
    <section id="about">
      <div className="bg-[#f8ebff] text-slate-600 py-20">
        <div className="container mx-auto px-4">
          {/* Top Section */}
          <div className="bg-purple-50 py-16 px-6 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-15 items-center">
              {/* Left Section */}
              <div className="space-y-6">
                <p className="uppercase text-sm font-semibold text-purple-800 tracking-wide">
                  Assessment Platform
                </p>

                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Comprehensive{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-600">
                    Quiz Topics
                  </span>
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed">
                  From basic concepts to advanced problems, our platform offers quizzes
                  that match industry standards, helping you assess and improve your
                  knowledge from beginner to expert level.
                </p>

                {/* Features */}
                <div className="space-y-4 ">
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className=" bg-purple-100 text-purple-600 p-2 rounded-full"><LuNotebookPen /></span>
                    <p>Extensive question bank across all subjects</p>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className=" bg-purple-200 text-purple-700 p-2 rounded-full"><GiProgression /></span>
                    <p>Difficulty levels from beginner to advanced</p>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className=" bg-purple-100 text-purple-600 p-2 rounded-full"><FaRegCheckCircle /></span>
                    <p>Industry-standard assessment criteria</p>
                  </div>
                </div>

                {/* Button */}
                <button onClick={() => navigate("/quizzes")} className="mt-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">
                  Browse Test →
                </button>
              </div>

              {/* Right Section (Image) */}
              <div className="flex justify-center">
                <img
                  src="../../../images/hero_second.png"
                  alt="Quiz Illustration"
                  className="w-full max-w-md drop-shadow-2xl"
                />
              </div>
            </div>
          </div>


          {/* Bottom Section */}
          <div className="bg-purple-50 py-16 px-6 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Section (Image) */}
              <div className="order-2 lg:order-1 flex justify-center">
                <img
                  src="../../../images/hero_third.jpg"
                  alt="Interactive Quiz Illustration"
                  className="w-96 max-w-md rounded-xl drop-shadow-2xl"
                />
              </div>

              {/* Right Section (Text) */}
              <div className="order-1 lg:order-2 space-y-6">
                <p className="uppercase text-sm font-semibold text-purple-800 tracking-wide">
                  In Browser Testing
                </p>

                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Interactive{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-600">
                    Testing Experience
                  </span>
                </h2>

                <p className="text-gray-600 text-lg leading-relaxed">
                  Take quizzes directly in your browser with our integrated testing
                  interface. Each quiz is crafted with instant feedback and detailed
                  explanations to help you understand your performance better.
                </p>

                {/* Features (optional for consistency) */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className=" bg-purple-100 text-purple-600 p-2 rounded-full "><AiOutlineThunderbolt /></span>
                    <p>Instant feedback for every question</p>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className=" bg-purple-100 text-purple-600 p-2 rounded-full "><FaRegLightbulb /></span>
                    <p>Detailed explanations for all answers</p>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className=" bg-purple-100 text-purple-600 p-2 rounded-full "><GiStopwatch /></span>
                    <p>Real-time score and progress tracking</p>
                  </div>
                </div>

                <button className="mt-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                onClick={() => navigate("/quizzes")}
                >
                  Try a Quiz →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Section2;