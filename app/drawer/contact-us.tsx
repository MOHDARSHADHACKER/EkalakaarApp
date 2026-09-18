// // app/contact.tsx
// import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import React, { useState } from "react";
// import {
//     Alert,
//     FlatList,
//     Modal,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     TouchableWithoutFeedback,
//     View,
// } from "react-native";

// /** Simple dropdown component (no external deps) */
// type Item = { label: string; value: string };

// function CustomDropdown({
//   items,
//   value,
//   onChange,
//   placeholder,
// }: {
//   items: Item[];
//   value: string | null;
//   onChange: (v: string) => void;
//   placeholder?: string;
// }) {
//   const [open, setOpen] = useState(false);
//   const selected = items.find((i) => i.value === value)?.label ?? null;

//   return (
//     <>
//       <TouchableOpacity
//         activeOpacity={0.8}
//         style={styles.dropdown}
//         onPress={() => setOpen(true)}
//       >
//         <Text style={[styles.dropdownText, !selected && { color: "#999" }]}>
//           {selected ?? placeholder ?? "Select..."}
//         </Text>
//         <Ionicons name={open ? "chevron-up" : "chevron-down"} size={20} color="#666" />
//       </TouchableOpacity>

//       <Modal visible={open} transparent animationType="fade">
//         <TouchableWithoutFeedback onPress={() => setOpen(false)}>
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <FlatList
//                 data={items}
//                 keyExtractor={(i) => i.value}
//                 renderItem={({ item }) => (
//                   <TouchableOpacity
//                     style={styles.option}
//                     onPress={() => {
//                       onChange(item.value);
//                       setOpen(false);
//                     }}
//                   >
//                     <Text style={styles.optionText}>{item.label}</Text>
//                   </TouchableOpacity>
//                 )}
//                 ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
//               />
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </>
//   );
// }

// export default function Contact() {
//   const navigation = useNavigation();
//   const [subject, setSubject] = useState<string | null>(null);
//   const [message, setMessage] = useState("");

//   const items: Item[] = [
//     { label: "General Inquiry", value: "general" },
//     { label: "Support", value: "support" },
//     { label: "Feedback", value: "feedback" },
//     { label: "Partnership", value: "partnership" },
//   ];

//   const onSend = () => {
//     if (!subject) {
//       return Alert.alert("Select subject", "Please choose a subject for your message.");
//     }
//     if (!message || message.trim().length < 5) {
//       return Alert.alert("Write message", "Please write a short message (min 5 chars).");
//     }

//     // demo behaviour: show success
//     Alert.alert("Message sent", "Thanks — our team will contact you shortly.");
//     setSubject(null);
//     setMessage("");
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Contact Us</Text>
//         <TouchableOpacity onPress={() => navigation.navigate("profile" as never)}>
//           <Ionicons name="person-circle-outline" size={28} color="#333" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={{ padding: 20 }}>
//         <Text style={styles.introText}>
//           Have any questions for <Text style={{ fontWeight: "700" }}>eKalakaar</Text>? Fill the form and we'll get back to you shortly.
//         </Text>

//         <Text style={styles.label}>Subject</Text>
//         <CustomDropdown
//           items={items}
//           value={subject}
//           onChange={(v) => setSubject(v)}
//           placeholder="Please select a subject"
//         />

//         <Text style={styles.label}>Your Message</Text>
//         <TextInput
//           style={styles.textArea}
//           placeholder="Type your message..."
//           placeholderTextColor="#999"
//           value={message}
//           onChangeText={setMessage}
//           multiline
//         />

//         <TouchableOpacity style={styles.sendBtn} onPress={onSend}>
//           <Text style={styles.sendBtnText}>Send Message</Text>
//         </TouchableOpacity>

//         <View style={styles.contactInfo}>
//           <TouchableOpacity style={styles.contactRow} onPress={() => Alert.alert("Call", "Open WhatsApp or dial +91 7701872112")}>
//             <FontAwesome name="whatsapp" size={22} color="#25D366" />
//             <Text style={styles.contactText}>+91 7701872112</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.contactRow} onPress={() => Alert.alert("Email", "Compose email to info@ekalakaar.com")}>
//             <MaterialIcons name="email" size={22} color="#b91c1c" />
//             <Text style={styles.contactText}>info@ekalakaar.com</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.contactRow} onPress={() => Alert.alert("Website", "Open www.ekalakaar.com")}>
//             <Ionicons name="globe-outline" size={22} color="#1d4ed8" />
//             <Text style={styles.contactText}>www.ekalakaar.com</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// /* Styles */
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },

//   // Header
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     backgroundColor: "#f9fafb",
//     elevation: 2,
//   },
//   headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },

//   // Intro
//   introText: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 18,
//     textAlign: "center",
//   },

//   // Label
//   label: { fontSize: 14, fontWeight: "600", marginTop: 12, marginBottom: 8 },

//   // Custom dropdown
//   dropdown: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderColor: "#ddd",
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     backgroundColor: "#fff",
//   },
//   dropdownText: { fontSize: 14, color: "#333" },

//   // modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.2)",
//     justifyContent: "center",
//     paddingHorizontal: 24,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     maxHeight: "60%",
//     overflow: "hidden",
//   },
//   option: { paddingVertical: 14, paddingHorizontal: 16 },
//   optionText: { fontSize: 15, color: "#333" },

//   // message
//   textArea: {
//     height: 120,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 12,
//     padding: 12,
//     textAlignVertical: "top",
//     fontSize: 14,
//     marginBottom: 18,
//   },

//   // send button
//   sendBtn: {
//     backgroundColor: "#b91c1c",
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     marginBottom: 26,
//   },
//   sendBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 15,
//   },

//   // contact info
//   contactInfo: { marginTop: 4 },
//   contactRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//   },
//   contactText: { marginLeft: 12, fontSize: 15, color: "#222" },
// });

//contact

// app/contact.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomTabBar from "../../components/BottomTabBar";

export default function Contact() {
  const navigation = useNavigation();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // API Integration for Contact Form Submission
  // ==========================================
  const handleSubmit = async () => {
    // Validation
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }
    if (!contactNumber.trim() || !/^[0-9]{10}$/.test(contactNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit contact number");
      return;
    }
    if (!subject.trim()) {
      Alert.alert("Error", "Please enter a subject");
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      Alert.alert("Error", "Please enter your message (minimum 10 characters)");
      return;
    }

    try {
      setLoading(true);

      // Get access token from AsyncStorage
      const accessToken = await AsyncStorage.getItem("accessToken");

      const response = await fetch(
        "https://api.ekalakaar.com/api/v1/quries/post-query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Include authorization header if required by API
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          body: JSON.stringify({
            name: fullName.trim(),
            email: email.trim(),
            mobile: contactNumber.trim(),
            subject: subject.trim(),
            message: message.trim(),
          }),
        },
      );

      const data = await response.json();
      console.log("Contact Form Response:", data);

      if (response.ok) {
        Alert.alert(
          "Success",
          "Thank you for contacting us! Our team will get back to you shortly.",
          [
            {
              text: "OK",
              onPress: () => {
                // Clear form after successful submission
                setFullName("");
                setEmail("");
                setContactNumber("");
                setSubject("");
                setMessage("");
              },
            },
          ],
        );
      } else {
        Alert.alert(
          "Submission Failed",
          data.message ||
            "Unable to submit your query. Please try again later.",
        );
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      Alert.alert(
        "Error",
        "Something went wrong. Please check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}></Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="bookmark-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("profile" as never)}
            >
              <Ionicons name="person-circle-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Page Title */}
          <Text style={styles.pageTitle}>Contact Us</Text>

          {/* Intro Text */}
          <Text style={styles.introText}>
            Have any questions about pricing, plans, or eKalakaar? Fill out the
            form and our team will be in touch shortly.
          </Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
            />

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />

            {/* Contact Number */}
            <Text style={styles.label}>Contact Number</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#999"
              value={contactNumber}
              onChangeText={setContactNumber}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!loading}
            />

            {/* Subject */}
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              placeholderTextColor="#999"
              value={subject}
              onChangeText={setSubject}
              editable={!loading}
            />

            {/* Your Message */}
            <Text style={styles.label}>Your Message</Text>
            <TextInput
              style={styles.textArea}
              placeholder=""
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!loading}
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.sendBtn, loading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.sendBtnText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Contact Information */}
          <View style={styles.contactInfo}>
            {/* Phone */}
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() =>
                Alert.alert("Call", "Opening dialer for +91 7701872112")
              }
            >
              <View style={[styles.iconCircle, { backgroundColor: "#b91c1c" }]}>
                <Ionicons name="call" size={20} color="#fff" />
              </View>
              <Text style={styles.contactText}>+91 7701872112</Text>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() =>
                Alert.alert("Email", "Opening email to ek@ekalakaar.com")
              }
            >
              <View style={[styles.iconCircle, { backgroundColor: "#b91c1c" }]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color="#fff"
                />
              </View>
              <Text style={styles.contactText}>ek@ekalakaar.com</Text>
            </TouchableOpacity>

            {/* Address */}
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() =>
                Alert.alert(
                  "Address",
                  "IIM-Mumbai(Main Office) | New Delhi | Bhubaneshwar",
                )
              }
            >
              <View style={[styles.iconCircle, { backgroundColor: "#b91c1c" }]}>
                <Ionicons name="location-outline" size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactText}>
                  IIM-Mumbai(Main Office) | New Delhi | Bhubaneshwar
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomTabBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    padding: 6,
  },

  // Scroll Content
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Page Title
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 16,
  },

  // Intro Text
  introText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 10,
  },

  // Form
  form: {
    marginBottom: 32,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    backgroundColor: "#fff",
    height: 120,
    textAlignVertical: "top",
  },

  sendBtn: {
    backgroundColor: "#b91c1c",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    elevation: 2,
    shadowColor: "#b91c1c",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  sendBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Contact Information
  contactInfo: {
    marginTop: 8,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  contactText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});
