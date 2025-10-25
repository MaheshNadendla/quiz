import { useState } from "react";
import { CreditCard, Lock, X, ShieldCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiConnector } from "../../services/apiConnectors";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const PaymentForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const { signupData, token } = useSelector((state) => state.auth);

  const [errors, setErrors] = useState({});
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Name on card is required";
    }

    if (
      !formData.expiryMonth ||
      parseInt(formData.expiryMonth) < 1 ||
      parseInt(formData.expiryMonth) > 12
    ) {
      newErrors.expiryMonth = "Invalid month";
    }

    const currentYear = new Date().getFullYear() % 100;
    if (!formData.expiryYear || parseInt(formData.expiryYear) < currentYear) {
      newErrors.expiryYear = "Invalid year";
    }

    if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Invalid CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     if (validateForm()) {
  //       setPaymentLoader(true); // Start loader when payment processing starts
  //       toast.loading("Processing your payment...", {
  //         duration: 3000, // This will automatically hide the toast after 3 seconds
  //       });

  //       setTimeout(() => {
  //         setPaymentLoader(false); // Stop loader after 3 seconds (simulating payment processing)
  //         console.log("Payment processing...", formData);
  //         navigate("/payment-success");
  //       }, 3000);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setPaymentLoader(true);
        // toast.loading("Processing your payment...", { duration: 3000 });

        const paymentPayload = {
          email: signupData.email, // You'll need to pass the user's email
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cvv: formData.cvv,
          amount: "₹499.00", // The price of the course/subscription
        };

        const response = await apiConnector(
          "POST",
          "/payment/process-payment",
          paymentPayload
        );

        if (response.data?.failed) {
          toast.error("Already subscribed");
          setPaymentLoader(false);
          navigate("/dashboard");
        } else if (response.data.subscriptionStatus) {
          toast.success("Payment successful! You are now subscribed.");
          setPaymentLoader(false);
          navigate("/payment-success");
        } else {
          toast.error("Payment failed. Please try again.");
          navigate("/payment-failure");
        }
      } catch (error) {
        console.error("Payment error:", error);
        toast.error(
          error.response?.data?.message || "Payment processing failed"
        );
        navigate("/payment-failure");
      } finally {
        setPaymentLoader(false);
      }
    }
  };

  const Modal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="h-screen inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 mt-8">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl m">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Cancel Transaction
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mb-6">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-center text-gray-600">
              Are you sure you want to cancel this transaction? This action
              cannot be undone.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Keep Payment
            </button>
            <Link
              to="/payment-failure"
              onClick={() => {
                setShowCancelModal(false);
                // navigate("/paymet-failure");
              }}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Cancel Payment
            </Link>
          </div>
        </div>
      </div>
    );
  };
  //  if(paymentLoader){
  //     return (
  //         <div>
  //              const toastId = toast.loading('Processing your request...', {
  //       duration: Infinity, // This makes the toast stay visible until explicitly dismissed
  //     });
  //         </div>
  //     )
  //  }
  return (
    <div
      className={`min-h-screen mt-20 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 ${
        paymentLoader ? "bg-opacity-50" : ""
      }`} // Apply opacity when paymentLoader is true
    >
      <div
        className={`w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden ${
          paymentLoader ? "bg-opacity-50" : ""
        }`} // Apply opacity when paymentLoader is true
      >
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Payment Details</h2>
            {/* <img
              src="/api/placeholder/120/40"
              alt="AI Peer Academy"
              className="h-8"
            /> */}
            <p className="text-white font-bold">AI Peer Academy</p>
          </div>
          <p className="text-blue-100 mt-2">Complete your payment securely</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="cardNumber"
              >
                Card Number
              </label>
              <div className="relative group">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors h-5 w-5" />
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.cardNumber
                      ? "border-red-300"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.cardNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-gray-700"
                htmlFor="cardName"
              >
                Name on Card
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.cardName
                    ? "border-red-300"
                    : "border-gray-200 hover:border-blue-400"
                }`}
                placeholder="John Doe"
              />
              {errors.cardName && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.cardName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="expiryMonth"
                >
                  Month
                </label>
                <input
                  type="text"
                  id="expiryMonth"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.expiryMonth
                      ? "border-red-300"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  placeholder="MM"
                  maxLength="2"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="expiryYear"
                >
                  Year
                </label>
                <input
                  type="text"
                  id="expiryYear"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.expiryYear
                      ? "border-red-300"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  placeholder="YY"
                  maxLength="2"
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-sm font-medium text-gray-700"
                  htmlFor="cvv"
                >
                  CVV
                </label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.cvv
                      ? "border-red-300"
                      : "border-gray-200 hover:border-blue-400"
                  }`}
                  placeholder="123"
                  maxLength="4"
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors flex-1 flex items-center justify-center space-x-2"
                >
                  <Lock className="h-4 w-4" />
                  <span>Pay Securely</span>
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => {
          console.log("Transaction cancelled");
          setShowCancelModal(false);
        }}
      />
    </div>
  );
};

export default PaymentForm;
