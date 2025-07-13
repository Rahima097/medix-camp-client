import { motion } from "framer-motion"
import { Typography, Card, CardBody } from "@material-tailwind/react"
import { FaHeartbeat, FaAppleAlt, FaDumbbell, FaBed, FaTint, FaShieldAlt } from "react-icons/fa"

const HealthTips = () => {
  const healthTips = [
    {
      icon: FaHeartbeat,
      title: "Regular Health Checkups",
      description: "Schedule annual health screenings to catch potential issues early and maintain optimal health.",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      icon: FaAppleAlt,
      title: "Balanced Nutrition",
      description: "Eat a variety of fruits, vegetables, and whole grains to fuel your body with essential nutrients.",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: FaDumbbell,
      title: "Stay Active",
      description: "Engage in at least 30 minutes of physical activity daily to maintain cardiovascular health.",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: FaBed,
      title: "Quality Sleep",
      description: "Aim for 7-9 hours of quality sleep each night to support your body's natural healing processes.",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: FaTint,
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to maintain proper body function and energy levels.",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
    },
    {
      icon: FaShieldAlt,
      title: "Preventive Care",
      description: "Follow vaccination schedules and preventive measures to protect against common diseases.",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Typography variant="h2" className="font-bold text-gray-800 mb-4">
            Essential Health Tips
          </Typography>
          <Typography className="text-gray-600 text-lg max-w-2xl mx-auto">
            Simple yet effective health practices to maintain your well-being and prevent common health issues
          </Typography>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {healthTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-0">
                <CardBody className="text-center p-8">
                  <div
                    className={`w-16 h-16 ${tip.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
                  >
                    <tip.icon className={`h-8 w-8 ${tip.color}`} />
                  </div>

                  <Typography variant="h5" className="font-bold text-gray-800 mb-4">
                    {tip.title}
                  </Typography>

                  <Typography className="text-gray-600 leading-relaxed">{tip.description}</Typography>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HealthTips;
