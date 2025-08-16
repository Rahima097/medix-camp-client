import { motion } from "framer-motion";
import { Typography } from "@material-tailwind/react";

const achievements = [
  { label: "Camps Conducted", value: 50 },
  { label: "Patients Served", value: 10000 },
  { label: "Healthcare Professionals", value: 120 },
  { label: "Volunteers Engaged", value: 200 },
];

const Achievements = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <Typography variant="h3" className="text-gray-800 font-bold text-4xl mb-12">
          Our Achievements
        </Typography>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300"
            >
              <Typography variant="h2" className="text-blue-700 font-extrabold text-4xl mb-2">
                {item.value.toLocaleString()}
              </Typography>
              <Typography className="text-gray-600 font-medium text-center">{item.label}</Typography>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;
