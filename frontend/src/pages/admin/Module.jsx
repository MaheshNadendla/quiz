import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { FiEye, FiEyeOff, FiPlus } from "react-icons/fi";
import { ArrowLeft, Layers, BookOpen } from "lucide-react";

const ModuleList = () => {
  const { courseName } = useParams();
  const [modules, setModules] = useState([]);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { signupData } = useSelector((state) => state.auth);
  const [subjectId, setSubjectId] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const key = searchParams.get("key");

  useEffect(() => {
    fetchModules();
  }, [courseName]);

  const fetchModules = async () => {
    try {
      const response = await apiConnector("GET", `/courses/${courseName}?includeDisabled=1`);
      setModules(response.data.modules);
      setSubjectId(response.data.subject?.id || "");
    } catch {
      toast.error("Failed to fetch modules");
    }
  };

  const toggleModule = async (moduleId, currentIsActive) => {
    const enable = !currentIsActive;
    const confirmed = window.confirm(`${enable ? 'Enable' : 'Disable'} this module?`);
    if (!confirmed) return;
    try {
      await apiConnector("PATCH", `/admin/modules/${moduleId}/toggle`, {
        isActive: enable,
        googleId: signupData?.googleId,
      });
      toast.success(`Module ${enable ? 'enabled' : 'disabled'} successfully`);
      fetchModules();
    } catch (e) {
      const msg = e?.response?.data?.details || e?.response?.data?.error || "Failed to toggle module";
      toast.error(msg);
    }
  };

  const createModule = async () => {
    if (!newModuleName.trim() || !key) {
      toast.error("Module name can't be empty or missing key");
      return;
    }

    setIsCreating(true);
    try {
      await apiConnector("POST", `/admin/modules`, {
        name: newModuleName,
        subjectId: key,
        googleId: signupData?.googleId,
      });
      toast.success("Module created successfully");
      fetchModules();
      setNewModuleName("");
      setShowCreateModule(false);
    } catch {
      toast.error("Failed to create module");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-6 mt-20">
        {/* Back Button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Subjects
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{courseName}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Manage modules and lessons
            </p>
          </div>
          <button
            onClick={() => setShowCreateModule(!showCreateModule)}
            className="group flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold"
          >
            {showCreateModule ? (
              <>
                <span className="transform group-hover:rotate-90 transition-transform">✕</span>
                Cancel
              </>
            ) : (
              <>
                <FiPlus className="text-xl group-hover:rotate-90 transition-transform" />
                Add Module
              </>
            )}
          </button>
        </div>

        {/* Create Form */}
        {showCreateModule && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-6 mb-8 transform transition-all duration-300 animate-slideDown">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Module</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Module Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Chapter 1: Introduction"
                  value={newModuleName}
                  onChange={(e) => setNewModuleName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              
              <button
                onClick={createModule}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Module"}
              </button>
            </div>
          </div>
        )}

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                <FiEye className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {modules.filter(m => m.isActive).length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                <FiEyeOff className="text-white w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Disabled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {modules.filter(m => !m.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="space-y-4">
          {modules?.map((module, index) => (
            <div
              key={module.id}
              className="group bg-white rounded-xl border border-gray-200 hover:border-purple-300 transition-all duration-300 hover:shadow-md overflow-hidden"
              style={{
                animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
              }}
            >
              <div className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    to={`/admin/courses/modules/${module.name}?key=${module.id}&subjectId=${subjectId}`}
                    className="flex items-center gap-4 flex-1 min-w-0 group/link"
                  >
                    {/* Module Number Badge */}
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg flex items-center justify-center font-bold flex-shrink-0 group-hover/link:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    
                    {/* Module Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover/link:text-purple-600 transition-colors truncate">
                        {module.name}
                      </h3>
                      {!module.isActive && (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md font-medium mt-1">
                          <FiEyeOff className="w-3 h-3" />
                          Disabled
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleModule(module.id, module.isActive)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 flex-shrink-0 ${
                      module.isActive
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-green-50 hover:bg-green-100 text-green-700'
                    }`}
                  >
                    {module.isActive ? (
                      <>
                        <FiEyeOff className="w-4 h-4" />
                        <span className="hidden sm:inline">Disable</span>
                      </>
                    ) : (
                      <>
                        <FiEye className="w-4 h-4" />
                        <span className="hidden sm:inline">Enable</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {modules.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layers className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No modules yet</h3>
            <p className="text-gray-600 mb-6">Create your first module to get started</p>
            <button
              onClick={() => setShowCreateModule(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <FiPlus className="text-xl" />
              Add Module
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
};

export default ModuleList;