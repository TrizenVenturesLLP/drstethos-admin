import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const hospitalPlans = [
  {
    name: "Silver",
    tagline: "Essential Hiring",
    popular: false,
    monthlyPrice: "3,500",
    yearlyPrice: "33,500",
    features: [
      { name: "Verified Profile Unlocks", value: "50", included: true },
      { name: "Job Posts", value: "2", included: true },
      { name: "Priority Listing", value: "No", included: false },
      { name: "Interview Invites", value: "10", included: true },
      { name: "Shortlist Limit", value: "20", included: true },
      { name: "API Access", value: "No", included: false },
    ],
  },
  {
    name: "Gold",
    tagline: "Growth Accelerated",
    popular: true,
    monthlyPrice: "8,500",
    yearlyPrice: "81,500",
    features: [
      { name: "Verified Profile Unlocks", value: "150", included: true },
      { name: "Job Posts", value: "5", included: true },
      { name: "Priority Listing", value: "Single Boost", included: true },
      { name: "Interview Invites", value: "40", included: true },
      { name: "Shortlist Limit", value: "50", included: true },
      { name: "API Access", value: "No", included: false },
    ],
  },
  {
    name: "Platinum",
    tagline: "Total Talent Command",
    popular: false,
    monthlyPrice: "14,500",
    yearlyPrice: "1,39,000",
    features: [
      { name: "Verified Profile Unlocks", value: "1,000", included: true },
      { name: "Job Posts", value: "30", included: true },
      { name: "Priority Listing", value: "Double Boost", included: true },
      { name: "Interview Invites", value: "Unlimited", included: true },
      { name: "Shortlist Limit", value: "500", included: true },
      { name: "API Access", value: "Yes", included: true },
    ],
  },
];

const doctorPlans = [
  {
    name: "Basic Career",
    tagline: "Get started free",
    popular: false,
    isFree: true,
    priceLabel: "FREE",
    priceSubtext: "No credit card required",
    features: [
      { name: "Verified Profile", value: "Limited", included: true },
      { name: "Featured Profile Status", value: "No", included: false },
      { name: "Job Applications", value: "5/month", included: true },
      { name: "Search Filters", value: "Basic", included: true },
      { name: "Direct Messaging", value: "No", included: false },
      { name: "CV Highlighting", value: "No", included: false },
      { name: "Video Interviewing", value: "No", included: false },
      { name: "Priority Support", value: "No", included: false },
    ],
  },
  {
    name: "Premium Physician",
    tagline: "Maximum Visibility & Tools",
    popular: true,
    isFree: false,
    priceLabel: "499",
    pricePeriod: "for 3 months",
    priceSubtext: "Save ~10% vs monthly · 12 weeks of enhanced exposure",
    features: [
      { name: "Verified Profile", value: "Yes (Verified Badge)", included: true },
      { name: "Featured Profile Status", value: "Yes (Top Search Result)", included: true },
      { name: "Job Applications", value: "Unlimited", included: true },
      { name: "Search Filters", value: "Advanced & Niche", included: true },
      { name: "Direct Messaging", value: "Yes", included: true },
      { name: "CV Highlighting", value: "Yes", included: true },
      { name: "Video Interviewing", value: "Yes (Pre-screening)", included: true },
      { name: "Priority Support", value: "Yes", included: true },
    ],
  },
];

const hospitalBenefits = [
  "Direct Doctor Connect",
  "Verified Credential Badges",
  "No Agency Fees (keep 100% first month salary)",
  "Automated B2B GST Invoicing",
];

const doctorBenefits = [
  "Avoid 3rd party fees — keep 100% of your first month salary",
  "Connect directly with hospital HR teams",
  "Instant profile & job notifications",
  "Showcase verified credentials",
];

type Feature = { name: string; value: string; included: boolean };

const FeatureRow = ({ feature }: { feature: Feature }) => (
  <div className="flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0">
    {feature.included ? (
      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
    ) : (
      <X className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" strokeWidth={2} />
    )}
    <div className="flex flex-1 items-baseline justify-between gap-3 min-w-0">
      <span
        className={`text-[13px] font-medium ${
          feature.included ? "text-gray-800" : "text-gray-400"
        }`}
      >
        {feature.name}
      </span>
      <span
        className={`text-[12px] text-right flex-shrink-0 ${
          feature.included ? "text-gray-500" : "text-gray-300"
        }`}
      >
        {feature.value}
      </span>
    </div>
  </div>
);

const BenefitsPanel = ({
  title,
  items,
  note,
}: {
  title: string;
  items: string[];
  note: string;
}) => (
  <div className="mt-8 rounded-2xl border border-gray-100 bg-secondary/50 p-5 sm:p-6 max-w-3xl mx-auto">
    <h4 className="text-sm font-semibold text-gray-900 mb-3.5">{title}</h4>
    <ul className="grid sm:grid-cols-2 gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} />
          <span className="text-[13px] text-gray-600 leading-snug">{item}</span>
        </li>
      ))}
    </ul>
    <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100/80">{note}</p>
  </div>
);

const Pricing = () => {
  const scrollToContact = () => {
    document.getElementById("get-in-touch")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="section-y bg-white overflow-x-hidden">
      <div className="page-container">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-[2.15rem] font-semibold text-gray-900 mb-3 tracking-tight">
            Choose Your Plan
          </h2>
          <div className="w-10 h-0.5 bg-primary mx-auto mb-4" />
          <p className="text-sm md:text-[15px] text-gray-500 max-w-xl mx-auto font-normal leading-relaxed">
            Transparent pricing for hospitals and doctors — upgrade when you need more reach.
          </p>
        </div>

        <Tabs defaultValue="hospitals" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full max-w-xs sm:max-w-sm mx-auto grid-cols-2 mb-10 h-11 p-1 bg-secondary/80 rounded-full">
            <TabsTrigger
              value="hospitals"
              className="rounded-full text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              For Hospitals
            </TabsTrigger>
            <TabsTrigger
              value="doctors"
              className="rounded-full text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              For Doctors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hospitals" className="mt-0 focus-visible:outline-none">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 pt-2">
              {hospitalPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl bg-white border transition-all duration-300 ${
                    plan.popular
                      ? "border-primary/40 shadow-medical ring-1 ring-primary/10 sm:scale-[1.02] z-[1]"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center bg-primary text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm">
                        Best Value
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <div className="mb-5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-primary/80 mb-1">
                        {plan.tagline}
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="mb-5 pb-5 border-b border-gray-100">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[2rem] font-semibold text-gray-900 tracking-tight leading-none">
                          ₹{plan.monthlyPrice}
                        </span>
                        <span className="text-[13px] text-gray-500">/mo</span>
                      </div>
                      <p className="text-[12px] text-gray-500 mt-1.5">
                        or ₹{plan.yearlyPrice}/yr{" "}
                        <span className="text-green-600 font-medium">(~20% off)</span>
                      </p>
                    </div>

                    <div className="flex-1 mb-6">
                      {plan.features.map((feature) => (
                        <FeatureRow key={feature.name} feature={feature} />
                      ))}
                    </div>

                    <Button
                      onClick={scrollToContact}
                      className={`w-full h-11 rounded-full text-[13px] font-medium ${
                        plan.popular
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-none"
                          : "border-gray-200 text-gray-800 hover:bg-gray-50"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <BenefitsPanel
              title="Why DrStethos?"
              items={hospitalBenefits}
              note="*Annual pricing gives ~20% discount. All prices are inclusive of taxes."
            />
          </TabsContent>

          <TabsContent value="doctors" className="mt-0 focus-visible:outline-none">
            <div className="grid sm:grid-cols-2 gap-4 lg:gap-5 max-w-3xl mx-auto pt-2">
              {doctorPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl bg-white border transition-all duration-300 ${
                    plan.popular
                      ? "border-primary/40 shadow-medical ring-1 ring-primary/10 sm:scale-[1.02] z-[1]"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow-sm">
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    <div className="mb-5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-primary/80 mb-1">
                        {plan.tagline}
                      </p>
                      <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="mb-5 pb-5 border-b border-gray-100">
                      {plan.isFree ? (
                        <>
                          <span className="text-[2rem] font-semibold text-gray-900 tracking-tight leading-none">
                            {plan.priceLabel}
                          </span>
                          <p className="text-[12px] text-gray-500 mt-1.5">{plan.priceSubtext}</p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[2rem] font-semibold text-gray-900 tracking-tight leading-none">
                              ₹{plan.priceLabel}
                            </span>
                            <span className="text-[13px] text-gray-500">{plan.pricePeriod}</span>
                          </div>
                          <p className="text-[12px] text-green-600 font-medium mt-1.5">
                            {plan.priceSubtext}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex-1 mb-6">
                      {plan.features.map((feature) => (
                        <FeatureRow key={feature.name} feature={feature} />
                      ))}
                    </div>

                    <Button
                      onClick={scrollToContact}
                      className={`w-full h-11 rounded-full text-[13px] font-medium ${
                        plan.popular
                          ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-none"
                          : "border-gray-200 text-gray-800 hover:bg-gray-50"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.isFree ? "Start Free" : "Get Premium"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <BenefitsPanel
              title="Why Choose DrStethos for Doctors?"
              items={doctorBenefits}
              note="*All prices are inclusive of taxes."
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Pricing;
