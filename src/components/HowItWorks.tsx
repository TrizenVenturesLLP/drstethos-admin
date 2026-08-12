import { UserPlus, Building2, Search, Send, Video, TrendingUp } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Account",
    description: "Hospitals and doctors sign up with secure verification to ensure authenticity and trust.",
  },
  {
    icon: Building2,
    title: "Hospitals Post Jobs",
    description: "Hospitals can create detailed job listings by specifying role, experience, location, salary range, and requirements.",
  },
  {
    icon: Search,
    title: "Doctors Discover Opportunities",
    description: "Doctors browse verified hospital openings, filter based on specialization, and view complete job details.",
  },
  {
    icon: Send,
    title: "Apply or Shortlist",
    description: "Doctors can apply instantly with one tap, while hospitals can manage applicants, shortlist candidates, or request more details.",
  },
  {
    icon: Video,
    title: "In-App Interviews",
    description: "Hospitals schedule interviews directly inside the platform, and doctors attend without switching apps.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Both doctors and hospitals can track applications, interview status, and job updates in real time.",
  },
];

const HowItWorks = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className="section-y bg-gray-50/80 overflow-x-hidden">
      <div className="page-container">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-2xl md:text-3xl lg:text-[2.15rem] font-semibold text-gray-900 tracking-tight">
            How It Works
          </h2>
          <div className="w-10 h-0.5 bg-primary mx-auto mt-3 mb-4" />
          <p className="text-sm md:text-[15px] text-gray-500 max-w-xl mx-auto font-normal">
            Six simple steps to transform healthcare recruitment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`group relative bg-white rounded-xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-500 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: inView ? `${index * 70}ms` : "0ms" }}
              >
                <div className="relative mb-4 inline-flex">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Icon className="h-5 w-5 text-white" strokeWidth={2.25} />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[11px] font-semibold text-gray-800">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-[15px] font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-normal">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
