import { Users, CheckCircle, Calendar as CalendarIcon, BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useInView } from "@/hooks/use-in-view";

const benefits = [
  {
    icon: Users,
    title: "Hiring Efficiency",
    description: "Reduce time-to-hire with instant access to qualified, available medical professionals.",
  },
  {
    icon: CheckCircle,
    title: "Verified Profiles",
    description: "All doctors are pre-screened with verified credentials and professional backgrounds.",
  },
  {
    icon: CalendarIcon,
    title: "Scheduling Tools",
    description: "Intuitive calendar system to post shifts and manage staffing requirements seamlessly.",
  },
  {
    icon: BarChart,
    title: "Shift Management",
    description: "Track filled positions, pending applications, and staffing analytics in real-time.",
  },
];

const ForHospitals = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.15 });

  return (
    <section ref={ref} className="section-y bg-secondary/40 overflow-x-hidden">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="grid sm:grid-cols-2 gap-4 order-2 lg:order-1">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={benefit.title}
                  className={`p-5 bg-card border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: inView ? `${index * 70}ms` : "0ms" }}
                >
                  <div className="w-10 h-10 rounded-xl gradient-medical flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-sm font-semibold mb-1.5 text-card-foreground">{benefit.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-normal">{benefit.description}</p>
                </Card>
              );
            })}
          </div>

          <div
            className={`space-y-4 order-1 lg:order-2 transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
              For Healthcare Facilities
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-[2.15rem] font-semibold text-foreground tracking-tight leading-snug">
              Streamline Your Staffing Process
            </h2>
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-lg font-normal">
              From emergency shift coverage to permanent hires—connect with qualified medical professionals instantly. Save time, reduce costs, and maintain optimal staffing levels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForHospitals;
