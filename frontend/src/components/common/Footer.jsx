import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

function Header() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 pt-14 pb-8 w-full border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand + Description */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-teal-500/20 border border-teal-500 rounded-xl flex items-center justify-center text-teal-400 text-lg font-bold">
              AI
            </div>
            <span className="text-2xl font-semibold text-teal-400">
              Ai Peer Master
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Empower your learning journey with AI-powered quizzes, insights, and
            personalized progress tracking. Learn smarter every day.
          </p>

          {/* Social Links */}
          <div className="flex space-x-5 mt-5">
            {[FaFacebook, FaInstagram, FaTwitter, FaGithub, FaLinkedin].map(
              (Icon, i) => (
                <Icon
                  key={i}
                  className="w-5 h-5 text-gray-400 hover:text-teal-400 hover:scale-110 transition-transform duration-300 cursor-pointer"
                />
              )
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Explore Quizzes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Leaderboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400 transition-colors">
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400 transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Stay Updated</h3>
          <p className="text-gray-400 text-sm mb-3">
            Subscribe to get the latest quiz updates, study tips, and AI tools.
          </p>
          <form className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-400 transition-colors text-sm font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto border-t border-slate-700 mt-10 pt-6 flex flex-col md:flex-row justify-around items-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Ai Peer Master. All rights reserved.</p>
        <p className="mt-2 md:mt-0">
          Built with 💡 by <span className="text-teal-400 font-medium">Team AI</span>
        </p>
      </div>
    </footer>
  );
}

export default Header;
