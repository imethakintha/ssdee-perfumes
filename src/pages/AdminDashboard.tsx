import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Package, Tag, Users, LayoutDashboard, LogOut, Menu, Home, ShoppingBag } from "lucide-react"; // Home සහ ShoppingBag අයිකන එක් කළා
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase"; //
import { toast } from "sonner"; //
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"; //

const sidebarLinks = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/users", label: "Admin Users", icon: Users },
];

// පාරිභෝගිකයන්ට පෙනෙන පිටු සඳහා ලින්ක්ස්
const publicLinks = [
  { to: "/", label: "Home Page", icon: Home },
  { to: "/shop", label: "Shop Page", icon: ShoppingBag },
];

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast.error("Logout Error: " + error.message);
    else {
      toast.success("සාර්ථකව Logout වුණා!");
      navigate("/admin/login");
    }
  };

  const NavLinks = () => (
    <div className="flex flex-col gap-1 mt-4">
      {/* Management Section */}
      <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-2 mt-4">Management</p>
      {sidebarLinks.map((link) => {
        const active = link.exact
          ? location.pathname === link.to
          : location.pathname.startsWith(link.to);
        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
          >
            <link.icon size={18} />
            {link.label}
          </Link>
        );
      })}

      {/* Storefront Section - මෙන්න අලුතින් එක් කළ කොටස */}
      <p className="px-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-2 mt-6">Storefront</p>
      {publicLinks.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <link.icon size={18} />
          {link.label}
        </Link>
      ))}

      <div className="mt-8 pt-4 border-t border-border/50">
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive p-3">
          <LogOut size={18} className="mr-3" /> Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <span className="font-display text-xl text-gold-gradient font-bold">SSDee Admin</span>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-card border-r border-border w-64">
            <SheetHeader className="text-left border-b border-border/50 pb-4">
              <SheetTitle className="font-display text-gold-gradient">Admin Menu</SheetTitle>
            </SheetHeader>
            <NavLinks />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-56 border-r border-border flex-col p-4 gap-1 fixed top-16 bottom-0 bg-card">
          <NavLinks />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-56 p-4 md:p-8 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;