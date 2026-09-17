import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import api from "../src/services/api"; 
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- LOGIN LOGIC AS YOU SHARED ---
  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     Alert.alert("Error", "Please enter both email and password");
  //     return;
  //   }
  //   // Login type detection
  //   let loginBy = email.includes("@")
  //     ? "email"
  //     : /^[0-9]{10}$/.test(email)
  //     ? "mobile"
  //     : null;

  //   if (!loginBy) {
  //     Alert.alert("Error", "Enter a valid email or 10-digit mobile number");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await fetch("https://api.ekalakaar.com/api/v1/auth/login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //         registerBy: loginBy,
  //       }),
  //     });

  //     const data = await response.json();
  //     console.log("Login Response:", data);

  //     if (response.ok && data.data) {
  //       const { accessToken, refreshToken, role, profileCompleted } = data.data;

  //       await AsyncStorage.setItem("accessToken", accessToken);
  //       await AsyncStorage.setItem("refreshToken", refreshToken);
  //       await AsyncStorage.setItem("role", role);

  //       Alert.alert("Success", "Login successful!");
  //       if (profileCompleted === false) {
  //         router.replace("/drawer/home");
  //       } else {
  //         router.replace("/drawer/home");
  //       }
  //     } else {
  //       Alert.alert("Login Failed", data.message || "Invalid credentials");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     Alert.alert("Error", "Something went wrong. Try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter both email and password");
    return;
  }

  let loginBy = email.includes("@")
    ? "email"
    : /^[0-9]{10}$/.test(email)
    ? "mobile"
    : null;

  if (!loginBy) {
    Alert.alert("Error", "Enter a valid email or 10-digit mobile number");
    return;
  }

  try {
    setLoading(true);

    // fetch ki jagah api.post
    const response = await api.post("/auth/login", {
      email,
      password,
      registerBy: loginBy,
    });

    const data = response.data;
    console.log("Login Response:", data);

    if (data?.data) {
      const { accessToken, refreshToken, role, profileCompleted, user } = data.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("role", role);
      if (user) {
        await AsyncStorage.setItem("userData", JSON.stringify(user));
      }

      Alert.alert("Success", "Login successful!");
      router.replace("/drawer/home");
    } else {
      Alert.alert("Login Failed", data.message || "Invalid credentials");
    }
  } catch (err: any) {
    console.error("Login error:", err?.response?.data || err);
    Alert.alert(
      "Error",
      err?.response?.data?.message || "Something went wrong. Try again later."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../assets/images/logo-ekalakaar.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Login to your account</Text>

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="abc@gmail.com"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="abc123456"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Forgot Password */}
      <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 10 }}
      onPress={() => router.push("/ForgotPassword")}
      >
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        style={[
          styles.loginBtn,
          (!email || !password) && { opacity: 0.7 },
        ]}
        onPress={handleLogin}
        disabled={!email || !password || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Social Login */}
       {/* <Text style={styles.orText}>Or login with</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-google" size={22} color="#ea4335" />
          <Text style={styles.socialLabel}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <FontAwesome name="facebook-official" size={22} color="#1877F3" />
          <Text style={styles.socialLabel}>facebook</Text>
        </TouchableOpacity>
      </View>  */}

      {/* Register Now */}
      <Text style={styles.bottomText}>
        Don’t have an account?{" "}
        <Text
          style={{ color: "#AD2F3B", fontWeight: "600" }}
          onPress={() => router.push("/signup")}
        >
          Register Now
        </Text>
      </Text>
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
    marginBottom: 2,
    marginTop: 5,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1e1e1e",
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    fontWeight: "500",
    marginBottom: 6,
    marginTop: 5,
    color: "#232323",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#d7d7d7",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
    fontSize: 15,
  },
  forgot: {
    color: "#AD2F3B",
    marginTop: 0,
    marginBottom: 6,
    fontWeight: "500",
    fontSize: 14,
  },
  loginBtn: {
    width: "100%",
    backgroundColor: "#AD2F3B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 18,
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  orText: {
    textAlign: "center",
    color: "#606060",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 2,
    fontWeight: "500",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginTop: 8,
    marginBottom: 18,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: "#ececec",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 }
  },
  socialLabel: {
    marginLeft: 7,
    color: "#232323",
    fontWeight: "500",
    fontSize: 15,
    textTransform: "capitalize",
  },
  bottomText: {
    marginTop: 28,
    color: "#232323",
    fontSize: 15,
  },
});
