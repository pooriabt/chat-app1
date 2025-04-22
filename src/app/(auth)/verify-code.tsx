import { useState, useEffect } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function VerifyCodeScreen() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  // Step 1: Load email on screen mount
  useEffect(() => {
    const loadEmail = async () => {
      const savedEmail = await SecureStore.getItemAsync(
        "user_email_for_verification"
      );
      if (savedEmail) {
        setEmail(savedEmail);
      } else {
        Alert.alert("No email found", "Please try signing up again.");
        router.replace("/(auth)/login");
      }
    };

    loadEmail();
  }, []);

  // Step 2: Handle verification
  async function verifyCode() {
    const { data, error } = await supabase
      .from("email_verification_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !data) {
      Alert.alert(
        "Invalid code",
        "Please enter the correct verification code."
      );
      return;
    }

    // Optional: Delete code from DB
    await supabase
      .from("email_verification_codes")
      .delete()
      .eq("user_id", data.user_id);

    // Optional: Clear stored email
    await SecureStore.deleteItemAsync("user_email_for_verification");

    Alert.alert(
      "Verified!",
      "Your email has been verified. Please log in now."
    );
    router.replace("/(auth)/login");
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter the 6-digit code sent to your email:</Text>
      <TextInput
        placeholder="Enter code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Verify Code" onPress={verifyCode} />
    </View>
  );
}
