import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import AboutUs from "@/components/AboutUs";
import HowItWorks from "@/components/HowItWorks";
import ChoosePath from "@/components/ChoosePath";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import AppDownload from "@/components/AppDownload";
import Support from "@/components/Support";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="landing-theme relative w-full max-w-[100vw] min-h-screen overflow-x-hidden bg-background">
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
      <ChoosePath />
      <div id="pricing">
        <Pricing />
      </div>
      <FAQ />
      <AppDownload />
      <div id="get-in-touch">
        <Support />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
