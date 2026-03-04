import { useState, useEffect } from "react";
import { Package, Tag, Users, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const AdminHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);

    const [productsRes, categoriesRes, usersRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true })
    ]);

    setStats({
      products: productsRes.count || 0,
      categories: categoriesRes.count || 0,
      users: usersRes.count || 0
    });
    
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Products", value: stats.products, icon: Package, color: "text-blue-500" },
    { title: "Categories", value: stats.categories, icon: Tag, color: "text-green-500" },
    { title: "Admin Users", value: stats.users, icon: Users, color: "text-purple-500" },
    { title: "Store Activity", value: "Active", icon: Activity, color: "text-gold-gradient" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-gold-gradient">Dashboard Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.title} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {s.title}
              </CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {loading ? "..." : s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Welcome Section */}
      <div className="mt-8 p-6 border border-border rounded-sm bg-secondary/10">
        <h2 className="text-xl font-display text-foreground mb-2">Welcome Back, Admin</h2>
        <p className="text-muted-foreground text-sm">
          Here's what's happening with your store today. You have {stats.products} products across {stats.categories} categories, and {stats.users} admin users managing the store. Keep up the great work! 
        </p>
      </div>
    </div>
  );
};

export default AdminHome;