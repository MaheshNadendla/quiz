import { AlertCircle, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentFailurePage = () => {
  // Dummy error details
  const errorDetails = {
    reason: "Network Error",
    cardLastFour: "1234",
    timestamp: new Date().toLocaleString(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <AlertCircle className="mx-auto h-20 w-20 text-red-500 mb-6" />

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          We couldn't process your transaction
        </p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Error Reason</span>
            <span className="font-semibold text-red-600">
              {errorDetails.reason}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Card Used</span>
            <span className="font-semibold">
              **** **** **** {errorDetails.cardLastFour}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Timestamp</span>
            <span className="font-semibold">{errorDetails.timestamp}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
            <RefreshCcw className="h-5 w-5" />
            <Link to="/payment">Try Again</Link>
          </button>
          <Link to="/dashboard">
            <div className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors">
              Continue to dashboard
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
