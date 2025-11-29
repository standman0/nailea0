import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white shadow-md flex justify-between items-center"
    >
      <Link to="/" className="text-2xl font-bold text-pink-600">
        GlamNails
      </Link>

      <div className="flex gap-6 text-lg">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link
          to="/book"
          className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow"
        >
          Book Now
        </Link>
      </div>
    </motion.nav>
  );
}
