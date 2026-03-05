import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ForDoctors from "@/components/ForDoctors";
import ForHospitals from "@/components/ForHospitals";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import AppDownload from "@/components/AppDownload";
import Support from "@/components/Support";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <div id="home">
        <Hero />
      </div>
      <div id="about">
        <AboutUs />
      </div>

      <div id="how-it-works">
        <HowItWorks />
      </div>
      <ForDoctors />
      <ForHospitals />

      <div id="pricing">
        <Pricing />
      </div>
      <AppDownload />
      <Support />
      <Footer />
    </div>
  );
};

export default Index;
