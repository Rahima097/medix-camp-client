import { motion } from "framer-motion";
import { Typography, Button, Chip } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { FaCalendarAlt } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Banner = () => {
  const bannerSlides = [
    {
      id: 1,
      title: "Transforming Lives Through Healthcare",
      subtitle: "Join our medical camps and make a difference in your community",
      image: "https://i.ibb.co/qLd6Qq74/OIP-1-1.jpg",
      stats: "10,000+ Lives Touched",
    },
    {
      id: 2,
      title: "Expert Healthcare at Your Doorstep",
      subtitle: "Professional medical services in remote and underserved areas",
      image: "https://i.ibb.co/DPwVDv12/blog-6-ezgif-com-webp-to-jpg-converter-1.jpg",
      stats: "500+ Medical Professionals",
    },
    {
      id: 3,
      title: "Building Healthier Communities",
      subtitle: "Comprehensive health screenings and preventive care programs",
      image: "https://i.ibb.co/7NZWZ26H/cdc-fx9-RJg-ZYRUE-unsplash-1.jpg",
      stats: "200+ Successful Camps",
    },
  ];

  return (
    <section className="relative h-[100vh] lg:h-[90vh] md:h-screen overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="h-full"
      >
        {bannerSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />

              {/* Overlay Content */}
              <div className="absolute inset-0 flex items-center justify-center px-4 py-8 sm:py-12">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center text-white max-w-3xl"
                >
                  <Typography
                    variant="h1"
                    className="mb-3 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  >
                    {slide.title}
                  </Typography>

                  <Typography
                    variant="lead"
                    className="mb-4 text-sm sm:text-lg md:text-xl opacity-90"
                  >
                    {slide.subtitle}
                  </Typography>

                  <Chip
                    value={slide.stats}
                    className="mb-6 bg-primary-500 text-white text-xs sm:text-sm md:text-base px-4 py-1 rounded-full"
                  />

                  <div className="flex flex-wrap gap-3 justify-center items-center">
                    <Link to="/available-camps">
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 px-4 py-2 text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-sm" />
                          Explore Camps
                        </div>
                      </Button>
                    </Link>

                    <Link to="/register">
                      <Button
                        size="sm"
                        variant="outlined"
                        color="white"
                        className="border-white px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black transition-all duration-300"
                      >
                        Join Now
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
