import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaLinkedin,
  FaInstagram,
} from 'react-icons/fa';
import { FaSquareXTwitter } from 'react-icons/fa6';
import toast from "react-hot-toast";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // post request here
    // alert("Message sent successfully!");
    toast.error("Failed to send mail due to server error");
  };

  return (
    // <div className="min-h-screen bg-gray-50 p-4 ">
    //   {/* Main container */}
    //   <div className="max-w-7xl mx-auto mt-20">
    //     {/* Contact info and form container */}
    //     <div className="flex flex-col lg:flex-row gap-8">
          

    //       {/* Right side - Contact Form */}
    //       <div className="w-full lg:w-1/2">
    //         <div className="bg-white shadow-md rounded-lg p-6">
    //           <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
    //             Contact Us
    //           </h2>
    //           <form onSubmit={handleSubmit}>
    //             <div className="mb-4">
    //               <label
    //                 htmlFor="name"
    //                 className="block text-sm font-medium text-gray-600"
    //               >
    //                 Name
    //               </label>
    //               <input
    //                 type="text"
    //                 id="name"
    //                 name="name"
    //                 value={formData.name}
    //                 onChange={handleChange}
    //                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
    //                 required
    //               />
    //             </div>
    //             <div className="mb-4">
    //               <label
    //                 htmlFor="email"
    //                 className="block text-sm font-medium text-gray-600"
    //               >
    //                 Email
    //               </label>
    //               <input
    //                 type="email"
    //                 id="email"
    //                 name="email"
    //                 value={formData.email}
    //                 onChange={handleChange}
    //                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
    //                 required
    //               />
    //             </div>
    //             <div className="mb-4">
    //               <label
    //                 htmlFor="message"
    //                 className="block text-sm font-medium text-gray-600"
    //               >
    //                 Message
    //               </label>
    //               <textarea
    //                 id="message"
    //                 name="message"
    //                 value={formData.message}
    //                 onChange={handleChange}
    //                 className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
    //                 rows="4"
    //                 required
    //               ></textarea>
    //             </div>
    //             <button
    //               type="submit"
    //               className="w-full bg-[#0077B6] text-white py-3 rounded-md hover:bg-[#015786] transition duration-300"
    //             >
    //               Send Message
    //             </button>
    //           </form>
    //         </div>
    //       </div>
    //     </div>

       
    //   </div>
    // </div>
    <div className="min-h-screen max-w-full overflow-hidden relative">
      {/* Glow Background Circles */}
      <div className="absolute -top-25 -left-25 size-90 bg-black/25 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-25 -right-25 size-90 bg-black/28 rounded-full blur-3xl"></div>

      {/* Page Heading */}
      <h1 className="text-4xl md:text-7xl font-bold text-center">
        <span className="text-black">Contact</span>{' '}
        <span className="text-gray-500">Us</span>
      </h1>

      

      {/* Contact Section */}
      <div className="w-[80%] mx-auto my-[5%] flex flex-col md:flex-row gap-10 p-10 border-2">
        {/* Left Panel - Contact Info */}
        <div className="w-full md:w-1/2 text-left">
          <h1 className="text-xl pb-4 border-b border-black/20">
            Have a Question? We’re Just a Message Away.
          </h1>

          <div className="space-y-6 mt-6">
            {/* Email */}
            <div className="flex items-center space-x-4">
              <div className="bg-purple-700 text-white p-3 rounded-full">
                <FaEnvelope size={20} />
              </div>
              <div>
                <p className="text-md font-semibold text-black">Email</p>
                <p className="text-gray-800">contactemail@gmail.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center space-x-4">
              <div className="bg-purple-700 text-white p-3 rounded-full">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <p className="text-md font-semibold text-black">Phone</p>
                <p className="text-gray-800">12323-4568-8564-8595</p>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-center space-x-4">
              <div className="bg-purple-700 text-white p-3 rounded-full">
                <FaWhatsapp size={20} />
              </div>
              <div>
                <p className="text-md font-semibold text-black">WhatsApp</p>
                <p className="text-gray-800">+91 98765 43210</p>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-12 pt-8 border-t border-black/20">
              <Link
                to="/linkedin"
                className="bg-black p-3 rounded-lg text-white hover:text-blue-400 transition"
              >
                <FaLinkedin size={28} />
              </Link>
              <Link
                to="/twitter"
                className="bg-black p-3 rounded-lg text-white hover:text-blue-300 transition"
              >
                <FaSquareXTwitter size={28} />
              </Link>
              <Link
                to="/instagram"
                className="bg-black p-3 rounded-lg text-white hover:text-pink-400 transition"
              >
                <FaInstagram size={28} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Image */}
        <div className="flex justify-center items-center w-full md:w-1/2 h-90">
          {/* <img src="/ContactUs.png" alt="Contact" className="w-full h-auto" /> */}
          <DotLottieReact
      src="https://lottie.host/2853e298-7165-4f67-acce-81b788dfe3bd/DuJiYnyXdR.lottie"
      loop
      autoplay
      className="w-full h-auto"
    />
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
