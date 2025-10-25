import React from "react";
import { CheckCircle2, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { Link } from "react-router-dom";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2563EB",
    textTransform: "uppercase",
    borderBottom: "2px solid #2563EB", // Adding a border below the header
    paddingBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    borderBottom: "1px solid #e0e0e0", // Add borders to rows
    paddingVertical: 8,
  },
  cell: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
  },
  value: {
    fontSize: 12,
    color: "#111827",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#9CA3AF",
  },
  contactInfo: {
    marginTop: 20,
    fontSize: 12,
    textAlign: "center",
    color: "#6B7280",
  },
});

// Receipt PDF Component
const ReceiptPDF = ({ transactionDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>AI Peer Academy Receipt</Text>

      {/* Address and Contact Information */}
      <Text style={styles.contactInfo}>
        AI Peer Academy, 123 Academy St., Some City, 12345
        {"\n"}Phone: (123) 456-7890 | Email: info@aipacademy.com
      </Text>

      {/* Transaction Details */}
      <View style={styles.section}>
        <View style={[styles.row, { borderTop: "1px solid #e0e0e0" }]}>
          <Text style={[styles.label, styles.cell]}>Name</Text>
          <Text style={[styles.value, styles.cell]}>
            {transactionDetails.name}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.cell]}>Transaction ID</Text>
          <Text style={[styles.value, styles.cell]}>
            {transactionDetails.transactionId}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.cell]}>Receipt Number</Text>
          <Text style={[styles.value, styles.cell]}>
            {transactionDetails.receiptNo}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.cell]}>Amount Paid</Text>
          <Text style={[styles.value, styles.cell]}>
            {transactionDetails.amount}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, styles.cell]}>Date</Text>
          <Text style={[styles.value, styles.cell]}>
            {transactionDetails.date}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        © 2024 AI Peer Academy. All Rights Reserved.
      </Text>
    </Page>
  </Document>
);

const PaymentSuccessPage = () => {
  const dispatch = useDispatch();
  const { signupData, token } = useSelector((state) => state.auth);
  // Dummy transaction data
  const transactionDetails = {
    name: "abc " || signupData.name,
    transactionId: "AIPA-2024-0532",
    receiptNo: "RCP-8765-4321",
    amount: "₹499.00",
    date: new Date().toLocaleDateString(),
  };

  // Function to generate and open the PDF in a new tab
  const handleDownload = async (transactionDetails) => {
    const pdfBlob = await pdf(
      <ReceiptPDF transactionDetails={transactionDetails} />
    ).toBlob();
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4 mt-14">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-6" />

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6">Welcome to AI Peer Academy Members</p>

        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-semibold">{transactionDetails.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-semibold">
              {transactionDetails.transactionId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Receipt Number</span>
            <span className="font-semibold">
              {transactionDetails.receiptNo}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Paid</span>
            <span className="font-semibold">{transactionDetails.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold">{transactionDetails.date}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => handleDownload(transactionDetails)}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download Receipt</span>
          </button>
          <Link to="/">
            <div className="flex-1 bg-gray-500 text-white py-3 px-2 rounded-lg hover:bg-gray-600 transition-colors">
              Continue to dashboard
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
