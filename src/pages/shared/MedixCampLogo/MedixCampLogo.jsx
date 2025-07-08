import { motion } from "framer-motion"

const MedixCampLogo = ({ className = "h-8 w-8" }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${className} flex items-center justify-center`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>

        {/* Medical Cross */}
        <rect x="42" y="20" width="16" height="60" rx="8" fill="url(#logoGradient)" />
        <rect x="20" y="42" width="60" height="16" rx="8" fill="url(#logoGradient)" />

        {/* Heartbeat line */}
        <path
          d="M10 50 L25 50 L30 35 L35 65 L40 35 L45 50 L90 50"
          stroke="url(#logoGradient)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Outer circle */}
        <circle cx="50" cy="50" r="45" stroke="url(#logoGradient)" strokeWidth="4" fill="none" opacity="0.3" />
      </svg>
    </motion.div>
  )
}

export default MedixCampLogo;
