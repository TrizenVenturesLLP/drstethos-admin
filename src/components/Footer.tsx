import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white overflow-x-hidden">
      <div className="page-container py-12 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="DrStethos Logo" className="w-8 h-8 object-contain" />
              <span className="text-base font-semibold tracking-tight">DrStethos</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs font-normal">
              Connecting doctors with hospitals seamlessly. Your trusted medical recruitment platform.
            </p>
            <div className="flex gap-2 pt-1">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3.5">Quick Links</h3>
            <ul className="space-y-2.5 text-gray-400 text-xs font-normal">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition-colors">For Doctors</Link></li>
              <li><Link to="/hospitals" className="hover:text-white transition-colors">For Hospitals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3.5">Resources</h3>
            <ul className="space-y-2.5 text-gray-400 text-xs font-normal">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/termsandservices/forhospitals" className="hover:text-white transition-colors">Terms for Hospitals</Link></li>
              <li><Link to="/termsandservices/fordoctors" className="hover:text-white transition-colors">Terms for Doctors</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3.5">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-primary" />
                <span className="text-xs leading-relaxed font-normal">
                  DRSTETHOS INNOVATIONS LLP<br />
                  H NO 7-7-14, GARUVU VEEDI,<br />
                  WARD NO-12, ADJ, Bhimavaram,<br />
                  West Godavari, Andhra Pradesh, 534201
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                <a href="tel:+917075355969" className="text-xs hover:text-white transition-colors font-normal">
                  +91 70753 55969
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 flex-shrink-0 text-primary" />
                <a href="mailto:stethosabisha@gmail.com" className="text-xs hover:text-white transition-colors font-normal">
                  stethosabisha@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500 font-normal">
            <p className="text-center md:text-left">© {currentYear} DrStethos. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-5">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/termsandservices/forhospitals" className="hover:text-white transition-colors">Terms (Hospitals)</Link>
              <Link to="/termsandservices/fordoctors" className="hover:text-white transition-colors">Terms (Doctors)</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
