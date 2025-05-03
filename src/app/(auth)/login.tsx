import React, { useState } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { supabase } from "../../lib/supabase";
import { Button, Input } from "@rneui/themed";

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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (signInError) {
      Alert.alert(signInError.message);
      setLoading(false);
      return;
    }

    // 🔥 Re-fetch session fully
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      Alert.alert("Failed to refresh session. Please try again.");
      setLoading(false);
      return;
    }

    const { user } = sessionData.session;

    if (!user?.email_confirmed_at) {
      await supabase.auth.signOut();
      Alert.alert(
        "Email not verified",
        "Please confirm your email before logging in."
      );
      return;
    }

    // if (!user?.email_confirmed_at) {
    //   await supabase.auth.signOut();
    //   Alert.alert(
    //     "Email not verified",
    //     "Please check your inbox and confirm your email before logging in."
    //   );
    //   setLoading(false);
    //   return;
    // }

    // // 🔥🔥 Now check if 6-digit code verification is done
    // const { data: codeData, error: codeError } = await supabase
    //   .from("email_verification_codes")
    //   .select("*")
    //   .eq("user_email", user.email)
    //   .maybeSingle();

    // if (codeError) {
    //   console.error("Verification code fetch error:", codeError.message);
    //   await supabase.auth.signOut();
    //   Alert.alert("Verification check failed. Please try again.");
    //   setLoading(false);
    //   return;
    // }

    // if (codeData) {
    //   // 🔥 User still needs to enter code!
    //   await supabase.auth.signOut();
    //   Alert.alert(
    //     "Complete Verification",
    //     "Please enter the 6-digit code sent to your email first."
    //   );
    //   router.replace("/verify-code");
    //   setLoading(false);
    //   return;
    // }

    // ✅ No verification code found = user is fully verified
    console.log("Login success, user fully verified!");
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

    // ✅ Only ONE signUp call
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      Alert.alert("Signup error", signUpError.message);
      setLoading(false);
      return;
    }

    Alert.alert(
      "Check your inbox",
      "We sent a confirmation link to your email."
    );

    setLoading(false);
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
