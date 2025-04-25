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

const chatClient = StreamChat.getInstance("26ekgfktnc6t");

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
    if (session?.user?.email_confirmed_at) {
      const connectStream = async () => {
        const chatClient = StreamChat.getInstance("26ekgfktnc6t");

        const response = await fetch(
          "https://btezxwxovdtmoidhvemy.supabase.co/functions/v1/stream-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ user_id: session.user.id }),
          }
        );

        const result = await response.json();
        console.log("Stream token:", result);

        await chatClient.connectUser(
          {
            id: session.user.id,
            name: session.user.email,
          },
          result.token
        );

        console.log("Stream Chat connected in AuthProvider");
      };

      connectStream();
    }
  }, [session]);

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
