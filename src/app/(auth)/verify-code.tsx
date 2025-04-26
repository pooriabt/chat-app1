import { useState, useEffect } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function VerifyCodeScreen() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

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

  async function verifyCode() {
    if (!email || !code) {
      Alert.alert("Error", "Missing email or code.");
      return;
    }

    const { data, error } = await supabase
      .from("email_verification_codes")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error || !data) {
      Alert.alert("Invalid code", "Please enter the correct 6-digit code.");
      return;
    }

    if (data.user_email !== email) {
      Alert.alert(
        "Wrong email",
        "This code does not match your email address."
      );
      return;
    }

    await supabase
      .from("email_verification_codes")
      .delete()
      .eq("user_id", data.user_id);
    await SecureStore.deleteItemAsync("user_email_for_verification");

    Alert.alert("Verified!", "You can now login.");
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

      <View style={{ marginTop: 0 }}>
        <Button
          title="Back to Login"
          color="gray"
          onPress={() => router.replace("/(auth)/login")}
        />
      </View>
    </View>
  );
}
