import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";
import { sendSupportContact } from "@/helpers/supportEmailHelper";

const SUPPORT_EMAIL = "support@drstethos.com";

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
      await sendSupportContact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you as soon as possible.",
      });

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error sending email:", error);

      toast({
        title: "Failed to Send Message",
        description: `Please try again or contact us directly at ${SUPPORT_EMAIL}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-y bg-secondary/50 overflow-x-hidden">
      <div className="page-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl">
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                Get in touch
              </h2>
              <p className="mt-3 text-sm md:text-[15px] text-muted-foreground font-normal leading-relaxed">
                Questions about hiring or jobs? We typically reply within one business day.
              </p>
            </div>

            <div className="space-y-5 text-sm">
              <div>
                <p className="font-medium text-foreground mb-0.5">Email</p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-muted-foreground hover:text-primary transition-colors font-normal"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">Phone</p>
                <a
                  href="tel:+917075355969"
                  className="text-muted-foreground hover:text-primary transition-colors font-normal"
                >
                  +91 70753 55969
                </a>
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">Business hours</p>
                <p className="text-muted-foreground font-normal">Monday – Friday, 9AM – 6PM IST</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-0.5">Office</p>
                <p className="text-muted-foreground leading-relaxed font-normal">
                  DRSTETHOS INNOVATIONS LLP, Bhimavaram, Andhra Pradesh, 534201
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-10 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="message" className="text-sm font-medium">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="resize-none text-sm rounded-lg"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-10 text-sm font-semibold rounded-lg"
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
    </section>
  );
};

export default Support;
