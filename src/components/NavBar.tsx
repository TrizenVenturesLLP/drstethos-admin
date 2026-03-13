import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="DrStethos Logo" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain rounded-full group-hover:scale-105 transition-transform"
            />
            <span className="text-xl md:text-2xl ml-2 font-bold text-gray-900"> DrStethos</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-primary transition-colors font-medium">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-primary transition-colors font-medium">
              About Us
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-primary transition-colors font-medium">
              How It Works
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-primary transition-colors font-medium">
              Pricing
            </button>
          </div>

          {/* Contact Button */}
          <Button 
            className="rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all"
            size="sm"
            onClick={() => scrollToSection('get-in-touch')}
          >
            <Phone className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Contact Us</span>
            <span className="sm:hidden">Contact</span>
          </Button>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
