import { useState, useEffect } from "react";
import { Trash2, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CustomerProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .neq('role', 'admin')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Customer list could not be retrieved");
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const removeCustomer = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      toast.error("Could not delete customer: " + error.message);
    } else {
      setCustomers(customers.filter(c => c.id !== id));
      toast.success("Customer Profile deleted successfully");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Users className="text-primary" size={28} />
        <h1 className="font-display text-3xl text-gold-gradient">Registered Customers</h1>
      </div>

      <div className="border border-border rounded-sm overflow-hidden bg-card/30">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground uppercase tracking-widest text-xs">Loading Customers...</div>
        ) : (
          <div className="divide-y divide-border">
            {customers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                <Users size={40} className="mb-4 opacity-20" />
                <p>No customers have signed up yet.</p>
              </div>
            ) : (
              customers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-5 hover:bg-secondary/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{customer.email}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        Joined: {new Date(customer.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeCustomer(customer.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;