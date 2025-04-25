import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { supabase } from "../../lib/supabase";
import { Button, Input } from "@rneui/themed";
import * as SecureStore from "expo-secure-store";

import { router } from "expo-router";

AppState.addEventListener("change", async (state) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (state === "active" && session) {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);

    const allowedDomains = ["vvk.lt", "kolegija.lt", "gmail.com"];
    const domain = email.split("@")[1];

    if (!allowedDomains.includes(domain)) {
      Alert.alert("Email domain not allowed. Use your school email.");
      setLoading(false);
      return;
    }

    // Step 1: Sign up the user
    const {
      data: { session, user },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    if (!user) {
      Alert.alert("Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    // Step 2: Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Step 3: Save code to DB
    await supabase.from("email_verification_codes").upsert({
      user_id: user.id,
      code,
    });

    // Step 4: Send code via Edge Function (FIXED URL & HEADERS)
    await fetch(
      "https://btezxwxovdtmoidhvemy.supabase.co/functions/v1/send-code",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            (
              await supabase.auth.getSession()
            ).data.session?.access_token
          }`,
        },
        body: JSON.stringify({ email: user.email, code }),
      }
    );

    // Step 5: Tell user to check email
    Alert.alert(
      "Almost done!",
      "Please check your email for a 6-digit verification code."
    );

    // Step 6: Sign out temporarily (until verification complete)
    await supabase.auth.signOut();

    setLoading(false);

    await SecureStore.setItemAsync("user_email_for_verification", email);

    // Navigate to VerifyCode screen or store email temporarily
    router.push("/verify-code");
  }
  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
