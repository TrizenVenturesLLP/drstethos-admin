import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Stethoscope, Hospital, Users, Building2, ChevronDown } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const Hero = () => {
  const [showcaseRef, showcaseInView] = useInView<HTMLDivElement>({
    threshold: 0.25,
    rootMargin: "0px 0px -10% 0px",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const scrollToShowcase = () => {
    document.getElementById("hero-showcase")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="relative w-full min-h-[calc(100dvh-3.5rem)] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden flex flex-col">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-24 w-[360px] h-[360px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="page-container relative z-10 flex-1 flex flex-col items-center justify-center text-center py-16 md:py-20">
          <div
            className={`max-w-3xl mx-auto space-y-6 transition-all duration-700 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white/95 text-xs font-medium backdrop-blur-sm border border-white/25">
              <Stethoscope className="w-3.5 h-3.5" />
              DrStethos Medical Platform
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-semibold leading-[1.2] tracking-tight text-white">
              Smart Hiring for Hospitals and Doctors
            </h1>

            <p className="text-sm sm:text-[15px] md:text-base text-white/85 leading-relaxed max-w-xl mx-auto font-normal">
              DrStethos is your solution for professional, safe, and rapid medical services, connecting doctors with hospitals seamlessly across India.
            </p>

            <div className="pt-1">
              <Button
                size="lg"
                className="text-sm px-8 py-5 rounded-full shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all bg-white text-blue-700 hover:bg-gray-50 font-medium"
                onClick={scrollToShowcase}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToShowcase}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
            aria-label="Scroll to see the app"
          >
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-bounce-soft" />
          </button>
        </div>
      </section>

      <section
        id="hero-showcase"
        className="relative w-full bg-gradient-to-b from-blue-800 via-blue-700 to-blue-600 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" aria-hidden="true">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div ref={showcaseRef} className="page-container pt-12 md:pt-16 pb-0 relative z-10">
          <div
            className={`text-center mb-8 md:mb-10 transition-all duration-700 ${
              showcaseInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <p className="text-white/80 text-sm md:text-[15px] max-w-lg mx-auto font-normal">
              Explore the platform built for modern healthcare hiring
            </p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto h-[300px] sm:h-[360px] md:h-[440px] lg:h-[500px] flex items-end justify-center overflow-hidden px-2 sm:px-4">
            <div
              className={`absolute bottom-0 left-1/2 w-[160px] sm:w-[200px] md:w-[280px] lg:w-[340px] transition-all duration-1000 ease-out ${
                showcaseInView
                  ? "opacity-100 -translate-x-[calc(50%+6.5rem)] sm:-translate-x-[calc(50%+8.5rem)] md:-translate-x-[calc(50%+11rem)] lg:-translate-x-[calc(50%+13rem)] scale-100"
                  : "opacity-0 -translate-x-1/2 scale-90"
              }`}
              style={{ transitionDelay: showcaseInView ? "280ms" : "0ms" }}
            >
              <img
                src="/assets/left.png"
                alt="DrStethos app — left view"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>

            <div
              className={`absolute bottom-0 left-1/2 w-[160px] sm:w-[200px] md:w-[280px] lg:w-[340px] transition-all duration-1000 ease-out ${
                showcaseInView
                  ? "opacity-100 -translate-x-[calc(50%-6.5rem)] sm:-translate-x-[calc(50%-8.5rem)] md:-translate-x-[calc(50%-11rem)] lg:-translate-x-[calc(50%-13rem)] scale-100"
                  : "opacity-0 -translate-x-1/2 scale-90"
              }`}
              style={{ transitionDelay: showcaseInView ? "280ms" : "0ms" }}
            >
              <img
                src="/assets/right.png"
                alt="DrStethos app — right view"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>

            <div
              className={`relative z-10 w-[180px] sm:w-[220px] md:w-[300px] lg:w-[380px] transition-all duration-1000 ease-out ${
                showcaseInView ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"
              }`}
              style={{ transitionDelay: showcaseInView ? "80ms" : "0ms" }}
            >
              <img
                src="/assets/center.png"
                alt="DrStethos app"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {[
              {
                icon: Building2,
                value: "1000+",
                label: "Hospitals",
                className: "top-[8%] left-0 sm:left-2 lg:left-4",
                delay: "520ms",
              },
              {
                icon: Users,
                value: "5000+",
                label: "Doctors",
                className: "top-[16%] right-0 sm:right-2 lg:right-4",
                delay: "620ms",
              },
              {
                icon: Stethoscope,
                value: "500+",
                label: "Active Jobs",
                className: "bottom-[20%] left-0 sm:left-2 lg:left-4",
                delay: "720ms",
              },
              {
                icon: Hospital,
                value: "2000+",
                label: "Placements",
                className: "bottom-[30%] right-0 sm:right-2 lg:right-4",
                delay: "820ms",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`hidden md:block absolute ${stat.className} z-20 transition-all duration-700 ease-out ${
                    showcaseInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: showcaseInView ? stat.delay : "0ms" }}
                >
                  <div className="bg-white/15 backdrop-blur-md rounded-xl px-3 py-2.5 shadow-xl border border-white/25">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white/25 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-white leading-none">{stat.value}</div>
                        <div className="text-[11px] text-white/75 mt-0.5 font-normal">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
