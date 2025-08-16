import { motion } from "framer-motion";
import { Accordion, AccordionHeader, AccordionBody, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from "react-icons/fa";

const faqData = [
  {
    question: "How can I register for a medical camp?",
    answer: "You can register online through our 'Available Camps' page. Select a camp, fill in your details, and confirm your registration.",
  },
  {
    question: "Are the medical camps free?",
    answer: "Some camps are free, while others may have a nominal fee depending on the services provided. Fee details are listed in each camp’s description.",
  },
  {
    question: "Can I attend multiple camps?",
    answer: "Yes! You can register for multiple camps as long as they do not overlap in timing. Each camp registration is independent.",
  },
  {
    question: "Who will conduct the health checkups?",
    answer: "All medical camps are conducted by certified healthcare professionals including doctors, nurses, and specialists in their respective fields.",
  },
  {
    question: "Do I need to bring any documents?",
    answer: "It is recommended to bring a photo ID and any previous medical records relevant to your health for better consultation.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);

  const handleOpen = (index) => setOpen(open === index ? 0 : index);

  return (
    <div className="container mx-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen py-20 px-6">
        {/* Centered Title */}
          <Typography
            variant="h3"
            className="font-bold text-gray-800 mb-10 text-center text-3xl lg:text-4xl"
          >
            Frequently Asked Questions
          </Typography>
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full"
        >
          <img
            src="https://i.ibb.co.com/ZpbKRj3L/pexels-pixabay-221164-1.jpg"
            alt="FAQ Illustration"
            className="w-full h-full object-cover object-center rounded-3xl shadow-2xl"
          />
        </motion.div>

        {/* Right Accordion */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Accordion
                key={index}
                open={open === index}
                className="bg-white border border-blue-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <AccordionHeader
                  onClick={() => handleOpen(index)}
                  className="text-gray-700 font-semibold text-lg flex justify-between items-center px-6 py-4 rounded-3xl cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FaQuestionCircle className="text-blue-700 h-5 w-5" />
                    {faq.question}
                  </div>
                  {open === index ? (
                    <FaChevronUp className="text-blue-700" />
                  ) : (
                    <FaChevronDown className="text-blue-700" />
                  )}
                </AccordionHeader>
                <AccordionBody className="text-gray-600 px-6 py-4 rounded-b-3xl leading-relaxed">
                  {faq.answer}
                </AccordionBody>
              </Accordion>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
