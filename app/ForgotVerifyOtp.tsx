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
import api from "../src/services/api"; 

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const handleVerify = async () => {
  //   if (!otp) {
  //     Alert.alert("Error", "Please enter the OTP");
  //     return;
  //   }

  //   if (!/^[0-9]{6}$/.test(otp)) {
  //     Alert.alert("Error", "Please enter a valid 6-digit OTP");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await fetch(
  //       "https://api.ekalakaar.com/api/v1/auth/forgot-password/verify-otp",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ otp }),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("Verify OTP Response:", data);

  //     if (response.ok) {
  //       Alert.alert("Success", "OTP verified successfully.");
  //       // After verify you usually go to reset-password screen
  //       router.push("/ResetPassword");
  //     } else {
  //       Alert.alert(
  //         "Failed",
  //         data.message || "Incorrect or expired OTP. Please try again."
  //       );
  //     }
  //   } catch (error) {
  //     console.log("Verify OTP error:", error);
  //     Alert.alert("Error", "Something went wrong, please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const handleVerify = async () => {
  if (!otp) {
    Alert.alert("Error", "Please enter the OTP");
    return;
  }

  if (!/^[0-9]{6}$/.test(otp)) {
    Alert.alert("Error", "Please enter a valid 6-digit OTP");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post(
      "/auth/forgot-password/verify-otp",
      { otp }
    );

    const data = response.data;
    console.log("Verify OTP Response:", data);

    if (response.status >= 200 && response.status < 300) {
      Alert.alert("Success", "OTP verified successfully.");
      router.push("/ResetPassword");
    } else {
      Alert.alert(
        "Failed",
        data?.message || "Incorrect or expired OTP. Please try again."
      );
    }
  } catch (error: any) {
    console.log("Verify OTP error:", error?.response?.data || error);
    Alert.alert(
      "Error",
      error?.response?.data?.message || "Something went wrong, please try again."
    );
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

      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subTitle}>
        Enter the 6-digit OTP sent to your mobile number
      </Text>

      <TextInput
        style={styles.input}
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Verify</Text>
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
    marginBottom: 24,
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 6,
  },
  continueBtn: {
    width: "100%",
    backgroundColor: "#AD2F3B",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
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
