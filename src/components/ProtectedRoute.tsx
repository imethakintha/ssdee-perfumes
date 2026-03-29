import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ProtectedRoute = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          const adminEmailsString = import.meta.env.VITE_ADMIN_EMAILS || "admin@ssdee.com";
          const allowedAdmins = adminEmailsString.split(',').map((e: string) => e.trim().toLowerCase());

          const userEmail = session.user.email?.toLowerCase() || "";

          if (allowedAdmins.includes(userEmail)) {
            setIsAdmin(true); 
          } else {
            setIsAdmin(false); 
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (_event === 'INITIAL_SESSION' || _event === 'SIGNED_IN' || _event === 'SIGNED_OUT') {
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary tracking-widest text-sm uppercase">Verifying Access...</div>;

  if (!session) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    toast.error("Access Denied: You do not have admin privileges.");
    return <Navigate to="/" replace />; 
  }

  return <Outlet />; 
};

export default ProtectedRoute;