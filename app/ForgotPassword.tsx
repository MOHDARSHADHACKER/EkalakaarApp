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

export default function ForgotPassword() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // const handleContinue = async () => {
  //   if (!mobile) {
  //     Alert.alert("Error", "Please enter your mobile number");
  //     return;
  //   }

  //   if (!/^[0-9]{10}$/.test(mobile)) {
  //     Alert.alert("Error", "Please enter a valid 10-digit mobile number");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const body = {
  //       mobileNu: mobile,      // must match controller param
  //       registerBy: "mobile",  // tells backend to search by mobile
  //     };
  //     console.log("Forgot body:", body);

  //     const response = await fetch(
  //       "https://api.ekalakaar.com/api/v1/auth/forgot-password/send-otp",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(body),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log("Forgot Password Response:", data);

  //     if (response.ok) {
  //       Alert.alert(
  //         "Success",
  //         data.message || "OTP sent to your mobile number for password reset."
  //       );
  //       router.push("/ForgotVerifyOtp");
  //       // router.back();
  //     } else {
  //       if (
  //         data?.error?.statusCode === 404 ||
  //         (typeof data.message === "string" &&
  //           data.message.toLowerCase().includes("user does not exist"))
  //       ) {
  //         Alert.alert(
  //           "User not found",
  //           "This mobile number is not registered on Ekalakaar. Please check the number or create a new account."
  //         );
  //       } else {
  //         Alert.alert(
  //           "Failed",
  //           data.message || "Unable to send OTP. Please try again."
  //         );
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Forgot password error:", error);
  //     Alert.alert("Error", "Something went wrong, please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  
const handleContinue = async () => {
  if (!mobile) {
    Alert.alert("Error", "Please enter your mobile number");
    return;
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    Alert.alert("Error", "Please enter a valid 10-digit mobile number");
    return;
  }

  try {
    setLoading(true);

    const body = {
      mobileNu: mobile,
      registerBy: "mobile",
    };
    console.log("Forgot body:", body);

    const response = await api.post(
      "/auth/forgot-password/send-otp",
      body
    );

    const data = response.data;
    console.log("Forgot Password Response:", data);

    if (response.status >= 200 && response.status < 300) {
      Alert.alert(
        "Success",
        data.message || "OTP sent to your mobile number for password reset."
      );
      router.push("/ForgotVerifyOtp");
    } else {
      if (
        data?.error?.statusCode === 404 ||
        (typeof data.message === "string" &&
          data.message.toLowerCase().includes("user does not exist"))
      ) {
        Alert.alert(
          "User not found",
          "This mobile number is not registered on Ekalakaar. Please check the number or create a new account."
        );
      } else {
        Alert.alert(
          "Failed",
          data.message || "Unable to send OTP. Please try again."
        );
      }
    }
  } catch (error: any) {
    console.log("Forgot password error:", error?.response?.data || error);
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

      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subTitle}>
        Enter your mobile number to reset your password
      </Text>

      <TextInput
        style={styles.input}
        placeholder="9876543210"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        maxLength={10}
      />

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={handleContinue}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.continueText}>Continue</Text>
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
