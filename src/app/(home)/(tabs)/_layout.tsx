import { Tabs } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import { useAuth } from "../../../providers/AuthProvider";

export default function TabsNavigator() {
  const { user } = useAuth();

  if (!user) {
    return null; // Or loading indicator
  }

  return (
    <Tabs screenOptions={{ tabBarHideOnKeyboard: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
          tabBarIcon: ({ size, color }) => (
            <Entypo name="chat" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => (
            <Entypo name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
