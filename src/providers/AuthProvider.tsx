import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { StreamChat } from "stream-chat";

type AuthContext = {
  session: Session | null;
  user: User | null;
  profile: any;
};

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  profile: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) {
        setSession(session);
      } else {
        setSession(null); // Prevent partial session
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email_confirmed_at) {
        setSession(session);
      } else {
        setSession(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }
    const fetchProfile = async () => {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
    };
    fetchProfile();
  }, [session?.user]);

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
