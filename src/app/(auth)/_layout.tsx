import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{
          title: "Login",
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="verify-code"
        options={{
          title: "Verify Code",
          animation: "fade",
        }}
      />
    </Stack>
  );
}
