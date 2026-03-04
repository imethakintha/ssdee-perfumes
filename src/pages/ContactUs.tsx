import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;
    setLoading(true);

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      toast.success("Message sent successfully! We will get back to you soon.");
      formRef.current?.reset();
    })
    .catch((error) => {
      console.error("Email error:", error);
      toast.error("Failed to send message. Please try again or contact via WhatsApp.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi SSDee, I have an inquiry about your perfumes.`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 selection:bg-primary/30">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 text-center mb-16 relative">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gold-gradient mb-4 tracking-tight">
            Reach the Atelier
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-xl mx-auto font-light leading-relaxed">
            Have a question about our signature scents or an existing order? We are here to provide an impeccable experience.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* Contact Information (Left Side) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="p-8 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-border/50 h-full flex flex-col justify-center space-y-8">
              <h3 className="font-display text-2xl text-foreground mb-2">Direct Contact</h3>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Our Location</p>
                  <p className="text-sm font-light text-foreground">Panadura,<br/>Western Province,<br/>Sri Lanka</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Phone</p>
                  <p className="text-sm font-light text-foreground">{WHATSAPP_NUMBER}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-light text-foreground">{CONTACT_EMAIL}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border/40 mt-auto">
                <p className="text-xs text-muted-foreground font-light mb-4">Need an immediate response?</p>
                <Button onClick={openWhatsApp} className="w-full bg-[#25D366] hover:bg-[#1DA851] text-black tracking-widest uppercase text-xs py-6 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.2)]">
                  <MessageCircle size={18} className="mr-2" /> Chat on WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Contact Form (Right Side) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <form ref={formRef} onSubmit={handleSubmit} className="p-8 md:p-10 rounded-[2rem] bg-secondary/5 border border-border/30 space-y-6">
              <h3 className="font-display text-3xl text-gold-gradient mb-8">Send a Message</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
                  
                  <Input name="from_name" required placeholder="Enter Your Name" className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Email Address</label>
                  <Input name="from_email" required type="email" placeholder="Enter Your Email" className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Subject</label>
                
                <Input name="subject" required placeholder="Order Inquiry" className="bg-background/50 border-border/50 h-12 rounded-xl focus:border-primary/50" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Message</label>
                
                <Textarea name="message" required placeholder="How can we help you?" className="bg-background/50 border-border/50 min-h-[150px] rounded-xl focus:border-primary/50 resize-none" />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-gold-gradient text-primary-foreground hover:opacity-90 tracking-widest uppercase text-xs py-6 rounded-xl shadow-gold mt-4">
                {loading ? "Sending..." : <><Send size={16} className="mr-2" /> Send Message</>}
              </Button>
            </form>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default ContactUs;