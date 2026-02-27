import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Wind, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Sparkles, title: "Premium Ingredients", desc: "Sourced from the world's finest perfumeries" },
  { icon: Wind, title: "Signature Scents", desc: "Curated blends that define your presence" },
  { icon: Droplets, title: "Long Lasting", desc: "Formulated to captivate from dawn to dusk" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <p className="text-primary/70 tracking-[0.4em] uppercase text-xs mb-6 font-medium">
              Luxury Fragrance House
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
              <span className="text-gold-gradient">BOOST YOUR</span>
              <br />
              <span className="text-foreground">DEMAND</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 font-light">
              Discover exquisite fragrances that command attention and leave an unforgettable impression.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button asChild size="lg" className="bg-gold-gradient text-primary-foreground hover:opacity-90 tracking-widest uppercase text-xs px-10 py-6 shadow-gold">
              <Link to="/shop">
                Explore Collection <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary/30 text-primary hover:bg-primary/10 tracking-widest uppercase text-xs px-10 py-6">
              <Link to="/quiz">Find Your Scent</Link>
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors duration-500">
                  <f.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-display text-xl mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl mb-4 text-gold-gradient">Discover Your Signature</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Take our interactive quiz and find the perfect fragrance for your unique personality.
            </p>
            <Button asChild size="lg" className="bg-gold-gradient text-primary-foreground hover:opacity-90 tracking-widest uppercase text-xs px-10 py-6 shadow-gold">
              <Link to="/quiz">Take The Quiz <ArrowRight size={16} className="ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg text-gold-gradient font-bold">SSDee</span>
          <p className="text-muted-foreground text-xs tracking-widest">
            © {new Date().getFullYear()} SSDee. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
