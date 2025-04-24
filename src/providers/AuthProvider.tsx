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

type Profile = {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
};

type AuthContext = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  chatClient: StreamChat | null;
};

const AuthContext = createContext<AuthContext>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,
  chatClient: null,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<Omit<AuthContext, "chatClient">>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    isInitialized: false,
  });
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(
      process.env.EXPO_PUBLIC_STREAM_API_KEY || ""
    );
    setChatClient(client);

    const getSession = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user?.email_confirmed_at) {
          setState((prev) => ({ ...prev, session, user: session.user }));
        }
      } catch (error) {
        console.error("Session error:", error);
      } finally {
        setState((prev) => ({
          ...prev,
          isInitialized: true,
          user: null,
          session: null,
          profile: null,
          isLoading: false,
        }));
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        if (session?.user?.email_confirmed_at) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setState({
            session,
            user: session.user,
            profile: profile || null,
            isLoading: false,
            isInitialized: true,
          });
        } else {
          setState({
            session: null,
            user: null,
            profile: null,
            isLoading: false,
            isInitialized: true,
          });
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isInitialized: true,
        }));
      }
    });

    return () => {
      subscription.unsubscribe();
      client.disconnectUser();
    };
  }, []);

  useEffect(() => {
    if (!state.user) return;

    const getProfile = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", state.user.id)
          .single();

        if (!error) {
          setState((prev) => ({ ...prev, profile: data }));
        }
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    getProfile();
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, chatClient }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
