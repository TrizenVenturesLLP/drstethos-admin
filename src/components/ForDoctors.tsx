import { Calendar, Clock, Award, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useInView } from "@/hooks/use-in-view";

const benefits = [
  {
    icon: Calendar,
    title: "Shift Discovery",
    description: "Browse available shifts that match your schedule and location preferences.",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Choose full-time, part-time, or per-diem opportunities based on your lifestyle.",
  },
  {
    icon: Award,
    title: "Profile Credibility",
    description: "Verified badge system builds trust and credibility with healthcare facilities.",
  },
  {
    icon: Upload,
    title: "Easy Credential Upload",
    description: "Securely store and share your medical licenses and certifications digitally.",
  },
];

const ForDoctors = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className="section-y gradient-medical text-white overflow-x-hidden">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div
            className={`space-y-4 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium">
              For Medical Professionals
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[2.15rem] font-semibold tracking-tight leading-snug">
              Take Control of Your Medical Career
            </h2>
            <p className="text-sm md:text-[15px] text-white/85 leading-relaxed max-w-lg font-normal">
              Whether you're seeking permanent positions, temporary shifts, or consulting opportunities—find your perfect fit with our intelligent matching system.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={benefit.title}
                  className={`p-5 bg-white/10 backdrop-blur border-white/15 hover:bg-white/15 transition-all duration-500 ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: inView ? `${120 + index * 70}ms` : "0ms" }}
                >
                  <Icon className="h-6 w-6 text-white mb-3" strokeWidth={2} />
                  <h3 className="text-sm font-semibold mb-1.5 text-white">{benefit.title}</h3>
                  <p className="text-white/75 text-xs leading-relaxed font-normal">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForDoctors;
