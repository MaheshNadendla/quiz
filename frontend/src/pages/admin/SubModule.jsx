import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiPlus, FiUpload } from "react-icons/fi";
import { ArrowLeft, Layers, FileText, Award, Zap } from "lucide-react";

function SubModuleList() {
  const { moduleName } = useParams();
  const [submodules, setSubmodules] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newSubmodule, setNewSubmodule] = useState({
    name: "",
    difficulty: "medium",
    isPro: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const { signupData } = useSelector((state) => state.auth);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const key = searchParams.get("key");
  const subjectId = searchParams.get("subjectId");

  useEffect(() => {
    fetchsubModules();
  }, [key]);

  const fetchsubModules = async () => {
    try {
      const response = await apiConnector("GET", `/modules/submodules/${key}?includeDisabled=1`);
      setSubmodules(response.data.subModules);
    } catch (e) {
      toast.error("Failed to fetch submodules");
    }
  };

  const toggleSubmodule = async (submoduleId, currentIsActive) => {
    const enable = !currentIsActive;
    const confirmed = window.confirm(`${enable ? 'Enable' : 'Disable'} this submodule?`);
    if (!confirmed) return;
    try {
      await apiConnector("PATCH", `/admin/sub-modules/${submoduleId}/toggle`, {
        isActive: enable,
        googleId: signupData?.googleId,
      });
      toast.success(`Submodule ${enable ? 'enabled' : 'disabled'} successfully`);
      fetchsubModules();
    } catch (e) {
      const msg = e?.response?.data?.details || e?.response?.data?.error || "Failed to toggle submodule";
      toast.error(msg);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/json" || file.type === "text/csv") {
        setSelectedFile(file);
      } else {
        toast.error("Please upload a valid JSON or CSV file");
        setSelectedFile(null);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSubmodule((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const createSubmodule = async (e) => {
    e.preventDefault();

    if (!newSubmodule.name.trim() || !selectedFile) {
      toast.error("Please fill all required fields and upload a questions file");
      return;
    }

    setIsCreating(true);
    const formData = new FormData();
    formData.append("name", newSubmodule.name);
    formData.append("difficulty", newSubmodule.difficulty);
    formData.append("isPro", newSubmodule.isPro.toString());
    formData.append("moduleId", key);
    if (signupData?.googleId) formData.append("googleId", signupData.googleId);
    formData.append("file", selectedFile);

    try {
      await apiConnector("POST", "/admin/submodules/upload", formData);
      toast.success("Submodule created successfully");
      fetchsubModules();
      resetForm();
    } catch (err) {
      const msg = err?.response?.data?.details || err?.response?.data?.error || "Failed to create submodule";
      toast.error(msg);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setNewSubmodule({
      name: "",
      difficulty: "medium",
      isPro: false,
    });
    setSelectedFile(null);
    setShowCreateForm(false);
  };

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      hard: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Hard" },
      easy: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Easy" },
      medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Medium" },
    };
    return configs[difficulty?.toLowerCase()] || configs.medium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-5xl mx-auto px-6 mt-20">
        {/* Back Button */}
        <Link
          to={`/admin/courses/${moduleName}?key=${key}`}
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Modules
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{moduleName}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Manage submodules and quizzes
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            {showCreateForm ? (
              <>
                <span className="transform group-hover:rotate-90 transition-transform">✕</span>
                Cancel
              </>
            ) : (
              <>
                <FiPlus className="text-xl group-hover:rotate-90 transition-transform" />
                Add Submodule
              </>
            )}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 mb-8 transform transition-all duration-300 animate-slideDown">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Submodule</h3>
            
            <form onSubmit={createSubmodule} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Submodule Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newSubmodule.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Quadratic Equations"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["easy", "medium", "hard"].map((level) => (
                    <label
                      key={level}
                      className={`relative flex items-center justify-center px-4 py-3 border-2 rounded-xl cursor-pointer transition-all ${
                        newSubmodule.difficulty === level
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={newSubmodule.difficulty === level}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className={`text-sm font-medium ${
                        newSubmodule.difficulty === level ? "text-purple-700" : "text-gray-600"
                      }`}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <input
                  type="checkbox"
                  name="isPro"
                  checked={newSubmodule.isPro}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <label className="text-sm font-semibold text-gray-700">
                    Mark as Pro Content
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Questions File (JSON/CSV) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-3 w-full px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 cursor-pointer transition-colors bg-gray-50 hover:bg-purple-50"
                  >
                    <FiUpload className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : "Click to upload file"}
                    </span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Submodule"}
              </button>
            </form>
          </div>
        )}

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <FileText className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{submodules.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                <FiEye className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submodules.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-xl flex items-center justify-center">
                <Award className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pro</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submodules.filter(s => s.isPro).length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Zap className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {submodules.reduce((sum, s) => sum + (s.questions?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submodules List */}
        <div className="space-y-4">
          {submodules.map((submodule, index) => {
            const diffConfig = getDifficultyConfig(submodule.difficulty);
            return (
              <div
                key={submodule._id}
                className="group bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md overflow-hidden"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Number Badge */}
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2 flex-wrap">
                          <span className="truncate">{submodule.name}</span>
                          {!submodule.isActive && (
                            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium">
                              <FiEyeOff className="w-3 h-3" />
                              Disabled
                            </span>
                          )}
                        </h3>
                        
                        {/* Meta Info */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-lg border ${diffConfig.bg} ${diffConfig.text} ${diffConfig.border}`}>
                            {diffConfig.label}
                          </span>
                          {submodule.isPro && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1 rounded-lg border border-amber-200">
                              <Award className="w-3 h-3" />
                              Pro
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {submodule.questions?.length || 0} questions
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {subjectId && (
                        <Link
                          to={`/course/${subjectId}/${submodule._id}`}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                        >
                          Attempt
                        </Link>
                      )}
                      <button
                        onClick={() => toggleSubmodule(submodule._id, submodule.isActive)}
                        className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                          submodule.isActive
                            ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            : 'bg-green-50 hover:bg-green-100 text-green-700'
                        }`}
                      >
                        {submodule.isActive ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {submodules.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No submodules yet</h3>
            <p className="text-gray-600 mb-6">Create your first submodule to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <FiPlus className="text-xl" />
              Add Submodule
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default SubModuleList;