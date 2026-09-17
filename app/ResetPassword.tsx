import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!password || !passwordConfirm) {
      Alert.alert("Error", "Please enter both password and confirm password");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://api.ekalakaar.com/api/v1/auth/forgot-password/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // accessToken is already set in cookies by verify-otp response on backend
          },
          body: JSON.stringify({ password, passwordConfirm }),
        }
      );

      const data = await response.json();
      console.log("Reset Password Response:", data);

      if (response.ok) {
        Alert.alert(
          "Success",
          "Password reset successfully. Please login with your new password.",
          [
            {
              text: "OK",
              onPress: () => {
                router.dismissAll?.();
                router.replace("/SignIn");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Failed",
          data.message || "Unable to reset password. Please try again."
        );
      }
    } catch (error) {
      console.log("Reset password error:", error);
      Alert.alert("Error", "Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/logo-ekalakaar.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subTitle}>
        Enter and confirm your new password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="New password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm new password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 10,
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e1e1e",
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: "#606060",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d7d7d7",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    fontSize: 15,
  },
  continueBtn: {
    width: "100%",
    backgroundColor: "#AD2F3B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelText: {
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
});
