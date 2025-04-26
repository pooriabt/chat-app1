import { useAuth } from "../../providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { user, isEmailConfirmed } = useAuth();

  if (user && isEmailConfirmed) {
    return <Redirect href="/(home)" />;
  }

  return <Stack />;
}
