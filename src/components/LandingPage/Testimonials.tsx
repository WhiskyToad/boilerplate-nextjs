import React, { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatarSrc?: string;
  rating?: number;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: TestimonialItem[];
  slidesToShow?: number;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  title = "What Our Customers Say",
  subtitle = "Don't just take our word for it. Here's what people who use our product think.",
  testimonials: propTestimonials,
  slidesToShow = 1,
}) => {
  const defaultTestimonials = [
    {
      quote:
        "This product has completely transformed our workflow. We're now able to accomplish in minutes what used to take us hours.",
      author: "Jane Smith",
      role: "CEO",
      company: "Tech Innovations",
      avatarSrc: "https://i.pravatar.cc/150?img=1",
      rating: 5,
    },
    {
      quote:
        "The ease of use and powerful features make this an essential tool for our team. Customer support has been exceptional as well.",
      author: "John Davis",
      role: "Product Manager",
      company: "Growth Startup",
      avatarSrc: "https://i.pravatar.cc/150?img=2",
      rating: 5,
    },
    {
      quote:
        "I've tried many similar solutions but this one stands out for its intuitive design and reliability. Highly recommend!",
      author: "Lisa Johnson",
      role: "Marketing Director",
      company: "Creative Solutions",
      avatarSrc: "https://i.pravatar.cc/150?img=3",
      rating: 4,
    },
  ];

  const testimonials = propTestimonials || defaultTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - slidesToShow ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - slidesToShow : prevIndex - 1
    );
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      ));
  };

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + slidesToShow
  );

  return (
    <section className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-lg max-w-2xl mx-auto text-base-content/70">
            {subtitle}
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <div
              className={`grid grid-cols-1 ${
                slidesToShow === 2 ? "md:grid-cols-2" : "md:grid-cols-1"
              } gap-8`}
            >
              {visibleTestimonials.map((testimonial, index) => (
                <motion.div
                  key={currentIndex + index}
                  className="bg-base-200 p-6 rounded-lg shadow-lg border border-base-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {testimonial.rating && (
                    <div className="flex mb-4">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}
                  <blockquote className="text-lg italic mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    {testimonial.avatarSrc && (
                      <div className="mr-4">
                        <div className="w-12 h-12 relative rounded-full overflow-hidden">
                          <Image
                            src={testimonial.avatarSrc}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      {(testimonial.role || testimonial.company) && (
                        <p className="text-sm text-base-content/70">
                          {testimonial.role}
                          {testimonial.role && testimonial.company && ", "}
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {testimonials.length > slidesToShow && (
            <div className="flex justify-center mt-8 gap-4">
              <button
                onClick={prevTestimonial}
                className="btn btn-circle btn-outline"
                aria-label="Previous testimonial"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextTestimonial}
                className="btn btn-circle btn-outline"
                aria-label="Next testimonial"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
