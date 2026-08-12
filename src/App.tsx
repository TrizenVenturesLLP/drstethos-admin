import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DeleteAccount from "./pages/DeleteAccount";
import TermsForHospitals from "./pages/TermsForHospitals";
import TermsForDoctors from "./pages/TermsForDoctors";
import SafetyStandards from "./pages/SafetyStandards";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminHome from "./pages/AdminHome";
import AdminVerify from "./pages/AdminVerify";
import AdminUsers from "./pages/AdminUsers";
import AdminIncompleteDocuments from "./pages/AdminIncompleteDocuments";
import HospitalProfile from "./pages/HospitalProfile";
import DoctorProfile from "./pages/DoctorProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <ScrollToTop/>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/privacy-policy/delete-account" element={<DeleteAccount />} />
          <Route path="/termsandservices/forhospitals" element={<TermsForHospitals />} />
          <Route path="/termsandservices/fordoctors" element={<TermsForDoctors />} />
          {/* <Route path="/safety-standards" element={<SafetyStandards />} /> */}

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="home" element={<AdminHome />} />
            <Route path="verify" element={<AdminVerify />} />
            <Route path="incomplete-documents" element={<AdminIncompleteDocuments />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="hospital/:profileId" element={<HospitalProfile />} />
            <Route path="doctor/:profileId" element={<DoctorProfile />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
