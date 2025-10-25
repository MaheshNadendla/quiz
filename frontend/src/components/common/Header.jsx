import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice.jsx";
import { TiStar } from "react-icons/ti";
import GoogleSignInButton from "../GoogleSignInButton.jsx";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOutIcon, UserCircleIcon } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { signupData } = useSelector((state) => state.auth);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Refs for click outside
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Effect to handle closing mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to handle click outside for mobile menu and user dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu if clicked outside the header
      if (isMobileMenuOpen && headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      // Close user dropdown if clicked outside the dropdown container
      if (showUserDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen, showUserDropdown]);


  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    setShowUserDropdown(false);
    navigate("/");
  };
  
  // Helper function for nav links
  const NavLink = ({ to, children, requiresAuth = false }) => {
    const isActive = location.pathname === to;
    const isProtected = requiresAuth && !signupData;

    const linkContent = (
      <>
        {children}
        <span
          className={`absolute left-0 bottom-0 h-0.5 bg-purple-950 transition-all duration-300 ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        ></span>
      </>
    );

    if (isProtected) {
      return (
        <button
          onClick={() => setShowLoginPrompt(true)}
          className="relative text-xl hover:text-purple-950 transition-colors cursor-pointer group font-medium"
          aria-label={`Access ${children}`}
        >
          {linkContent}
        </button>
      );
    }

    return (
      <Link
        to={to}
        className={`relative text-xl transition-colors group font-medium ${
          isActive ? "text-purple-950" : "hover:text-purple-950"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {linkContent}
      </Link>
    );
  };
  

  return createPortal(
    <header
      ref={headerRef}
      className="w-full bg-[#fdebff] text-purple-900 py-4 fixed top-0 z-50 shadow-lg"
    >
      <div className="flex w-full items-center justify-between px-4 md:px-10 lg:px-14">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-[#440067] rounded-full"></div>
            <div className="ml-2 flex flex-col">
              <span className="text-xl md:text-2xl text-purple-900 font-semibold leading-tight">
                Peer{" "}
                <span className="bg-gradient-to-r from-purple-900 to-purple-600 bg-clip-text text-transparent">
                  Academy
                </span>
              </span>
              <span className="text-xs font-semibold bg-gradient-to-b from-blue-950 to-purple-400 bg-clip-text text-transparent">
                CBSE Edition
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/quizzes" requiresAuth>Quizzes</NavLink>
          <NavLink to="/analytics" requiresAuth>Dashboard</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown((prev) => !prev)}
              className="flex items-center justify-center hover:text-purple-950 transition-colors rounded-full"
              aria-expanded={showUserDropdown}
              aria-label="User menu"
            >
              {signupData ? (
                <img
                  src={signupData.picture}
                  alt={signupData.name || "User profile"}
                  className="w-9 h-9 rounded-full border-2 border-purple-400 object-cover"
                />
              ) : (
                <UserCircleIcon size={30} className="text-purple-700 hover:text-purple-900" />
              )}
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-50">
                {signupData ? (
                  <>
                    {/* Subscription Status */}
                    {signupData.isSubscribed ? (
                      <div className="px-4 py-3 flex items-center gap-3 bg-orange-50 text-orange-700 border-b border-gray-100">
                        <TiStar size={20} />
                        <span className="text-sm font-semibold">Premium User</span>
                      </div>
                    ) : (
                      <Link
                        to="/payment"
                        onClick={() => setShowUserDropdown(false)}
                        className="px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors text-gray-700 border-b border-gray-100"
                      >
                        <TiStar size={20} className="text-orange-500" />
                        <span className="text-sm font-medium">Upgrade to Pro</span>
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-gray-700"
                    >
                      <LogOutIcon size={20} className="text-red-500" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="p-3">
                    <GoogleSignInButton />
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-3xl p-2 text-purple-800" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          aria-label="Toggle Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out bg-[#fdebff] border-t border-purple-200 ${
          isMobileMenuOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col items-center space-y-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/quizzes" requiresAuth>Quizzes</NavLink>
          <NavLink to="/analytics" requiresAuth>Dashboard</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          <hr className="w-1/2 border-purple-200 my-2" />

          {/* Mobile User/Auth Section */}
          {signupData ? (
            <div className="flex flex-col items-center space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <img src={signupData.picture} alt={signupData.name} className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover" />
                <span className="text-base font-semibold text-purple-900">{signupData.name}</span>
              </div>
              
              {!signupData.isSubscribed && (
                <Link
                  to="/payment"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center bg-orange-100 text-orange-700 font-semibold px-6 py-2 rounded-lg hover:bg-orange-200 transition-colors flex items-center justify-center gap-2"
                >
                  <TiStar size={20} /> Go Pro
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full text-center text-red-600 font-medium px-6 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOutIcon size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="w-1/2 px-4 pt-2">
              <GoogleSignInButton />
            </div>
          )}
        </nav>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div className="bg-white rounded-xl p-8 max-w-sm mx-4 shadow-2xl transform transition-all scale-100" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-extrabold text-purple-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600 text-base mb-6">
              Please sign in to unlock **Quizzes**, **Dashboard**, and personalized content!
            </p>
            <div className="flex flex-col gap-4">
              <GoogleSignInButton 
                buttonText="Sign in to Start Learning"
                className="w-full"
              />
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full px-4 py-2 text-sm text-gray-500 hover:text-purple-600 transition-colors font-medium"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </header>,
    document.getElementById("header")
  );
}

export default Header;