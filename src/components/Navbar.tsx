import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield, ShoppingCart, LogIn, LogOut, Plus, Minus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/quiz", label: "Scent Quiz" },
];

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();
  const { user, signInWithGoogle, signOut } = useAuth();
  const { items, removeFromCart, updateQuantity, total } = useCart();

  const checkoutWhatsApp = () => {
    if (items.length === 0) return;
    let text = "Hello SSDee, I would like to place an order:%0A%0A";
    items.forEach(item => {
      text += `🔹 *${item.name}* (x${item.quantity}) - Rs ${(item.price * item.quantity).toLocaleString()}%0A`;
    });
    text += `%0A*Total: Rs ${total.toLocaleString()}*%0A%0APlease confirm my order.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER || "+94714009568"}?text=${text}`, "_blank");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-border/40 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4 relative">

          {/* Logo Section */}
          <div className="flex-shrink-0 relative h-full flex items-center z-50">
            <Link to="/" className="flex items-center h-full transition-transform duration-300 hover:scale-110">
              <img src="/Logo.svg" alt="SSDee Logo" className="max-h-full w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 ml-32 lg:ml-40">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-300 ${location.pathname === link.to ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">
              <Shield size={16} />
            </Link>
          </div>

          {/* Right Side: Auth & Cart */}
          <div className="flex items-center gap-4 md:gap-6 ml-auto">

            {/* Login / User Profile */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center gap-3 group">
                  <img src={user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full border border-primary/30" />
                  <button onClick={signOut} className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 absolute right-24 bg-background px-3 py-2 rounded-lg border border-border">
                    <LogOut size={12} /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-[10px] tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <LogIn size={14} /> Login
                </Link>
              )}
            </div>

            {/* Cart Button */}
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-foreground hover:text-primary transition-colors">
              <ShoppingCart size={20} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center rounded-full transform translate-x-1 -translate-y-1">
                  {items.length}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden text-foreground p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-background border-b border-border overflow-hidden">
              <div className="flex flex-col p-4 gap-4">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary">
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border pt-4 mt-2">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full" />
                        <span className="text-xs text-foreground">{user.user_metadata.full_name}</span>
                      </div>
                      <button onClick={signOut} className="text-xs text-destructive flex items-center gap-1"><LogOut size={14} /> Logout</button>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-xs tracking-widest uppercase text-primary flex items-center gap-2">
                      <LogIn size={16} /> Login
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Cart Sidebar (Slide-over) */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border/50 shadow-2xl z-50 flex flex-col">

              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="font-display text-2xl text-gold-gradient flex items-center gap-3">
                  <ShoppingCart size={24} className="text-primary" /> Your Cart
                </h2>
                <button onClick={() => setCartOpen(false)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-secondary/50">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-80">
                    <ShoppingCart size={64} className="mb-6 opacity-50" />
                    {!user ? (
                      <>
                        <p className="tracking-[0.2em] uppercase text-xs mb-6 text-center leading-relaxed">
                          Please login to view<br />your cart
                        </p>
                        <Button asChild variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 rounded-xl px-6">
                          <Link to="/login" onClick={() => setCartOpen(false)}>
                            <LogIn size={16} className="mr-2" /> Login to Continue
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <p className="tracking-widest uppercase text-xs">Your cart is empty</p>
                    )}
                  </div>
                ) : (
                  items.map((item) => {
                    const nameParts = item.name.split(' - ');
                    const baseName = nameParts[0];
                    const sizePart = nameParts[1];

                    return (
                      <div key={item.id} className="flex gap-4 items-center bg-secondary/20 p-3 rounded-2xl border border-border/30">
                        <img src={item.image_url} alt={baseName} className="w-20 h-24 object-cover rounded-xl border border-border/50" />
                        <div className="flex-1">
                          
                          <h4 className="font-display text-lg text-foreground leading-tight mb-1 pr-6">{baseName}</h4>
                          
                          {sizePart && (
                            <div className="mb-2">
                              <span className="inline-block px-1.5 py-0.5 bg-primary/10 border border-primary/20 rounded text-[9px] uppercase tracking-widest text-primary">
                                {sizePart}
                              </span>
                            </div>
                          )}

                          <p className="text-primary font-bold text-sm mb-3">Rs {item.price.toLocaleString()}</p>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-border/50 rounded-lg overflow-hidden bg-background">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Minus size={14} /></button>
                              <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors ml-auto">
                              <Trash2 size={16} />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-border/50 bg-secondary/10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-muted-foreground uppercase tracking-widest text-xs">Total Amount</span>
                    <span className="font-display text-3xl text-foreground">Rs {total.toLocaleString()}</span>
                  </div>
                  <Button onClick={checkoutWhatsApp} className="w-full bg-gold-gradient text-primary-foreground hover:opacity-90 py-6 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.2)] text-xs tracking-[0.2em] uppercase font-bold">
                    Checkout via WhatsApp
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;