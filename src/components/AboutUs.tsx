import { Users, Building2, Target, CheckCircle, Stethoscope, Briefcase } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const AboutUs = () => {
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.12 });

  return (
    <section ref={ref} className="section-y bg-white overflow-x-hidden">
      <div className="page-container">
        <div
          className={`text-center mb-12 md:mb-14 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h2 className="text-2xl md:text-3xl lg:text-[2.15rem] font-semibold text-gray-900 mb-3 tracking-tight">
            About DrStethos
          </h2>
          <div className="w-10 h-0.5 bg-primary mx-auto mb-4" />
          <p className="text-sm md:text-[15px] text-gray-500 max-w-2xl mx-auto font-normal leading-relaxed">
            Bridging the gap between hospitals and healthcare professionals
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14 md:mb-16">
          <div
            className={`space-y-6 transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            {[
              {
                icon: Target,
                title: "Our Mission",
                color: "bg-primary/10 text-primary",
                text: "DrStethos is a dedicated medical recruitment platform designed to bridge the gap between hospitals and healthcare professionals. Our mission is to make hiring in the healthcare sector faster, simpler, and more reliable by bringing everything into one seamless digital experience.",
              },
              {
                icon: Building2,
                title: "For Hospitals",
                color: "bg-blue-50 text-blue-600",
                text: "We provide hospitals with powerful tools to post jobs, manage applications, shortlist candidates, and schedule in-app interviews, ensuring a smooth and transparent hiring workflow.",
              },
              {
                icon: Stethoscope,
                title: "For Doctors",
                color: "bg-green-50 text-green-600",
                text: "Doctors can explore verified job opportunities, view complete role details, and apply with just a tap. We make it easy to find your next career opportunity.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-normal">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`relative w-full max-w-md mx-auto lg:max-w-none pt-8 pb-10 transition-all duration-700 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/assets/doctor.png"
                alt="Medical Team"
                className="w-full h-[300px] sm:h-[360px] md:h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="absolute bottom-3 left-3 sm:left-4 bg-white rounded-xl shadow-md p-3.5 max-w-[170px]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900 leading-none">5000+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 font-normal">Registered Doctors</div>
                </div>
              </div>
            </div>

            <div className="absolute top-1 right-3 sm:right-4 bg-white rounded-xl shadow-md p-3.5 max-w-[170px]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-base font-semibold text-gray-900 leading-none">1000+</div>
                  <div className="text-[11px] text-gray-500 mt-0.5 font-normal">Verified Hospitals</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`bg-gradient-to-br from-primary/[0.04] to-blue-50 rounded-2xl p-6 sm:p-8 md:p-10 transition-all duration-700 delay-300 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
            Why Choose DrStethos?
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Efficient",
                color: "bg-primary/10 text-primary",
                text: "Streamlined process that saves time for both hospitals and healthcare professionals",
              },
              {
                icon: CheckCircle,
                title: "Trustworthy",
                color: "bg-blue-50 text-blue-600",
                text: "All hospitals and doctors are verified, ensuring quality and reliability",
              },
              {
                icon: Briefcase,
                title: "Real-World Ready",
                color: "bg-green-50 text-green-600",
                text: "Built for real-world needs with practical features that actually work",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex flex-col items-center text-center px-2">
                  <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-[15px] font-semibold text-gray-900 mb-1.5">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-12 md:mt-14 max-w-3xl mx-auto">
          <p className="text-sm md:text-[15px] text-gray-500 leading-relaxed font-normal">
            At DrStethos, we believe that healthcare deserves a recruitment system that is efficient, trustworthy, and built for real-world needs. Whether you're a hospital looking for skilled professionals or a doctor seeking your next opportunity, we're here to make the process effortless.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
