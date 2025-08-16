import { motion } from "framer-motion";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

// Camp doctors data
const doctors = [
  { name: "Dr. Emily White", position: "Cardiologist", image: "https://i.ibb.co.com/q30sF6mM/woman-doctor-wearing-lab-coat-with-stethoscope-isolated-1.jpg" },
  { name: "Dr. David Lee", position: "Endocrinologist", image: "https://i.ibb.co.com/gb1NLq51/portrait-hansome-young-male-doctor-man-1.jpg" },
  { name: "Dr. Olivia Green", position: "Ophthalmologist", image: "https://i.ibb.co.com/nsPPBJ52/humberto-chavez-FVh-yq-LR9e-A-unsplash-1.jpg" },
  { name: "Dr. Robert Brown", position: "Dentist", image: "https://i.ibb.co.com/Rp7jYYk3/usman-yousaf-p-Trhfmj2j-DA-unsplash-1.jpg" },
];

export default function AboutUs() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-700">
      {/* Hero */}
      <section className="relative h-80 bg-[url('/assets/about-hero.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <Typography variant="h2" className="font-bold text-gray-800  text-4xl lg:text-5xl">
            About Medix Camp
          </Typography>
          <p className="mt-4 text-lg text-gray-800 ">
            Healing communities through medical care & compassion
          </p>
        </motion.div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-3 gap-8">
        {[
          { title: "Our Mission", desc: "Providing affordable healthcare access to underserved communities." },
          { title: "Our Vision", desc: "A healthier world where everyone has access to quality medical care." },
          { title: "Our Values", desc: "Compassion, Integrity, and Service to humanity." }
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-white shadow-xl rounded-2xl border border-blue-100 hover:shadow-2xl transition-all duration-300">
              <CardBody>
                <Typography variant="h4" className="mb-3 text-blue-700 font-semibold">
                  {item.title}
                </Typography>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Journey */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20 px-6 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <Typography variant="h3" className="mb-8 font-bold text-3xl">
            Our Journey
          </Typography>
          <div className="space-y-6 text-lg">
            <p>🚑 Started in 2018 with just 5 volunteers and 1 camp</p>
            <p>🏥 Expanded to 50+ camps across multiple regions by 2022</p>
            <p>🌍 Serving thousands of patients every year</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <Typography variant="h3" className="text-center mb-12 font-bold text-blue-700">
          Meet Our Team
        </Typography>
        <div className="grid md:grid-cols-4 gap-8">
          {doctors.map((doc, idx) => (
            <Card key={idx} className="bg-white shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300">
              <img
                src={doc.image}
                alt={doc.name}
                className="w-full h-52 object-cover rounded-t-2xl"
              />
              <CardBody className="text-center">
                <Typography variant="h5" className="text-blue-700 font-semibold">
                  {doc.name}
                </Typography>
                <p className="text-gray-600">{doc.position}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
