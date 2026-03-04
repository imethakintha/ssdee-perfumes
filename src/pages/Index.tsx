import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wind, Droplets, PlayCircle, Facebook, Youtube, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Sparkles, title: "Premium Ingredients", desc: "Sourced from the world's rarest and finest perfumeries to craft sheer perfection." },
  { icon: Wind, title: "Signature Scents", desc: "Curated artisan blends that boldly define your presence in any room." },
  { icon: Droplets, title: "Long Lasting", desc: "High-concentration formulas designed to captivate from dawn to deep dusk." },
];

const perfumeSamples = [
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300&h=400",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=300&h=400",
  "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=300&h=400",
  "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=300&h=400",
  "https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBlcmZ1bWV8ZW58MHx8MHx8fDA%3D?auto=format&fit=crop&q=80&w=300&h=400",
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 pt-20 md:pt-24">

      <section className="relative h-[calc(100dvh-10rem)] md:h-[calc(100dvh-12rem)] flex items-center justify-center overflow-hidden mx-2 md:mx-6 mb-4 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-2xl">
        
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="object-cover w-full h-full opacity-70 mix-blend-screen scale-105"
          >
            <source src="https://res.cloudinary.com/dzfv2xis8/video/upload/v1772577516/hero-bg1_ibwolx.mp4" type="video/mp4" />
          </video>
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-70" />
        </div>
        
        {/* Text Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-background/30 backdrop-blur-md text-[10px] md:text-xs tracking-[0.4em] uppercase text-primary mb-8 shadow-[0_0_30px_rgba(212,175,55,0.15)]">
              <Sparkles size={14} /> Luxury Fragrance House
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl lg:text-9xl font-bold leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
              <span className="text-gold-gradient inline-block hover:scale-105 transition-transform duration-700">BOOST YOUR</span>
              <br />
              <span className="text-foreground relative">
                DEMAND
                <span className="absolute -bottom-2 md:-bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
              </span>
            </h1>
            
            <p className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed backdrop-blur-sm bg-background/10 p-4 rounded-2xl">
              Discover exquisite fragrances that command attention and leave an unforgettable impression. Wear your invisible crown.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <Button asChild size="lg" className="w-full sm:w-auto bg-gold-gradient text-primary-foreground hover:scale-105 transition-all duration-300 tracking-[0.2em] uppercase text-xs px-10 md:px-12 py-7 shadow-[0_0_40px_rgba(212,175,55,0.3)] border border-primary/50">
              <Link to="/shop">
                Explore Collection <ArrowRight size={18} className="ml-3" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-primary/30 text-primary hover:text-white hover:bg-primary/20 hover:border-primary transition-all duration-300 tracking-[0.2em] uppercase text-xs px-10 md:px-12 py-7 backdrop-blur-md bg-background/20">
              <Link to="/quiz">
                <PlayCircle size={18} className="mr-3" /> Find Your Scent
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="flex flex-col items-center gap-3 w-full pb-8 pt-4 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-primary/60 font-medium">Scroll to Discover</span>
        <div className="w-[1px] h-12 md:h-16 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>

      {/* 2. Scrolling Perfume Samples (Infinite Marquee) */}
      <section className="py-20 border-y border-border/30 bg-secondary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--background))_0%,transparent_10%,transparent_90%,hsl(var(--background))_100%)] z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4 mb-10 text-center relative z-20">
          <h2 className="text-xs tracking-[0.4em] uppercase text-muted-foreground font-medium">The SSDee Signature Line</h2>
        </div>

        <div className="flex w-[200%] md:w-[150%] lg:w-[120%]">
          <motion.div 
            className="flex gap-10 md:gap-20 px-5 md:px-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
          >

            {[...perfumeSamples, ...perfumeSamples].map((src, index) => (
              <div key={index} className="w-32 md:w-48 aspect-[3/4] relative group cursor-pointer shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <img 
                  src={src} 
                  alt={`Perfume sample ${index}`} 
                  className="w-full h-full object-cover rounded-2xl border border-white/5 mix-blend-luminosity hover:mix-blend-normal hover:scale-110 transition-all duration-700 shadow-2xl"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Premium Features Cards */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.05),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                className="group relative p-8 md:p-10 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/50 hover:border-primary/40 hover:bg-card/80 transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Glow Effect behind the card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="w-20 h-20 mb-8 rounded-2xl bg-secondary/50 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 group-hover:border-primary/60 transition-all duration-500 shadow-lg relative z-10">
                  <f.icon size={32} className="text-primary" />
                </div>
                <h3 className="font-display text-2xl md:text-3xl mb-4 text-foreground tracking-wide relative z-10">{f.title}</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light relative z-10">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Luxury CTA Section */}
      <section className="py-32 relative overflow-hidden border-t border-border/30">
        <div className="absolute inset-0 bg-secondary/10" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto p-10 md:p-20 rounded-[3rem] border border-primary/20 bg-background/60 backdrop-blur-2xl text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            <Sparkles className="mx-auto text-primary mb-8" size={40} />
            <h2 className="font-display text-4xl md:text-6xl mb-6 text-gold-gradient leading-tight">Discover Your Signature</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
              Answer a few questions and let our master perfumers find the exact scent that resonates with your unique aura.
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto bg-gold-gradient text-primary-foreground hover:scale-105 transition-transform duration-300 tracking-[0.2em] uppercase text-xs px-12 py-7 shadow-gold rounded-full">
              <Link to="/quiz">Begin The Journey <ArrowRight size={18} className="ml-3" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-border/30 pt-20 pb-10 bg-secondary/5 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-16">
            
            {/* Column 1: Brand Info */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Link to="/" className="mb-6 transition-transform duration-500 hover:scale-105 drop-shadow-lg">
                <img 
                  src="/Logo.svg" 
                  alt="SSDee Logo" 
                  className="h-16 md:h-20 w-auto object-contain" 
                />
              </Link>
              <p className="text-muted-foreground text-sm font-light mb-6 max-w-xs leading-relaxed">
                Crafting unforgettable luxury fragrances that define your prestige and elevate your aura.
              </p>
              <a href="https://ssdee.lk" className="text-primary font-medium tracking-[0.2em] text-xs uppercase hover:underline underline-offset-8 transition-all">
                www.ssdee.lk
              </a>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-foreground font-display text-xl tracking-wide mb-6 text-gold-gradient">Explore</h4>
              <div className="flex flex-col gap-4 text-center md:text-left">
                <Link to="/shop" className="text-muted-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">Shop Collection</Link>
                <Link to="/quiz" className="text-muted-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">Scent Quiz</Link>
                <Link to="/about" className="text-muted-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">About Us</Link>
                <Link to="/contact" className="text-muted-foreground text-xs tracking-[0.2em] uppercase hover:text-primary transition-colors">Contact Us</Link>
              </div>
            </div>

            {/* Column 3: Connect & Location */}
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-foreground font-display text-xl tracking-wide mb-6 text-gold-gradient">Connect</h4>
              
              {/* Social Media Icons */}
              <div className="flex items-center gap-4 mb-8">
                <a href="#" className="w-10 h-10 rounded-full border border-border/50 bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-border/50 bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1">
                  <Youtube size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-border/50 bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 hover:-translate-y-1">
                  {/* Custom TikTok SVG Icon */}
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.63 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-muted-foreground text-sm font-light px-4 py-2 rounded-full border border-border/30 bg-background/50 backdrop-blur-sm">
                <MapPin size={16} className="text-primary" />
                <span className="tracking-widest uppercase text-[10px]">Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase text-center md:text-left">
              © {new Date().getFullYear()} SSDee. All rights reserved.
            </p>
            <div className="flex gap-6 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;