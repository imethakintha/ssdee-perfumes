import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  scent_notes: string;
  category: string;
  description: string;
}

const WHATSAPP_NUMBER = "+94714009568";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // දත්ත ලබාගැනීමේ function එක
  const fetchData = async () => {
    setLoading(true);
    try {
      // Products ලබාගැනීම
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Categories ලබාගැනීම
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('name');
      
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

  const orderWhatsApp = (name: string) => {
    const msg = encodeURIComponent(`Hi, I'm interested in ordering "${name}" from SSDee.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-3">Our Collection</h1>
          <p className="text-muted-foreground">Explore our curated selection of luxury fragrances</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs tracking-widest uppercase rounded-sm border transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search fragrances..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary mb-4" size={40} />
            <p className="text-muted-foreground">Loading perfume collection...</p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelectedProduct(product)}
                className="group cursor-pointer border border-border rounded-sm bg-card hover:border-primary/40 transition-all duration-500 overflow-hidden"
              >
                <div className="aspect-square bg-secondary/50 flex items-center justify-center overflow-hidden">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <span className="font-display text-3xl text-primary/20 group-hover:text-primary/40 transition-colors">
                      SSDee
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-foreground mb-1">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{product.scent_notes}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-semibold text-lg">Rs {product.price}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-primary hover:text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        orderWhatsApp(product.name);
                      }}
                    >
                      <MessageCircle size={16} className="mr-1" /> Order
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No fragrances found.</p>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="bg-card border-border max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl text-gold-gradient">{selectedProduct.name}</DialogTitle>
                <DialogDescription className="text-muted-foreground">{selectedProduct.scent_notes}</DialogDescription>
              </DialogHeader>
              <div className="aspect-video bg-secondary/50 rounded-sm flex items-center justify-center my-4 overflow-hidden">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display text-4xl text-primary/20">SSDee</span>
                )}
              </div>
              <p className="text-foreground/80 text-sm leading-relaxed">{selectedProduct.description}</p>
              <div className="flex items-center justify-between mt-6">
                <span className="text-primary font-bold text-2xl">Rs {selectedProduct.price}</span>
                <Button
                  className="bg-gold-gradient text-primary-foreground hover:opacity-90 tracking-widest uppercase text-xs"
                  onClick={() => orderWhatsApp(selectedProduct.name)}
                >
                  <MessageCircle size={16} className="mr-2" /> Order via WhatsApp
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;