import { Stack } from "expo-router";

export default function CallLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="CallScreen"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
