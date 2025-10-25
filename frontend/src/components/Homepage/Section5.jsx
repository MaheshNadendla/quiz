import React from "react";
import { FaBolt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Section5() {

const navigate = useNavigate();
  return (
    <div className="py-20 bg-[#f8ebff]">
      <div className="container mx-auto px-4">

        {/* Pro Section */}
        <div className="bg-white rounded-xl p-8 md:p-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>

              <h2 className="text-4xl font-bold text-slate-700 mb-4">
                Get QuizMaster{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                  Pro
                </span>{" "}
              </h2>
              <p className="text-slate-600 mb-6">
                Launch Your QuizMaster Pro Create interactive quizzes and gain
                insights from real-world data with Pro subscription. Unlock
                exclusive features today!
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:shadow-lg hover:scale-[1.02] text-white font-semibold px-6 py-3 rounded-lg hover:bg-brown-700 transition-colors mt-6"
              onClick={() => navigate("/payment")} >
                Go Pro
                
              </button>
            </div>
            <div className="hidden md:block">
              {/* Space for your illustration */}
              <div className="  bg-orange-100 rounded-xl">
                <img src="../../../images/proPic.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section5;
