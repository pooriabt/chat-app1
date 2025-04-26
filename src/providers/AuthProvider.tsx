import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type AuthContext = {
  session: Session | null;
  user: User | null;
  profile: any;
  isEmailConfirmed: boolean;
};

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  profile: null,
  isEmailConfirmed: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState();
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.log("No session or error getting session:", error?.message);
        setSession(null);
        setIsEmailConfirmed(false);
        return;
      }

      const confirmed = data.session.user.email_confirmed_at !== null;

      setSession(confirmed ? data.session : null);
      setIsEmailConfirmed(confirmed);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const confirmed = session?.user?.email_confirmed_at !== null;
        setSession(confirmed ? session : null);
        setIsEmailConfirmed(confirmed);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.log("Error fetching profile:", error.message);
      }

      setProfile(data);
    };

    fetchProfile();
  }, [session?.user]);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isEmailConfirmed,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
