import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";
import { scrollToId } from "@/lib/motion";

const Footer = () => {
  return (
    <footer className="bg-[hsl(150,35%,10%)] text-white overflow-x-hidden">
      <div className="page-container py-12 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="DrStethos Logo" className="w-8 h-8 object-contain rounded-lg" />
              <span className="font-display text-base font-semibold tracking-tight">DrStethos</span>
            </div>
            <p className="text-white/55 text-xs leading-relaxed max-w-xs font-normal">
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
            <ul className="space-y-2.5 text-white/55 text-xs font-normal">
              <li>
                <button type="button" onClick={() => scrollToId("home")} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToId("about")} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToId("paths")} className="hover:text-white transition-colors">
                  Paths
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToId("faq")} className="hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToId("pricing")} className="hover:text-white transition-colors">
                  Pricing
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3.5">Resources</h3>
            <ul className="space-y-2.5 text-white/55 text-xs font-normal">
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/termsandservices/forhospitals" className="hover:text-white transition-colors">
                  Terms for Hospitals
                </Link>
              </li>
              <li>
                <Link to="/termsandservices/fordoctors" className="hover:text-white transition-colors">
                  Terms for Doctors
                </Link>
              </li>
              <li>
                <Link to="/safety-standards" className="hover:text-white transition-colors">
                  Safety Standards
                </Link>
              </li>
              <li>
                <button type="button" onClick={() => scrollToId("get-in-touch")} className="hover:text-white transition-colors">
                  Support
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3.5">Contact Us</h3>
            <ul className="space-y-3 text-white/55">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-primary" />
                <span className="text-xs leading-relaxed font-normal">
                  DRSTETHOS INNOVATIONS LLP
                  <br />
                  Bhimavaram, Andhra Pradesh, 534201
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
                <a
                  href="mailto:support@drstethos.com"
                  className="text-xs hover:text-white transition-colors font-normal"
                >
                  support@drstethos.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/40 font-normal">
            <p className="text-center md:text-left">© 2025 DrStethos. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-5">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/termsandservices/forhospitals" className="hover:text-white transition-colors">
                Terms (Hospitals)
              </Link>
              <Link to="/termsandservices/fordoctors" className="hover:text-white transition-colors">
                Terms (Doctors)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
