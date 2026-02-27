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

  // Admin ලාගේ ලැයිස්තුව ලබා ගැනීම
  const fetchAdmins = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin');

    if (error) {
      toast.error("Admin ලැයිස්තුව ලබාගත නොහැකි විය");
    } else {
      setAdmins(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // අලුත් Admin කෙනෙක්ට Invite එකක් යැවීම (Email එකට link එකක් යයි)
  const inviteAdmin = async () => {
    if (!email.trim()) return;
    setInviting(true);
    
    // සටහන: Frontend එකෙන් සෘජුවම invite කිරීම සඳහා Supabase Admin Auth අවශ්‍ය වේ.
    // සරල ක්‍රමය ලෙස අපි email එකට confirmation එකක් යවන ලෙස සකසමු.
    const { error } = await supabase.auth.admin.inviteUserByEmail(email);

    if (error) {
      toast.error("Invite කිරීමට නොහැකි විය: " + error.message);
    } else {
      toast.success(email + " වෙත සාර්ථකව Invite එකක් යැවුවා!");
      setEmail("");
      fetchAdmins();
    }
    setInviting(false);
  };

  const removeAdmin = async (id: string) => {
    // සටහන: Auth user කෙනෙක්ව අයින් කිරීම Supabase dashboard එකෙන් කිරීම වඩාත් ආරක්ෂිතයි.
    // මෙතනදී අපි profile එක ඉවත් කරමු.
    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      toast.error("ඉවත් කිරීමට නොහැකි විය");
    } else {
      setAdmins(admins.filter(a => a.id !== id));
      toast.success("Admin Profile එක ඉවත් කළා");
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
            placeholder="admin@ssdee.com"
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
        <p className="text-[10px] text-muted-foreground italic">* Invite කරන email එකට login link එකක් ලැබෙනු ඇත.</p>
      </div>

      {/* Admin List */}
      <div className="border border-border rounded-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-muted-foreground">පූරණය වෙමින්...</div>
        ) : (
          <div className="divide-y divide-border">
            {admins.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">තවම Admin ලා කිසිවෙකු නැත.</div>
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