import { motion } from "framer-motion";
import { Sparkles, Droplets, Leaf, Award } from "lucide-react";

const AboutUs = () => {
  const values = [
    { icon: Droplets, title: "Pure Extracts", desc: "We use only the highest concentration of premium essential oils." },
    { icon: Leaf, title: "Ethical Sourcing", desc: "Our ingredients are sustainably harvested from around the globe." },
    { icon: Award, title: "Master Craftsmanship", desc: "Every bottle is a masterpiece, blended to absolute perfection." },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 selection:bg-primary/30">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 text-center mb-24 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-background/50 backdrop-blur-md text-[10px] tracking-[0.4em] uppercase text-primary mb-6">
            <Sparkles size={14} /> The Story of SSDee
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gold-gradient mb-6 tracking-tight">
            Crafting the <br className="hidden md:block" /> Invisible Crown
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Born from a passion for timeless elegance, SSDee is more than a fragrance house. We are architects of memory, creating scents that linger long after you've left the room.
          </p>
        </motion.div>
      </section>

      {/* Brand Story Image & Text */}
      <section className="container mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700" />
            <img 
              src="https://images.unsplash.com/photo-1608528577891-eb055944f2e7?auto=format&fit=crop&q=80&w=800" 
              alt="Perfume making process" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="font-display text-3xl md:text-5xl text-foreground">A Symphony of <span className="text-gold-gradient">Senses</span></h2>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              At SSDee, we believe that a perfume is the most intimate accessory. It is an unseen garment that drapes over your skin, whispering your story to the world without uttering a single word.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
              Sourced from the finest ingredients globally and blended with meticulous precision in Sri Lanka, our artisan perfumes are designed to boost your demand and elevate your presence.
            </p>
            
            {/* Signature */}
            <div className="pt-6 border-t border-border/40 mt-8">
              <p className="font-display text-2xl text-primary/80 signature-font">SSDee Founder</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mt-2">Master Perfumer</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4">
        <h3 className="text-center font-display text-3xl md:text-4xl text-gold-gradient mb-12">The SSDee Standard</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((val, i) => (
            <motion.div 
              key={val.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
              className="p-8 rounded-2xl bg-card/40 backdrop-blur-lg border border-border/50 hover:border-primary/40 transition-colors text-center group"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary/50 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/50 transition-all">
                <val.icon size={24} className="text-primary" />
              </div>
              <h4 className="font-display text-xl mb-3">{val.title}</h4>
              <p className="text-sm text-muted-foreground font-light">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;