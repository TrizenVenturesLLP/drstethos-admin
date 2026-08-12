import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Clock, MapPin, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // EmailJS Configuration from environment variables
      // See EMAILJS_SETUP.md for setup instructions
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Check if environment variables are configured
      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS credentials not configured. Please check .env file.");
      }

      // Template parameters
      const templateParams = {
        from_name: name,
        from_email: email,
        to_email: "stethosabisha@gmail.com",
        message: message,
      };

      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      // Success notification
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      // Clear form fields
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending email:", error);
      
      // Error notification
      toast({
        title: "Failed to Send Message",
        description: "Please try again or contact us directly at stethosabisha@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-y bg-gradient-to-br from-gray-50 to-blue-50/60 overflow-x-hidden">
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-[2.15rem] font-semibold text-gray-900 mb-3 tracking-tight">
            Get in Touch
          </h2>
          <p className="text-sm md:text-[15px] text-gray-500 font-normal">
            Have questions? Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                Support Information
              </h3>
              <p className="text-gray-500 text-sm font-normal">
                Reach out to us and we'll get back to you shortly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Email Us</h4>
                  <p className="text-sm text-gray-500 font-normal">stethosabisha@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Call Us</h4>
                  <p className="text-sm text-gray-500 font-normal">+91 70753 55969</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Business Hours</h4>
                  <p className="text-sm text-gray-500 font-normal">Monday - Friday: 9AM - 6PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4 text-orange-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-0.5">Office Location</h4>
                  <p className="text-sm text-gray-500 leading-relaxed font-normal">
                    DRSTETHOS INNOVATIONS LLP, H NO 7-7-14, GARUVU VEEDI, WARD NO-12, ADJ, Bhimavaram, West Godavari, Andhra Pradesh, 534201
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 lg:p-8 border border-gray-100 w-full min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 tracking-tight">Send a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={5}
                  className="resize-none text-sm"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-10 text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
