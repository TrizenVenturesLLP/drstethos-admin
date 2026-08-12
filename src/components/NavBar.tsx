import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 56;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="page-container">
        <div className="flex items-center justify-between h-14 gap-4">
          <Link to="/" className="flex items-center gap-2.5 group min-w-0">
            <img
              src="/logo.png"
              alt="DrStethos Logo"
              className="w-8 h-8 object-contain rounded-full group-hover:scale-105 transition-transform flex-shrink-0"
            />
            <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
              DrStethos
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "how-it-works", label: "How It Works" },
              { id: "pricing", label: "Pricing" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[13px] text-gray-600 hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          <Button
            className="h-9 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 text-[12px] sm:text-[13px] font-medium shadow-none"
            size="sm"
            onClick={() => scrollToSection("get-in-touch")}
          >
            <Phone className="w-3.5 h-3.5 mr-1.5" />
            Contact
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
