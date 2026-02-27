import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const ProtectedRoute = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // දැනට තියෙන session එක check කිරීම
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Session එක වෙනස් වෙනවද කියලා බැලීම
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">පරීක්ෂා කරමින්...</div>;

  // Session එකක් නැතිනම් Login page එකට යවන්න
  if (!session) return <Navigate to="/admin/login" replace />;

  return <Outlet />; // Session එක තියේ නම් ඇතුළට යන්න දෙන්න
};

export default ProtectedRoute;