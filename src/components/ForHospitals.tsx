import { Users, CheckCircle, Calendar as CalendarIcon, BarChart } from "lucide-react";
import { Card } from "@/components/ui/card";


const benefits = [
  {
    icon: Users,
    title: "Hiring Efficiency",
    description: "Reduce time-to-hire with instant access to qualified, available medical professionals."
  },
  {
    icon: CheckCircle,
    title: "Verified Profiles",
    description: "All doctors are pre-screened with verified credentials and professional backgrounds."
  },
  {
    icon: CalendarIcon,
    title: "Scheduling Tools",
    description: "Intuitive calendar system to post shifts and manage staffing requirements seamlessly."
  },
  {
    icon: BarChart,
    title: "Shift Management",
    description: "Track filled positions, pending applications, and staffing analytics in real-time."
  }
];

const ForHospitals = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 bg-card hover:shadow-medical transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl gradient-medical flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-card-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              );
            })}
          </div>

          {/* Right Content */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              For Healthcare Facilities
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Streamline Your Staffing Process
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From emergency shift coverage to permanent hires—connect with qualified medical professionals instantly. Save time, reduce costs, and maintain optimal staffing levels.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForHospitals;
