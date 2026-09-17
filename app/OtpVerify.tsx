import axios from "axios";
import React, { useRef, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "../src/services/api"; 

export default function OtpVerify() {
  const { email, contactNumber } = useLocalSearchParams(); // Both passed from signup
  // Correctly typed OTP refs
// NEW (Fixed)
const inputRefs = useRef<React.RefObject<TextInput | null>[]>(
  Array.from({ length: 6 }, () => React.createRef<TextInput | null>())
);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.current?.focus();
    if (!value && index > 0) inputRefs.current[index - 1]?.current?.focus();
  };

  // const handleVerify = async () => {
  //   const code = otp.join("");
  //   if (code.length !== 6) {
  //     Alert.alert("Error", "Please enter the 6-digit code");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const res = await axios.post(
  //       "https://api.ekalakaar.com/api/v1/auth/verify-register-otp/verify-otp",
  //       {
  //         email,
  //         mobile: contactNumber,
  //         otp: code,
  //       }
  //     );
  //     Alert.alert("Success", "OTP verified, Now Please login");
  //     router.replace("/SignIn");
  //   } catch (error) {
  //     if (axios.isAxiosError(error) && error.response) {
  //       Alert.alert("Error", error.response.data?.message || "Invalid or expired code");
  //     } else {
  //       Alert.alert("Error", (error as any).message || "Invalid or expired code");
  //     }
  //   }
  //   setLoading(false);
  // };

const handleVerify = async () => {
  const code = otp.join("");
  if (code.length !== 6) {
    Alert.alert("Error", "Please enter the 6-digit code");
    return;
  }

  setLoading(true);
  try {
    const res = await api.post(
      "/auth/verify-register-otp/verify-otp",
      {
        email,
        mobile: contactNumber,
        otp: code,
      }
    );

    Alert.alert("Success", "OTP verified, Now Please login");
    router.replace("/SignIn");
  } catch (error: any) {
    if (error.response) {
      Alert.alert(
        "Error",
        error.response.data?.message || "Invalid or expired code"
      );
    } else {
      Alert.alert(
        "Error",
        error.message || "Invalid or expired code"
      );
    }
  } finally {
    setLoading(false);
  }
};
  
  // const handleResend = async () => {
  //   setLoading(true);
  //   try {
  //     await axios.post(
  //       "https://api.ekalakaar.com/api/v1/auth/register-otp/send-otp",
  //       {
  //         email,
  //         mobile: contactNumber,
  //       }
  //     );
  //     Alert.alert("Info", "OTP resent to your email and mobile!");
  //   } catch (err) {
  //     if (axios.isAxiosError(err) && err.response) {
  //       Alert.alert("Error", err.response.data?.message || "Failed to resend code");
  //     } else {
  //       Alert.alert("Error", (err as any).message || "Failed to resend code");
  //     }
  //   }
  //   setLoading(false);
  // };

const handleResend = async () => {
  setLoading(true);
  try {
    await api.post(
      "/auth/register-otp/send-otp",
      {
        email,
        mobile: contactNumber,
      }
    );
    Alert.alert("Info", "OTP resent to your email and mobile!");
  } catch (err: any) {
    if (err.response) {
      Alert.alert(
        "Error",
        err.response.data?.message || "Failed to resend code"
      );
    } else {
      Alert.alert(
        "Error",
        err.message || "Failed to resend code"
      );
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Image
          source={require("../assets/images/logo-ekalakaar.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.header}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
         We have sent a code on your mobile number <Text style={{ fontWeight: "bold" }}>{contactNumber}</Text> to complete the verification process
        </Text>
        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={inputRefs.current[idx]}
              style={styles.otpBox}
              value={digit}
              onChangeText={(val: string) => handleChange(val, idx)}
              keyboardType="number-pad"
              maxLength={1}
              returnKeyType="next"
              autoFocus={idx === 0}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.verifyBtn}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.verifyText}>
            {loading ? "Verifying..." : "Verify Now"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.resendRow}>
          Didn’t receive any code?{" "}
          <Text style={styles.resendLink} onPress={handleResend}>
            Resend Code
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 16,
  },
  backBtn: {
    position: "absolute",
    top: 18,
    left: 18,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 22,
    color: "#550000",
  },
  logo: {
    width: 300,
    height: 200,
    marginVertical: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 0,
    marginBottom: 10,
    color: "#212121",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#444",
    marginBottom: 18,
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    marginTop: 4,
    gap: 10,
  },
  otpBox: {
    borderWidth: 1.5,
    borderColor: "#AD2F3B",
    borderRadius: 8,
    width: 48,
    height: 48,
    textAlign: "center",
    fontSize: 22,
    marginHorizontal: 2,
    backgroundColor: "#fff",
    fontWeight: "500",
  },
  verifyBtn: {
    backgroundColor: "#AD2F3B",
    borderRadius: 16,
    width: "100%",
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 14,
    marginTop: 2,
  },
  verifyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  resendRow: {
    color: "#222",
    fontSize: 14,
    marginTop: 10,
  },
  resendLink: {
    color: "#AD2F3B",
    fontWeight: "600",
  },
});
