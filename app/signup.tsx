import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    // --- Validation ---
    if (!firstName || !lastName || !email || !contactNumber || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    
    // Validate phone number length
    if (contactNumber.length !== 10) {
      Alert.alert("Error", "Contact number must be 10 digits");
      return;
    }
    
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (!agree) {
      Alert.alert("Error", "Please agree to the terms and privacy policy");
      return;
    }

    setLoading(true);

    // Combine Country Code and Number for display purposes
    const fullMobileNumber = `${countryCode}${contactNumber}`;

    // --- Step 1: Register User ---
    // The backend expects phoneNumber as an object with countryCode and number
    try {
      const regRes = await axios.post("https://api.ekalakaar.com/api/v1/auth/register", {
        role: "Artist",
        firstName,
        lastName,
        email,
        password,
        passwordConfirm: confirmPassword,
        phoneNumber: {
          countryCode: countryCode,
          number: contactNumber  // Just the 10-digit number
        }
      });
      
      console.log("Register Success:", regRes.data);
      
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.response) {
        const errorMsg = error.response.data?.message || "Could not create account";
        console.error("Registration Error:", error.response.data);
        Alert.alert("Registration Failed", errorMsg);
      } else {
        Alert.alert("Error", (error as any).message || "Something went wrong");
      }
      return; 
    }

    // --- Step 2: Send OTP (Matching Web Implementation) ---
    try {
      // Wait 1.5 seconds to ensure DB write completes
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Sending OTP with email:", email, "and phone:", contactNumber);

      // ✅ CRITICAL: Match the exact format from web code
      const otpRequestBody = {
        email: email,
        mobileNu: contactNumber,  // ⚠️ Just the number, NOT the full mobile with country code
        registerBy: email && contactNumber ? "both" : email ? "email" : "mobile"
      };

      const otpRes = await axios.post(
        "https://api.ekalakaar.com/api/v1/auth/register-otp/send-otp",
        otpRequestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log("OTP Send Success:", otpRes.data);
      Alert.alert("Success", "Account created & OTP sent!");
      
    } catch (error) {
      console.error("OTP Send Error:", error);
      
      if (axios.isAxiosError(error) && error.response) {
        console.error("OTP Error Response:", {
          status: error.response.status,
          data: error.response.data
        });
        
        Alert.alert(
          "Account Created", 
          "Your account was created successfully. Please use 'Resend OTP' on the next screen to verify.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert("Account Created", "Please resend OTP on the verification screen.");
      }
    }

    // --- Step 3: Navigate to Verify Screen ---
    setLoading(false);
    router.push({
      pathname: "/OtpVerify",
      params: {
        email,
        contactNumber: contactNumber,  // Pass just the 10-digit number
        countryCode: countryCode,       // Pass country code separately if needed
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../assets/images/logo-ekalakaar.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create your Account</Text>

          {/* First Name */}
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Jack"
            value={firstName}
            onChangeText={setFirstName}
            returnKeyType="next"
          />

          {/* Last Name */}
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Joe"
            value={lastName}
            onChangeText={setLastName}
            returnKeyType="next"
          />

          {/* Contact Number */}
          <Text style={styles.label}>Contact Number</Text>
          <View style={styles.contactRow}>
            <TextInput
              style={styles.codeInput}
              value={countryCode}
              onChangeText={setCountryCode}
              maxLength={4}
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.phoneInput}
              placeholder="1234567890"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
              maxLength={10}
              returnKeyType="next"
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="abc@gmail.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            returnKeyType="next"
          />

          {/* Password */}
          <Text style={styles.label}>Password (Enter min 8 characters)</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="abc123456"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="abc123456"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)} style={styles.eyeBtn}>
              <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Checkbox */}
          <View style={styles.checkRow}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgree((val) => !val)}
            >
              <View style={[styles.checkBoxShape, agree && styles.checkBoxChecked]} />
            </TouchableOpacity>
            <Text style={{ marginLeft: 7, flex: 1 }}>
              I agree to{" "}
              <Text style={{ color: "#AD2F3B", fontWeight: "bold" }}>Terms and Condition</Text>
              {" "}&nbsp;
              <Text style={{ color: "#AD2F3B", fontWeight: "bold" }}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.button, (!agree || loading) && { opacity: 0.65 }]}
            onPress={handleRegister}
            disabled={!agree || loading}
          >
            <Text style={styles.buttonText}>{loading ? "Signing Up..." : "Sign Up"}</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.foot}>
            Already have an account?{" "}
            <Text
              style={{ color: "#AD2F3B", fontWeight: "600" }}
              onPress={() => router.replace("/SignIn")}
            >
              Sign in
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 40, 
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 0,
    marginTop:0,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 0,
    marginBottom: 12,
    color: "#212121",
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 4,
    fontWeight: "500",
    fontSize: 14,
    color: "#222"
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  contactRow: {
    flexDirection: "row",
    width: "100%",
    gap: 7,
    marginBottom: 4,
  },
  codeInput: {
    width: 60,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 15,
    textAlign: "center"
  },
  phoneInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  passwordRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 15,
  },
  eyeBtn: {
    padding: 10,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 18,
    width: "100%",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#AD2F3B",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkBoxShape: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
  checkBoxChecked: {
    backgroundColor: "#17c964",
  },
  button: {
    backgroundColor: "#AD2F3B",
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    width: "100%",
    marginTop: 6,
    marginBottom: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  foot: {
    marginTop: 28,
    color: "#232323",
    fontSize: 15,
  },
});