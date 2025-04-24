import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="users"
        options={{
          title: "Users",
          presentation: "modal", // Add this
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="channel"
        options={{
          headerShown: false,
          animation: "fade",
        }}
      />
    </Stack>
  );
}
