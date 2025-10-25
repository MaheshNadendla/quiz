import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { authenticateWithGoogle } from "../../services/authService.jsx";
import { setSignupData, setToken } from "../../slices/authSlice.jsx";
import Header from "../common/Header.jsx";

function Section1() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signupData } = useSelector((state) => state.auth);
  const googleButtonRef = useRef(null);

  const handleLoginSuccess = async (response) => {
    const token = response.credential;
    try {
      const res = await authenticateWithGoogle(token);
      localStorage.setItem("token", JSON.stringify(res.data.token));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch(setToken(res.data.token));
      dispatch(setSignupData(res.data.user));
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const triggerGoogleLogin = () => {
    const googleBtn = googleButtonRef.current?.querySelector('div[role="button"]');
    if (googleBtn) googleBtn.click();
  };

  return (
    <section id="home">
      <Header />
      <div className="mt-8 relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-50 via-purple-100 to-purple-200">
        {/* Subtle floating glow circles */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-purple-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>

        <div className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 pt-20 relative z-10">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[3.8rem] md:leading-[4.5rem] tracking-tight text-gray-900">
  <span className=" animate-fadeIn text-slate-900">
    Challenge your mind with
  </span>
  <span className="block bg-gradient-to-r from-purple-700 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
    interactive quizzes.
  </span>
</h1>

            <p className="text-lg md:text-xl text-gray-700 max-w-lg mx-auto lg:mx-0 mt-4 animate-fadeIn leading-relaxed">
  Crush your CBSE goals with AI-driven quizzes, real-time leaderboards, and insights that make learning feel like a game — not a grind. 🎮📘
</p>


            {/* Buttons */}
<div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-5">
  <button
    onClick={() => navigate("/quizzes")}
    className="relative inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-white rounded-xl 
               bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 
               hover:from-purple-700 hover:via-fuchsia-600 hover:to-pink-600 
               shadow-lg hover:shadow-fuchsia-300/50 transition-all duration-300 
               transform hover:-translate-y-1 hover:scale-105"
  >
    {signupData ? "Start Learning Now →" : "Explore Quizzes →"}
    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-10 transition-all"></span>
  </button>

  {!signupData && (
    <>
      <button
        onClick={triggerGoogleLogin}
        className="flex items-center justify-center gap-3 px-8 py-3 text-lg font-semibold 
                   text-gray-800 bg-white border border-gray-300 rounded-xl 
                   hover:bg-gray-50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="w-6 h-6"
        />
        Sign in with Google
      </button>

      <div ref={googleButtonRef} className="hidden">
        <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("Login Failed")} />
      </div>
    </>
  )}
</div>

            {/* Student Count */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mt-8">
              <div className="flex -space-x-3">
                {[
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9",
                  "https://plus.unsplash.com/premium_photo-1682089877310-b2308b0dc719",
                  "https://plus.unsplash.com/premium_photo-1683141506839-c8a751f227b2",
                ].map((url, i) => (
                  <div key={i} className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white">
                    <img src={`${url}?w=600&q=60`} alt="Student" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-700 font-medium">Join 5,000+ learners mastering their subjects</p>
            </div>
          </div>

          {/* Right Image */}
<div className="flex-1 mt-10 lg:mt-0 flex justify-center lg:justify-end relative">
  <img
    src="../../../images/hero_Img.png"
    alt="Learning Illustration"
    className="w-[95%] md:w-[90%] lg:w-[85%] max-w-2xl drop-shadow-2xl animate-fadeIn scale-105 md:scale-110 transition-transform duration-500"
  />
</div>

        </div>
      </div>
    </section>
  );
}

export default Section1;
