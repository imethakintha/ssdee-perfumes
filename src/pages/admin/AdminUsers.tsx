import { useState, useEffect } from "react";
import { UserPlus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AdminProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const AdminUsers = () => {
  const [email, setEmail] = useState("");
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin');

    if (error) {
      toast.error("Admin list could not be retrieved");
    } else {
      setAdmins(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const inviteAdmin = async () => {
    if (!email.trim()) return;
    setInviting(true);
    
    const { error } = await supabase.auth.admin.inviteUserByEmail(email);

    if (error) {
      toast.error("Invite could not be sent: " + error.message);
    } else {
      toast.success(email + " has been invited successfully!");
      setEmail("");
      fetchAdmins();
    }
    setInviting(false);
  };

  const removeAdmin = async (id: string) => {

    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      toast.error("Delete error");
    } else {
      setAdmins(admins.filter(a => a.id !== id));
      toast.success("Admin Profile deleted successfully");
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-gold-gradient mb-6">Admin Users</h1>

      {/* Invite Section */}
      <div className="max-w-md space-y-3 mb-8">
        <Label className="text-xs text-muted-foreground tracking-widest uppercase">Invite New Admin</Label>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email to invite..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-secondary border-border"
          />
          <Button 
            onClick={inviteAdmin} 
            disabled={inviting}
            className="bg-gold-gradient text-primary-foreground hover:opacity-90"
          >
            {inviting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground italic">* Enter the email address of the user you want to invite as an admin.</p>
      </div>

      {/* Admin List */}
      <div className="border border-border rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="divide-y divide-border">
            {admins.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">There are no admins yet.</div>
            ) : (
              admins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 hover:bg-secondary/20 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-foreground">{admin.email}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{admin.role}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeAdmin(admin.id)}
                    className="text-muted-foreground hover:text-destructive"
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

export default AdminUsers;