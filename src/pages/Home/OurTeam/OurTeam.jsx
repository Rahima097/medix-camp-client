import { motion } from "framer-motion";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

// Camp doctors data
const doctors = [
    { name: "Dr. Emily White", position: "Cardiologist", image: "https://i.ibb.co.com/q30sF6mM/woman-doctor-wearing-lab-coat-with-stethoscope-isolated-1.jpg" },
    { name: "Dr. David Lee", position: "Endocrinologist", image: "https://i.ibb.co.com/gb1NLq51/portrait-hansome-young-male-doctor-man-1.jpg" },
    { name: "Dr. Olivia Green", position: "Ophthalmologist", image: "https://i.ibb.co.com/nsPPBJ52/humberto-chavez-FVh-yq-LR9e-A-unsplash-1.jpg" },
    { name: "Dr. Robert Brown", position: "Dentist", image: "https://i.ibb.co.com/Rp7jYYk3/usman-yousaf-p-Trhfmj2j-DA-unsplash-1.jpg" },
    { name: "Dr. Chris Johnson", position: "Pediatrician", image: "https://i.ibb.co.com/6RDz1RFg/pexels-tima-miroshnichenko-5452205.jpg" },
];

const OurTeam = () => {
    return (
        <section className="container mx-auto  py-20 px-6">
            <Typography variant="h3" className="text-center mb-12 font-bold text-gray-800">
                Meet Our Team
            </Typography>
            <div className="grid md:grid-cols-5 gap-8">
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

    );
};

export default OurTeam;