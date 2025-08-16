import { motion } from "framer-motion";
import { Typography } from "@material-tailwind/react";

const About = () => {
    return (
        <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 px-6">
      
      {/* Top Section: Image Left, Text Right */}
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center mb-20">
        {/* Left Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full h-full"
        >
          <img
            src="https://i.ibb.co.com/5WC06BXq/christian-mack-QQn-ZKpctc-Gs-unsplash-1.jpg" 
            alt="About Us"
            className="w-full h-full object-cover object-center rounded-3xl shadow-2xl"
          />
        </motion.div>

        {/* Right Text */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Typography variant="h3" className="text-gray-800 font-bold mb-6 text-3xl lg:text-4xl">
            About Medix Camp
          </Typography>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            Medix Camp is dedicated to bringing accessible and high-quality healthcare to underserved communities. Our mission is to heal, educate, and empower individuals through compassionate medical services. By organizing regular medical camps, we ensure that certified healthcare professionals provide checkups, guidance, and preventive care to those who need it most.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our camps include diagnostic screenings, consultations, and personalized health advice tailored to each participant. Beyond treatment, we focus on community education, promoting healthy lifestyles and disease prevention. We aim to increase awareness about early intervention and empower communities to take charge of their own health and wellbeing.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Every initiative at Medix Camp is designed to foster long-term wellbeing and healthier communities. Through collaboration with volunteers, healthcare experts, and local organizations, we extend our reach to underserved populations. Our vision is a world where everyone, regardless of location or resources, has access to reliable and compassionate healthcare.
          </p>
        </motion.div>
      </div>

      {/* Bottom Section: Mission & Vision */}
      <div className="container mx-auto grid md:grid-cols-2 gap-8">
        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white shadow-xl rounded-2xl border border-blue-100 p-8"
        >
          <Typography variant="h5" className="text-blue-700 font-semibold mb-3">
            Our Mission
          </Typography>
          <p className="text-gray-700 leading-relaxed">
            To provide affordable healthcare access to underserved communities, ensuring everyone receives proper medical attention and guidance.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white shadow-xl rounded-2xl border border-blue-100 p-8"
        >
          <Typography variant="h5" className="text-blue-700 font-semibold mb-3">
            Our Vision
          </Typography>
          <p className="text-gray-700 leading-relaxed">
            To create a healthier world where quality medical care is accessible to everyone, fostering wellbeing and community growth.
          </p>
        </motion.div>
      </div>
    </section>
    );
};

export default About;

