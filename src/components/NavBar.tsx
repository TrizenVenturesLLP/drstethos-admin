import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "how-it-works", label: "How It Works" },
  { id: "pricing", label: "Pricing" },
];

const NavBar = () => {
  const [open, setOpen] = useState(false);

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

  const handleNavClick = (sectionId: string) => {
    setOpen(false);
    // Allow sheet close animation before scrolling
    requestAnimationFrame(() => {
      setTimeout(() => scrollToSection(sectionId), 50);
    });
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

          {/* Desktop links — large screens only */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[13px] text-gray-600 hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="hidden sm:inline-flex h-9 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 text-[12px] sm:text-[13px] font-medium shadow-none"
              size="sm"
              onClick={() => scrollToSection("get-in-touch")}
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Contact
            </Button>

            {/* Hamburger — mobile & tablet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9 text-gray-700 hover:text-primary hover:bg-gray-50"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="flex w-[min(100%,20rem)] flex-col p-0"
              >
                <SheetHeader className="px-5 pt-5 pb-4 border-b border-gray-100 text-left">
                  <SheetTitle className="flex items-center gap-2.5 text-[15px] font-semibold text-gray-900">
                    <img
                      src="/logo.png"
                      alt=""
                      className="w-7 h-7 object-contain rounded-full"
                    />
                    DrStethos
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-1 flex-col px-3 py-4 gap-0.5">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="text-left px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-secondary hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className="px-5 pt-3 pb-6 border-t border-gray-100">
                  <Button
                    className="w-full h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-sm font-medium shadow-none"
                    onClick={() => handleNavClick("get-in-touch")}
                  >
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    Contact Us
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
