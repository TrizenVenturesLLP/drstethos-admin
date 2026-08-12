import { Button } from "@/components/ui/button";
import { Smartphone, Download } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const AppDownload = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className="section-y gradient-medical relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
        <div className="absolute top-8 left-8 w-56 h-56 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-8 right-8 w-72 h-72 bg-white rounded-full blur-3xl" />
      </div>

      <div className="page-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-5xl mx-auto">
          <div
            className={`text-white space-y-4 text-center lg:text-left transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <h2 className="text-2xl md:text-3xl lg:text-[2.15rem] font-semibold tracking-tight">
              Download Our Mobile App
            </h2>
            <p className="text-sm md:text-[15px] text-white/85 leading-relaxed max-w-md mx-auto lg:mx-0 font-normal">
              Take your medical career on the go. Manage shifts, respond to opportunities, and stay connected—anywhere, anytime.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
              <Button
                size="lg"
                variant="secondary"
                className="text-sm px-5 py-5 rounded-full shadow-md hover:scale-[1.02] transition-transform gap-2 font-medium"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                App Store
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="text-sm px-5 py-5 rounded-full shadow-md hover:scale-[1.02] transition-transform gap-2 font-medium"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                Google Play
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-2 text-white/75 text-xs pt-1 font-normal">
              <Download className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Over 50,000+ downloads • 4.8★ rating</span>
            </div>
          </div>

          <div
            className={`flex justify-center lg:justify-end transition-all duration-700 delay-150 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="relative">
              <div className="relative w-52 sm:w-56 h-[420px] sm:h-[460px] bg-gray-900 rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-gray-900 rounded-b-2xl z-10" />
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white rounded-[2rem] overflow-hidden p-5 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 mb-4">
                    <img
                      src="/logo.png"
                      alt="DrStethos Logo"
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">DrStethos</h3>
                  <p className="text-xs text-gray-500 text-center mb-5 font-normal">Medical Recruitment Platform</p>
                  <div className="w-full space-y-2.5">
                    <div className="h-10 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-medium shadow-sm">
                      Get Started
                    </div>
                    <div className="h-8 bg-gray-100 rounded-md animate-pulse" />
                    <div className="h-8 bg-gray-100 rounded-md animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="absolute top-1 right-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg animate-float">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
