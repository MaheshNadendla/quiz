import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

function Section3() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      text: "The online quiz module is excellent for both learning and practicing, providing clear and in-depth understanding of quiz concepts. It surpasses traditional learning methods.",
      name: "Mohammad Abdul Hamid Khan",
      username: "hamidkhan18",
      location: "India",
      rating: 4,
      image:
        "https://images.unsplash.com/photo-1708531372589-672704f301a3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=600",
    },
    {
      text: "QuizMaster Pro offers a wide range of practice questions and conducts exceptional quizzes. I am grateful to the entire team for their efforts and contributions.",
      name: "Anmol Vishwakarma",
      username: "anmol_6265",
      location: "India",
      rating: 5,
      image: "https://images.unsplash.com/photo-1637942766335-796fd25b00d8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE0fHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=600",
    },
    {
      text: "I love quizzing, and I'm always searching for the best way to learn. QuizMaster Pro is absolutely amazing and I really enjoyed using it.",
      name: "Dhanushree",
      username: "dhanushree",
      location: "India",
      rating: 5,
      image: "https://plus.unsplash.com/premium_photo-1682096200654-2f3297b0e9bd?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=600",
    },
    {
      text: "The practice quizzes are well-designed and help in understanding core concepts thoroughly.",
      name: "Rahul Sharma",
      username: "rahul_dev",
      location: "India",
      rating: 5,
      image: "https://images.unsplash.com/photo-1545696968-1a5245650b36?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1132",
    },
    {
      text: "Great platform for improving problem-solving skills. The community is very supportive.",
      name: "Priya Patel",
      username: "priya_codes",
      location: "India",
      rating: 4,
      image: "https://plus.unsplash.com/premium_photo-1661963936485-aa1830b655a5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fHN0dWRlbnR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
    },
    {
      text: "The interactive interface makes learning enjoyable. Highly recommended for beginners.",
      name: "Arjun Kumar",
      username: "arjun_k",
      location: "India",
      rating: 5,
      image: "https://plus.unsplash.com/premium_photo-1682089869602-2ec199cc501a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDh8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&q=60&w=600",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br bg-[#f8ebff]">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-6xl font-extrabold text-center mb-16 leading-tight text-gray-900">
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
              1 Lakh+
            </span>{" "}
            Learners
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our learners benefit from our rich repository of quizzes,
            interactive tests, and detailed explanations every single day.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Left Button */}
          <button
            onClick={prevSlide}
            className="absolute left-[-3rem] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-purple-100 transition"
          >
            <FaChevronLeft className="text-purple-600" />
          </button>

          {/* Slides */}
          <div className="overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}
            >
              {testimonials.map((item, index) => (
                <div
                  key={index}
                  className="min-w-[calc(33.33%-1rem)] bg-white rounded-2xl p-7 flex flex-col border border-purple-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Stars */}
                  <div className="mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${i < item.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Review */}
                  <p className="text-gray-700 mb-6 flex-grow italic leading-relaxed text-sm">
                    “{item.text}”
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {item.username}
                      </p>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={nextSlide}
            className="absolute right-[-3rem] top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-purple-100 transition"
          >
            <FaChevronRight className="text-purple-600" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Section3;
