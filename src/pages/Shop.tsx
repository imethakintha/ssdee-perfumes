import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Search, Loader2, ShoppingBag, Eye, Wind, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  scent_notes: string;
  category: string;
  description: string;
}

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Cart Context එක ලබා ගැනීම
  const { addToCart } = useCart();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: productsData, error: productsError } = await supabase.from('products').select('*');
      if (productsError) throw productsError;
      setProducts(productsData || []);

      const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('name');
      if (categoriesError) throw categoriesError;

      const categoryNames = categoriesData?.map(c => c.name) || [];
      setCategories(["All", ...categoryNames]);

    } catch (error: any) {
      toast.error("There was a problem loading the data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // තනි භාණ්ඩයක් සඳහා WhatsApp Order කිරීම
  const orderWhatsApp = (name: string) => {
    const msg = encodeURIComponent(`Hi, I'm interested in ordering "${name}" from SSDee.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER || "+94714009568"}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen pt-24 bg-background selection:bg-primary/30 pb-20">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 md:mb-16">
          <p className="text-primary/70 tracking-[0.4em] uppercase text-[10px] md:text-xs mb-4 font-medium">The Signature Line</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-gold-gradient mb-4">Our Collection</h1>
          <p className="text-muted-foreground font-light max-w-lg mx-auto text-sm md:text-base">
            Explore our curated selection of high-end luxury fragrances, designed to elevate your presence.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-12 p-2 md:p-4 rounded-3xl bg-secondary/5 backdrop-blur-md border border-border/40">
          <div className="flex gap-2 md:gap-3 flex-wrap justify-center w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-500 rounded-full overflow-hidden group ${activeCategory === cat ? "text-primary-foreground" : "text-muted-foreground hover:text-primary"
                  }`}
              >
                {activeCategory === cat && (
                  <motion.div layoutId="activeCat" className="absolute inset-0 bg-primary" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search scents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-background/50 border-border/60 rounded-full focus:ring-primary/30 placeholder:text-muted-foreground/50 transition-all text-xs md:text-sm"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32">
              <Loader2 className="animate-spin text-primary mb-6" size={40} />
              <p className="text-muted-foreground tracking-[0.2em] uppercase text-xs font-light">Curating Perfection...</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  onClick={() => setSelectedProduct(product)}
                  className="group relative flex flex-col bg-card/20 backdrop-blur-sm border border-border/40 rounded-2xl md:rounded-[2rem] overflow-hidden hover:border-primary/40 hover:bg-card/40 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-[0_10px_40px_rgba(212,175,55,0.08)]"
                >
                  <div className="aspect-[4/5] bg-secondary/30 relative overflow-hidden flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <span className="font-display text-2xl md:text-4xl text-primary/10 tracking-widest uppercase">SSDee</span>
                    )}

                    <div className="hidden md:flex absolute inset-0 z-20 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="p-3 bg-background/50 backdrop-blur-md rounded-full border border-white/10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Eye className="text-primary" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-6 flex flex-col flex-1">
                    <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-primary/80 font-semibold mb-1 md:mb-2">{product.category}</p>
                    <h3 className="font-display text-sm md:text-xl text-foreground mb-1 group-hover:text-primary transition-colors truncate">{product.name}</h3>
                    <p className="text-[9px] md:text-xs text-muted-foreground mb-3 line-clamp-2 font-light h-7 md:h-8 leading-relaxed">{product.scent_notes}</p>

                    <div className="mt-auto pt-3 border-t border-border/30 flex items-center justify-between">
                      <span className="text-foreground font-semibold text-xs md:text-lg">Rs {product.price.toLocaleString()}</span>

                      {/* මෙතන තියෙන්නේ පිටත පේන "Add to Cart" Button එක පමණයි */}
                      <Button
                        size="sm"
                        className="h-7 md:h-10 px-2 md:px-4 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300 rounded-lg md:rounded-xl group/btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        <ShoppingCart size={14} className="md:mr-2" />
                        <span className="hidden md:inline tracking-widest uppercase text-[10px] font-medium">Add to Cart</span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <ShoppingBag size={48} className="mx-auto text-muted-foreground/20 mb-6" />
            <p className="text-muted-foreground font-light tracking-widest text-sm">No fragrances match your criteria.</p>
          </motion.div>
        )}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 w-[95vw] max-w-4xl p-0 overflow-hidden rounded-3xl md:rounded-[2rem] shadow-2xl">
          {selectedProduct && (
            <div className="flex flex-col md:grid md:grid-cols-2 max-h-[85vh] md:max-h-[600px] overflow-y-auto no-scrollbar">

              <div className="h-64 md:h-auto bg-secondary/20 relative overflow-hidden p-6 md:p-10 flex items-center justify-center shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.1)_0%,transparent_70%)]" />
                {selectedProduct.image_url ? (
                  <img
                    src={selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain md:object-cover rounded-xl md:rounded-2xl drop-shadow-2xl relative z-10"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-4xl text-primary/10">SSDee</div>
                )}
              </div>

              <div className="p-6 md:p-12 flex flex-col justify-center">
                <DialogHeader className="mb-4 md:mb-6 text-left">
                  <p className="text-[10px] text-primary uppercase tracking-[0.4em] font-bold mb-2">{selectedProduct.category}</p>
                  <DialogTitle className="font-display text-2xl md:text-5xl text-gold-gradient mb-2 md:mb-4 leading-tight">
                    {selectedProduct.name}
                  </DialogTitle>
                  <div className="h-px w-12 md:w-16 bg-primary/40 mb-4 md:mb-6" />
                  <DialogDescription className="text-foreground/90 font-medium text-xs md:text-sm flex items-start md:items-center gap-2 leading-relaxed text-left">
                    <Wind size={16} className="text-primary shrink-0 mt-0.5 md:mt-0" /> {selectedProduct.scent_notes}
                  </DialogDescription>
                </DialogHeader>

                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-6 md:mb-10 font-light text-left">
                  {selectedProduct.description}
                </p>

                <div className="flex flex-col mt-auto pt-4 md:pt-6 border-t border-border/30">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Price</span>
                    <span className="text-foreground font-bold text-xl md:text-3xl">Rs {selectedProduct.price.toLocaleString()}</span>
                  </div>

                  {/* Modal එක ඇතුළත Buttons දෙක (Add to Cart සහ Order via WhatsApp) */}
                  <div className="flex items-center gap-2 md:gap-3 w-full overflow-hidden">

                    {/* Add to Cart Button */}
                    <Button
                      variant="outline"
                      // w-12 h-12 මගින් Phone එකේදී මේක නියම සමචතුරස්‍රයක් බවට පත් කරයි
                      className="w-12 h-12 md:w-auto md:h-14 flex-shrink-0 border-primary/30 text-primary hover:bg-primary/10 rounded-xl md:rounded-2xl p-0 md:px-6"
                      onClick={() => {
                        addToCart(selectedProduct);
                      }}
                    >
                      <ShoppingCart size={20} className="md:mr-2" />
                      <span className="hidden md:inline tracking-[0.2em] uppercase text-[10px] font-bold">Add to Cart</span>
                    </Button>

                    {/* Order via WhatsApp Button */}
                    <Button
                      // flex-1 මගින් ඉතුරු ඉඩ සම්පූර්ණයෙන්ම ගනී
                      className="flex-1 h-12 md:h-14 bg-gold-gradient text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl md:rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.2)] px-2 md:px-6 min-w-0"
                      onClick={() => orderWhatsApp(selectedProduct.name)}
                    >
                      <MessageCircle size={18} className="mr-1.5 md:mr-3 shrink-0" />
                      {/* truncate මගින් අකුරු එලියට පැනීම සම්පූර්ණයෙන්ම නතර කරයි */}
                      <span className="tracking-widest md:tracking-[0.2em] uppercase text-[9px] min-[375px]:text-[10px] md:text-xs font-bold truncate">
                        Order via WhatsApp
                      </span>
                    </Button>

                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;