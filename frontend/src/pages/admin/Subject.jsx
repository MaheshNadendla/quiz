// SubjectList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiConnector } from "../../services/apiConnectors";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FiEdit3, FiEye, FiEyeOff } from "react-icons/fi";
import { BookOpen, Layers } from "lucide-react";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { signupData } = useSelector((state) => state.auth);

  const gradients = [
    "from-pink-400 to-rose-400",
    "from-emerald-400 to-teal-400",
    "from-purple-400 to-indigo-400",
    "from-blue-400 to-cyan-400",
    "from-green-400 to-emerald-400",
    "from-red-400 to-pink-400",
    "from-amber-400 to-orange-400",
    "from-violet-400 to-purple-400",
    "from-cyan-400 to-blue-400",
    "from-fuchsia-400 to-pink-400",
  ];

  const getRandomGradient = () => {
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await apiConnector("GET", "/dashboard?includeDisabled=1");
      setSubjects(response.data.subjects);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    }
  };

  const createSubject = async () => {
    if (!newSubjectName.trim()) {
      toast.error("Subject name can't be empty");
      return;
    }

    setIsCreating(true);
    try {
      const response = await apiConnector("POST", "/admin/subjects", {
        name: newSubjectName,
        description: newSubjectDescription,
        googleId: signupData?.googleId,
      });

      if (response) {
        toast.success("Subject created successfully");
        fetchSubjects();
        setNewSubjectName("");
        setNewSubjectDescription("");
        setShowCreateForm(false);
      }
    } catch (error) {
      toast.error("Failed to create subject");
    } finally {
      setIsCreating(false);
    }
  };

  const toggleSubject = async (subjectId, currentIsActive) => {
    const enable = !currentIsActive;
    const confirmed = window.confirm(`${enable ? 'Enable' : 'Disable'} this subject?`);
    if (!confirmed) return;
    try {
      await apiConnector("PATCH", `/admin/subjects/${subjectId}/toggle`, {
        isActive: enable,
        googleId: signupData?.googleId,
      });
      toast.success(`Subject ${enable ? 'enabled' : 'disabled'} successfully`);
      fetchSubjects();
    } catch (e) {
      const msg = e?.response?.data?.details || e?.response?.data?.error || "Failed to toggle subject";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-6 mt-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Subject Management</h2>
            <p className="text-gray-600 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Manage all course subjects and modules
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
                <IoMdAddCircleOutline className="text-xl group-hover:rotate-90 transition-transform" />
                Create New Subject
              </>
            )}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 mb-8 transform transition-all duration-300 animate-slideDown">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <FiEdit3 className="text-white" />
              </div>
              Create New Subject
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics, Science, English"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Provide a brief description of the subject..."
                  value={newSubjectDescription}
                  onChange={(e) => setNewSubjectDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  rows="4"
                />
              </div>
              
              <button
                onClick={createSubject}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Subject"}
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-purple-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Subjects</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{subjects.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-green-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {subjects.filter(s => s.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center">
                <FiEye className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Disabled</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {subjects.filter(s => !s.isActive).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
                <FiEyeOff className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {subjects.map((subject, index) => {
            const gradient = getRandomGradient();
            return (
              <div
                key={subject._id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                {/* Gradient Header */}
                <div className={`h-14 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    {!subject.isActive && (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-900/80 text-white px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                        <FiEyeOff className="w-3 h-3" />
                        Disabled
                      </span>
                    )}
                    {subject.isActive && (
                      <span className="inline-flex items-center gap-1 text-xs bg-white/80 text-gray-900 px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                        <FiEye className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {subject.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <Layers className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">
                      {subject.modules?.length || 0} modules
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/courses/${subject.name}?key=${subject._id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 text-center font-medium text-sm"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => toggleSubject(subject._id, subject.isActive)}
                      className={`flex-1 ${
                        subject.isActive
                          ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-red-200'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-green-200'
                      } text-white px-4 py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 font-medium text-sm`}
                    >
                      {subject.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>

                {/* Hover Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {subjects.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-purple-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No subjects yet</h3>
            <p className="text-gray-600 mb-6">Create your first subject to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold"
            >
              <IoMdAddCircleOutline className="text-xl" />
              Create Subject
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

export default SubjectList;