import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase"; // Supabase සම්බන්ධතාවය
import { toast } from "sonner";

// ප්‍රශ්න මාලාව
const questions = [
  {
    question: "What's the occasion?",
    options: [
      { label: "Everyday Elegance", value: "everyday" },
      { label: "Date Night", value: "date" },
      { label: "Business & Power", value: "business" },
      { label: "Special Event", value: "event" },
    ],
  },
  {
    question: "Which scent family speaks to you?",
    options: [
      { label: "Woody & Earthy", value: "Woody" },
      { label: "Floral & Romantic", value: "Floral" },
      { label: "Oriental & Spicy", value: "Oriental" },
      { label: "Fresh & Citrus", value: "Fresh" },
    ],
  },
  {
    question: "How intense do you want it?",
    options: [
      { label: "Whisper — Subtle & Close", value: "light" },
      { label: "Statement — Room-filling", value: "strong" },
      { label: "Balanced — Just Right", value: "moderate" },
    ],
  },
];

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Database එකේ තියෙන ඔක්කොම Products කලින්ම Fetch කර ගැනීම
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) toast.error("දත්ත ලබාගැනීම අසාර්ථකයි");
      else setProducts(data || []);
    };
    fetchProducts();
  }, []);

  const selectAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = value;
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      generateRecommendations(newAnswers);
    }
  };

  // පිළිතුරු අනුව ගැලපෙන Perfumes තේරීමේ Logic එක
  const generateRecommendations = (finalAnswers: string[]) => {
    setLoading(true);
    const chosenFamily = finalAnswers[1]; // දෙවන ප්‍රශ්නය (Scent Family)

    // Category එක අනුව filter කිරීම
    let matches = products.filter(p => 
      p.category?.toLowerCase() === chosenFamily.toLowerCase()
    );

    // ගැලපෙන දේවල් නැතිනම්, සියලුම products වලින් හොඳම 2ක් පෙන්වීම
    if (matches.length === 0) {
      matches = products.slice(0, 2);
    }

    setRecommendations(matches.slice(0, 3)); // උපරිම 3ක් පෙන්වමු
    setTimeout(() => {
      setShowResults(true);
      setLoading(false);
    }, 800);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" className="text-center">
              <Loader2 className="animate-spin text-primary mx-auto mb-4" size={40} />
              <p className="text-muted-foreground">Finding your perfect match...</p>
            </motion.div>
          ) : !showResults ? (
            <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="text-center">
              {/* UI elements remain same as before */}
              <div className="flex gap-2 justify-center mb-10">
                {questions.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= step ? "w-10 bg-primary" : "w-6 bg-border"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground tracking-widest uppercase mb-3">Question {step + 1} of {questions.length}</p>
              <h2 className="font-display text-3xl md:text-4xl mb-10 text-foreground">{questions[step].question}</h2>
              <div className="grid gap-3">
                {questions[step].options.map((opt) => (
                  <button key={opt.value} onClick={() => selectAnswer(opt.value)} className={`w-full p-4 rounded-sm border text-left transition-all duration-300 ${answers[step] === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/40"}`}>
                    <span className="text-sm font-medium tracking-wide">{opt.label}</span>
                  </button>
                ))}
              </div>
              {step > 0 && <Button variant="ghost" className="mt-6 text-muted-foreground" onClick={() => setStep(step - 1)}><ArrowLeft size={16} className="mr-2" /> Back</Button>}
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <p className="text-primary tracking-[0.3em] uppercase text-xs mb-4">Your Matches</p>
              <h2 className="font-display text-3xl md:text-4xl mb-3 text-gold-gradient">We Found Your Scent</h2>
              <p className="text-muted-foreground mb-10 text-sm">Based on your preferences, we recommend:</p>

              <div className="grid gap-4 mb-8">
                {recommendations.map((r) => (
                  <div key={r.id} className="border border-border rounded-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-primary/40 transition-colors bg-card">
                    <div className="text-left">
                      <h3 className="font-display text-xl text-foreground">{r.name}</h3>
                      <p className="text-xs text-muted-foreground">{r.scent_notes}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-primary font-semibold text-lg">${r.price}</span>
                      <Button size="sm" className="bg-gold-gradient text-primary-foreground" onClick={() => {
                        const msg = encodeURIComponent(`Hi, I'm interested in "${r.name}" from SSDee (recommended by the quiz).`);
                        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
                      }}>
                        <MessageCircle size={14} className="mr-1" /> Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="text-muted-foreground" onClick={reset}><RotateCcw size={16} className="mr-2" /> Retake Quiz</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;