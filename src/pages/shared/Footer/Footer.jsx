import { Typography, Button, Input } from "@material-tailwind/react"
import { motion } from "framer-motion"
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
  FaStethoscope,
  FaUserMd,
  FaAmbulance,
} from "react-icons/fa"
import MedixCampLogo from "../MedixCampLogo/MedixCampLogo"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: "Quick Links",
      links: [
        { name: "Home", href: "/" },
        { name: "Available Camps", href: "/available-camps" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "For Participants",
      links: [
        { name: "Join Camp", href: "/available-camps" },
        { name: "My Dashboard", href: "/participant-dashboard" },
        { name: "Health Records", href: "/participant-dashboard/health-records" },
        { name: "Payment History", href: "/participant-dashboard/payment-history" },
      ],
    },
    {
      title: "For Organizers",
      links: [
        { name: "Add Camp", href: "/organizer-dashboard/add-camp" },
        { name: "Manage Camps", href: "/organizer-dashboard/manage-camps" },
        { name: "Analytics", href: "/organizer-dashboard/analytics" },
        { name: "Support", href: "/support" },
      ],
    },
  ]

  const contactInfo = [
    { icon: FaPhone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: FaEnvelope, text: "info@medixcare.com", href: "mailto:info@medixcare.com" },
    { icon: FaMapMarkerAlt, text: "123 Healthcare Ave, Medical City, MC 12345", href: "#" },
  ]

  const socialLinks = [
    { icon: FaFacebook, href: "#", color: "hover:text-blue-600", bg: "hover:bg-blue-50" },
    { icon: FaTwitter, href: "#", color: "hover:text-blue-400", bg: "hover:bg-blue-50" },
    { icon: FaInstagram, href: "#", color: "hover:text-pink-500", bg: "hover:bg-pink-50" },
    { icon: FaLinkedin, href: "#", color: "hover:text-blue-700", bg: "hover:bg-blue-50" },
  ]

  const medicalIcons = [
    { icon: FaStethoscope, delay: 0 },
    { icon: FaUserMd, delay: 0.2 },
    { icon: FaAmbulance, delay: 0.4 },
  ]

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10">
          <FaStethoscope className="h-32 w-32 rotate-12" />
        </div>
        <div className="absolute top-32 right-20">
          <FaUserMd className="h-24 w-24 -rotate-12" />
        </div>
        <div className="absolute bottom-20 left-1/3">
          <FaAmbulance className="h-28 w-28 rotate-6" />
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              {medicalIcons.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  className="mx-4"
                >
                  <item.icon className="h-8 w-8 text-blue-200" />
                </motion.div>
              ))}
            </div>

            <Typography variant="h2" className="mb-4 font-bold text-white">
              Stay Connected with Healthcare
            </Typography>
            <Typography className="mb-8 text-blue-100 text-lg max-w-2xl mx-auto">
              Get the latest updates on medical camps, health tips, and community wellness programs delivered to your
              inbox.
            </Typography>

            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="!border-white/30 focus:!border-white text-white placeholder:text-blue-100 bg-white/10 backdrop-blur-sm"
                  labelProps={{ className: "hidden" }}
                  containerProps={{ className: "min-w-0" }}
                />
              </div>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <MedixCampLogo className="h-12 w-12" />
              <div>
                <Typography variant="h4" className="font-bold text-white">
                  Medix Care
                </Typography>
                <Typography variant="small" className="text-blue-200">
                  Healthcare for Everyone
                </Typography>
              </div>
            </div>

            <Typography className="text-gray-300 mb-6 leading-relaxed">
              Bridging the gap between communities and quality healthcare through innovative medical camp management.
              Making healthcare accessible, affordable, and available to all.
            </Typography>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-blue-600/20 group-hover:bg-blue-600/30 transition-colors">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <Typography variant="small">{item.text}</Typography>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 rounded-xl bg-gray-800 ${social.bg} ${social.color} transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Typography variant="h6" className="mb-4 font-semibold text-white">
                {section.title}
              </Typography>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="text-gray-300 hover:text-blue-400 transition-all duration-200 text-sm block py-1"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Typography variant="small" className="text-gray-400">
              © {currentYear} Medix Care. All rights reserved. | Privacy Policy | Terms of Service
            </Typography>
            <div className="flex items-center gap-2 text-gray-400">
              <Typography variant="small">Made with</Typography>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <FaHeart className="text-red-500 h-4 w-4" />
              </motion.div>
              <Typography variant="small">for global health</Typography>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;

