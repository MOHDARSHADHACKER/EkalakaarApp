// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { useRouter } from "expo-router";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// // Language options
// const LANGUAGES = [
//   "Hindi",
//   "English",
//   "Bengali",
//   "Telugu",
//   "Marathi",
//   "Tamil",
//   "Urdu",
//   "Gujarati",
//   "Kannada",
//   "Odia",
//   "Malayalam",
//   "Punjabi",
//   "Assamese",
//   "Maithili",
//   "Sanskrit",
//   "Konkani",
//   "Nepali",
//   "Sindhi",
//   "Dogri",
//   "Kashmiri",
//   "Manipuri",
//   "Santali",
//   "Bodo",
//   "Any Other",
// ];

// // Indian States
// const INDIAN_STATES = [
//   "Andaman and Nicobar Islands",
//   "Andhra Pradesh",
//   "Arunachal Pradesh",
//   "Assam",
//   "Bihar",
//   "Chandigarh",
//   "Chhattisgarh",
//   "Dadra and Nagar Haveli",
//   "Daman and Diu",
//   "Delhi",
//   "Goa",
//   "Gujarat",
//   "Haryana",
//   "Himachal Pradesh",
//   "Jammu and Kashmir",
//   "Jharkhand",
//   "Karnataka",
//   "Kerala",
//   "Lakshadweep",
//   "Madhya Pradesh",
//   "Maharashtra",
//   "Manipur",
//   "Meghalaya",
//   "Mizoram",
//   "Nagaland",
//   "Odisha",
//   "Puducherry",
//   "Punjab",
//   "Rajasthan",
//   "Sikkim",
//   "Tamil Nadu",
//   "Telangana",
//   "Tripura",
//   "Uttar Pradesh",
//   "Uttarakhand",
//   "West Bengal",
// ];

// export default function EditBasicProfile() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showLanguageModal, setShowLanguageModal] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     contactNumber: { countryCode: "+91", number: "" },
//     age: "",
//     gender: "",
//     languages: [],
//     monthlyIncome: "",
//     about: "",
//     pwd: "",
//     incomeSrc: "",
//     socialCategory: "",
//     idProof: { name: "", num: "" },
//     address: { state: "", city: "", pincode: "", details: "" },
//     aadharNumber: "",
//     panNumber: "",
//     upiId: "",
//     passportNumber: null,
//     highestEducation: "",
//     yearOfCompletion: "",
//     gstIn: "",
//     anunalIncomeByPerf: "",
//     numOfperformanceLastYear: "",
//     handles: {
//       instagram: "",
//       facebook: "",
//       youtube: "",
//       linkedIn: "",
//       website: "",
//       twitter: "",
//     },
//   });

//   // Fetch profile data on mount
//   useEffect(() => {
//     fetchProfileData();
//   }, []);

//   const fetchProfileData = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("accessToken");

//       const response = await fetch(
//         "https://api.ekalakaar.com/api/v1/artists/profile/69cd062aed280923ebfe8666",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       );

//       const data = await response.json();

//       if (response.ok && data.data) {
//         const { personalInfo, otherInfo, address, socialLinks } = data.data;

//         setFormData({
//           firstName: personalInfo?.firstName || "",
//           lastName: personalInfo?.lastName || "",
//           email: personalInfo?.email || "",
//           contactNumber: {
//             countryCode: personalInfo?.contactNumber?.countryCode || "+91",
//             number: personalInfo?.contactNumber?.number || "",
//           },
//           age: personalInfo?.age?.toString() || "",
//           gender: personalInfo?.gender || "",
//           languages: personalInfo?.languages || [],
//           monthlyIncome: personalInfo?.monthlyIncome || "",
//           about: personalInfo?.about || "",
//           pwd: personalInfo?.pwd || "",
//           incomeSrc: personalInfo?.incomeSrc || "",
//           socialCategory: personalInfo?.socialCategory || "",
//           idProof: otherInfo?.idProof || { name: "", num: "" },
//           address: address || { state: "", city: "", pincode: "", details: "" },
//           aadharNumber: otherInfo?.aadharNumber || "",
//           panNumber: otherInfo?.panNumber || "",
//           upiId: otherInfo?.upiId || "",
//           passportNumber: otherInfo?.passportNumber || null,
//           highestEducation: otherInfo?.highestEducation || "",
//           yearOfCompletion: otherInfo?.yearOfCompletion || "",
//           gstIn: otherInfo?.gstIn || "",
//           anunalIncomeByPerf: otherInfo?.anunalIncomeByPerf || "",
//           numOfperformanceLastYear: otherInfo?.lastYearPerfsCount || "",
//           handles: socialLinks || {
//             instagram: "",
//             facebook: "",
//             youtube: "",
//             linkedIn: "",
//             website: "",
//             twitter: "",
//           },
//         });
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to load profile data");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Pincode fetch
//   const fetchPinData = async (pincode: string) => {
//     if (pincode.length === 6) {
//       try {
//         const response = await fetch(
//           `https://api.postalpincode.in/pincode/${pincode}`,
//         );
//         const data = await response.json();

//         if (data[0].Status === "Success") {
//           setFormData((prev) => ({
//             ...prev,
//             address: {
//               ...prev.address,
//               state: data[0].PostOffice[0].State,
//               city: data[0].PostOffice[0].District,
//             },
//           }));
//         } else {
//           Alert.alert("Error", "Invalid PIN code");
//         }
//       } catch (error) {
//         console.error("PIN fetch error:", error);
//       }
//     }
//   };

//   const handleUpdate = (field: string, value: any) => {
//     setFormData((prev) => {
//       if (field.includes(".")) {
//         const [parent, child] = field.split(".");

//         const p = parent as keyof typeof prev;
//         const parentObj = prev[p] as any; // or Record<string, any>

//         return {
//           ...prev,
//           [p]: {
//             ...parentObj,
//             [child]: value,
//           },
//         };
//       }

//       return {
//         ...prev,
//         [field]: value as any,
//       };
//     });
//   };

//   // Submit handler
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem("accessToken");

//       // Prepare data
//       const personalInfo = {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         about: formData.about,
//         age: parseInt(formData.age),
//         contactNumber: formData.contactNumber,
//         pwd: formData.pwd,
//         email: formData.email,
//         gender: formData.gender,
//         monthlyIncome: formData.monthlyIncome,
//         socialCategory: formData.socialCategory,
//         incomeSrc: formData.incomeSrc,
//         languages: formData.languages,
//       };

//       const otherInfo = {
//         aadharNumber: formData.aadharNumber,
//         panNumber: formData.panNumber,
//         upiId: formData.upiId,
//         numOfperformanceLastYear: formData.numOfperformanceLastYear,
//         idProof: formData.idProof,
//         gstIn: formData.gstIn,
//         anunalIncomeByPerf: formData.anunalIncomeByPerf,
//         yearOfCompletion: formData.yearOfCompletion,
//         highestEducation: formData.highestEducation,
//         passportNumber: formData.passportNumber,
//       };

//       const response = await fetch(
//         "https://api.ekalakaar.com/api/v1/artists/profile",
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             address: formData.address,
//             personalInfo,
//             otherInfo,
//             socialLinks: formData.handles,
//           }),
//         },
//       );

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert("Success", "Profile updated successfully!");
//         router.back();
//       } else {
//         Alert.alert("Error", data.message || "Failed to update profile");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Something went wrong");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !formData.firstName) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#b91c1c" />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       style={styles.container}
//     >
//       <ScrollView style={styles.scrollView}>
//         {/* Header */}
//         <View style={styles.container}></View>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Ionicons name="arrow-back" size={24} color="#000" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Edit Basic Profile</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Personal Information Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               First Name <Text style={styles.required}>*</Text>
//             </Text>
//             <TextInput
//               style={styles.input}
//               value={formData.firstName}
//               onChangeText={(text) => handleUpdate("firstName", text)}
//               placeholder="Enter first name"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               Last Name <Text style={styles.required}>*</Text>
//             </Text>
//             <TextInput
//               style={styles.input}
//               value={formData.lastName}
//               onChangeText={(text) => handleUpdate("lastName", text)}
//               placeholder="Enter last name"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               Email <Text style={styles.required}>*</Text>
//             </Text>
//             <TextInput
//               style={[styles.input, styles.disabledInput]}
//               value={formData.email}
//               editable={false}
//               placeholder="Email"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               Contact Number <Text style={styles.required}>*</Text>
//             </Text>
//             <View style={styles.phoneContainer}>
//               <TextInput
//                 style={[styles.input, styles.countryCode]}
//                 value={formData.contactNumber.countryCode}
//                 editable={false}
//               />
//               <TextInput
//                 style={[styles.input, styles.phoneNumber]}
//                 value={formData.contactNumber.number}
//                 onChangeText={(text) =>
//                   handleUpdate("contactNumber.number", text)
//                 }
//                 placeholder="1234567890"
//                 keyboardType="phone-pad"
//                 maxLength={10}
//               />
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={[styles.inputContainer, styles.halfWidth]}>
//               <Text style={styles.label}>
//                 Age <Text style={styles.required}>*</Text>
//               </Text>
//               <TextInput
//                 style={styles.input}
//                 value={formData.age}
//                 onChangeText={(text) => handleUpdate("age", text)}
//                 placeholder="Age"
//                 keyboardType="numeric"
//               />
//             </View>

//             <View style={[styles.inputContainer, styles.halfWidth]}>
//               <Text style={styles.label}>
//                 Gender <Text style={styles.required}>*</Text>
//               </Text>
//               <View style={styles.pickerContainer}>
//                 <Text style={styles.pickerText}>
//                   {formData.gender || "Select"}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               Languages Known <Text style={styles.required}>*</Text>
//             </Text>
//             <TouchableOpacity
//               style={styles.multiSelectContainer}
//               onPress={() => setShowLanguageModal(true)}
//             >
//               <Text style={styles.multiSelectText}>
//                 {formData.languages.length > 0
//                   ? formData.languages.join(", ")
//                   : "Select languages"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Address Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>ADDRESS</Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               Pincode <Text style={styles.required}>*</Text>
//             </Text>
//             <TextInput
//               style={styles.input}
//               value={formData.address.pincode}
//               onChangeText={(text) => {
//                 handleUpdate("address.pincode", text);
//                 fetchPinData(text);
//               }}
//               placeholder="Enter pincode"
//               keyboardType="numeric"
//               maxLength={6}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>State</Text>
//             <TextInput
//               style={[styles.input, styles.disabledInput]}
//               value={formData.address.state}
//               editable={false}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>City</Text>
//             <TextInput
//               style={[styles.input, styles.disabledInput]}
//               value={formData.address.city}
//               editable={false}
//             />
//           </View>
//         </View>

//         {/* Other Details Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>OTHER DETAILS</Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Highest Education Qualification</Text>
//             <View style={styles.pickerContainer}>
//               <Text style={styles.pickerText}>
//                 {formData.highestEducation || "Select"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Year of Completion</Text>
//             <View style={styles.pickerContainer}>
//               <Text style={styles.pickerText}>
//                 {formData.yearOfCompletion || "Select"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Social Category</Text>
//             <View style={styles.pickerContainer}>
//               <Text style={styles.pickerText}>
//                 {formData.socialCategory || "Select"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Person With Disability (PwD)</Text>
//             <View style={styles.pickerContainer}>
//               <Text style={styles.pickerText}>{formData.pwd || "Select"}</Text>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Primary Source Of Income</Text>
//             <View style={styles.pickerContainer}>
//               <Text style={styles.pickerText}>
//                 {formData.incomeSrc || "Select"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>
//               Annual Income from Performing Art (INR)
//             </Text>
//             <View style={styles.pickerContainer}>
//               <Text style={styles.pickerText}>
//                 {formData.anunalIncomeByPerf || "Select"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Identity Proof</Text>
//             <View style={styles.pickerContainer}>
//               <Text style={styles.pickerText}>
//                 {formData.idProof.name || "Select"}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>ID Proof Number</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.idProof.num}
//               onChangeText={(text) => handleUpdate("idProof.num", text)}
//               placeholder="Enter ID number"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>PAN Card</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.panNumber}
//               onChangeText={(text) => handleUpdate("panNumber", text)}
//               placeholder="Enter PAN number"
//               autoCapitalize="characters"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Valid Passport</Text>
//             <TouchableOpacity
//               style={styles.datePickerButton}
//               onPress={() => setShowDatePicker(true)}
//             >
//               <Text style={styles.datePickerText}>
//                 {formData.passportNumber
//                   ? new Date(formData.passportNumber).toLocaleDateString()
//                   : "Select date"}
//               </Text>
//               <Ionicons name="calendar-outline" size={20} color="#666" />
//             </TouchableOpacity>
//           </View>

//           {showDatePicker && (
//             <DateTimePicker
//               value={
//                 formData.passportNumber
//                   ? new Date(formData.passportNumber)
//                   : new Date()
//               }
//               mode="date"
//               display="default"
//               onChange={(event, selectedDate) => {
//                 setShowDatePicker(false);
//                 if (selectedDate) {
//                   handleUpdate("passportNumber", selectedDate.toISOString());
//                 }
//               }}
//             />
//           )}

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>UPI ID (Optional)</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.upiId}
//               onChangeText={(text) => handleUpdate("upiId", text)}
//               placeholder="Enter UPI ID"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>GST IN</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.gstIn}
//               onChangeText={(text) => handleUpdate("gstIn", text)}
//               placeholder="Enter GST IN"
//               autoCapitalize="characters"
//             />
//           </View>
//         </View>

//         {/* Social Media Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>SOCIAL MEDIA</Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Instagram</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.handles.instagram}
//               onChangeText={(text) => handleUpdate("handles.instagram", text)}
//               placeholder="Instagram handle"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Facebook</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.handles.facebook}
//               onChangeText={(text) => handleUpdate("handles.facebook", text)}
//               placeholder="Facebook profile"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>YouTube</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.handles.youtube}
//               onChangeText={(text) => handleUpdate("handles.youtube", text)}
//               placeholder="YouTube channel"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>LinkedIn</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.handles.linkedIn}
//               onChangeText={(text) => handleUpdate("handles.linkedIn", text)}
//               placeholder="LinkedIn profile"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Website</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.handles.website}
//               onChangeText={(text) => handleUpdate("handles.website", text)}
//               placeholder="Website URL"
//               autoCapitalize="none"
//               keyboardType="url"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>X (Twitter)</Text>
//             <TextInput
//               style={styles.input}
//               value={formData.handles.twitter}
//               onChangeText={(text) => handleUpdate("handles.twitter", text)}
//               placeholder="X handle"
//               autoCapitalize="none"
//             />
//           </View>
//         </View>

//         {/* About Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>ABOUT MY JOURNEY</Text>
//           <TextInput
//             style={styles.textArea}
//             value={formData.about}
//             onChangeText={(text) => handleUpdate("about", text)}
//             placeholder="Tell us about your artistic journey..."
//             multiline
//             numberOfLines={6}
//             textAlignVertical="top"
//           />
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={handleSubmit}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.submitButtonText}>Update Profile</Text>
//           )}
//         </TouchableOpacity>

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     borderBottomWidth: 1,
//     paddingTop: 48,
//     borderBottomColor: "#eee",
//     backgroundColor: "#fff",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   section: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#b91c1c",
//     marginBottom: 16,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "500",
//     marginBottom: 8,
//     color: "#333",
//   },
//   required: {
//     color: "#b91c1c",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 14,
//     backgroundColor: "#fff",
//   },
//   disabledInput: {
//     backgroundColor: "#f5f5f5",
//     color: "#999",
//   },
//   phoneContainer: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   countryCode: {
//     flex: 0.25,
//   },
//   phoneNumber: {
//     flex: 0.75,
//   },
//   row: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   halfWidth: {
//     flex: 1,
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: "#fff",
//   },
//   pickerText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   multiSelectContainer: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: "#fff",
//     minHeight: 48,
//   },
//   multiSelectText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   datePickerButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     backgroundColor: "#fff",
//   },
//   datePickerText: {
//     fontSize: 14,
//     color: "#333",
//   },
//   textArea: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 14,
//     backgroundColor: "#fff",
//     minHeight: 120,
//   },
//   submitButton: {
//     backgroundColor: "#b91c1c",
//     margin: 16,
//     padding: 16,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   submitButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// updated code of the other detail like highest qualification

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Language options
const LANGUAGES = [
  "Hindi",
  "English",
  "Bengali",
  "Telugu",
  "Marathi",
  "Tamil",
  "Urdu",
  "Gujarati",
  "Kannada",
  "Odia",
  "Malayalam",
  "Punjabi",
  "Assamese",
  "Maithili",
  "Sanskrit",
  "Konkani",
  "Nepali",
  "Sindhi",
  "Dogri",
  "Kashmiri",
  "Manipuri",
  "Santali",
  "Bodo",
  "Any Other",
];

// Indian States
const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// NEW: Options for the previously non-functional pickers
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const EDUCATION_OPTIONS = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Graduate",
  "Post Graduate",
  "Doctorate",
];
const YEAR_OPTIONS = Array.from({ length: 50 }, (_, i) =>
  String(new Date().getFullYear() - i),
);
const SOCIAL_CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "Other"];
const PWD_OPTIONS = ["Yes", "No"];
const INCOME_SRC_OPTIONS = [
  "Performing Arts",
  "Other Job",
  "Business",
  "Other",
];
const INCOME_RANGE_OPTIONS = [
  "Below 1 Lakh",
  "1-5 Lakh",
  "5-10 Lakh",
  "Above 10 Lakh",
];
const ID_PROOF_OPTIONS = [
  "Aadhar Card",
  "Voter ID",
  "Driving License",
  "PAN Card",
];

export default function EditBasicProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  // NEW: Generic single-select picker modal state
  const [activePickerField, setActivePickerField] = useState<string | null>(
    null,
  );
  const [activePickerOptions, setActivePickerOptions] = useState<string[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: { countryCode: "+91", number: "" },
    age: "",
    gender: "",
    // languages: [],
    languages: [] as string[],
    monthlyIncome: "",
    about: "",
    pwd: "",
    incomeSrc: "",
    socialCategory: "",
    idProof: { name: "", num: "" },
    address: { state: "", city: "", pincode: "", details: "" },
    aadharNumber: "",
    panNumber: "",
    upiId: "",
    passportNumber: null,
    highestEducation: "",
    yearOfCompletion: "",
    gstIn: "",
    anunalIncomeByPerf: "",
    numOfperformanceLastYear: "",
    handles: {
      instagram: "",
      facebook: "",
      youtube: "",
      linkedIn: "",
      website: "",
      twitter: "",
    },
  });


  interface UserData {
    role: string;
    profileCompleted: boolean;
    isVerified: boolean;
    name: string;
    email: string;
    isBlocked: boolean;
    isAproved: boolean;
    id: string;
    accessToken: string;
    refreshToken: string;
  }

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const userDataString = await AsyncStorage.getItem("userData");

      const userData: UserData | null = userDataString
        ? JSON.parse(userDataString)
        : null;

      const response = await fetch(
        `https://api.ekalakaar.com/api/v1/artists/profile/${userData?.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();

      if (response.ok && data.data) {
        const { personalInfo, otherInfo, address, socialLinks } = data.data;

        setFormData({
          firstName: personalInfo?.firstName || "",
          lastName: personalInfo?.lastName || "",
          email: personalInfo?.email || "",
          contactNumber: {
            countryCode: personalInfo?.contactNumber?.countryCode || "+91",
            number: personalInfo?.contactNumber?.number || "",
          },
          age: personalInfo?.age?.toString() || "",
          gender: personalInfo?.gender || "",
          languages: personalInfo?.languages || [],
          monthlyIncome: personalInfo?.monthlyIncome || "",
          about: personalInfo?.about || "",
          pwd: personalInfo?.pwd || "",
          incomeSrc: personalInfo?.incomeSrc || "",
          socialCategory: personalInfo?.socialCategory || "",
          idProof: otherInfo?.idProof || { name: "", num: "" },
          address: address || { state: "", city: "", pincode: "", details: "" },
          aadharNumber: otherInfo?.aadharNumber || "",
          panNumber: otherInfo?.panNumber || "",
          upiId: otherInfo?.upiId || "",
          passportNumber: otherInfo?.passportNumber || null,
          highestEducation: otherInfo?.highestEducation || "",
          yearOfCompletion: otherInfo?.yearOfCompletion || "",
          gstIn: otherInfo?.gstIn || "",
          anunalIncomeByPerf: otherInfo?.anunalIncomeByPerf || "",
          numOfperformanceLastYear: otherInfo?.lastYearPerfsCount || "",
          handles: socialLinks || {
            instagram: "",
            facebook: "",
            youtube: "",
            linkedIn: "",
            website: "",
            twitter: "",
          },
        });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load profile data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Pincode fetch
  const fetchPinData = async (pincode: string) => {
    if (pincode.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`,
        );
        const data = await response.json();

        if (data[0].Status === "Success") {
          setFormData((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              state: data[0].PostOffice[0].State,
              city: data[0].PostOffice[0].District,
            },
          }));
        } else {
          Alert.alert("Error", "Invalid PIN code");
        }
      } catch (error) {
        console.error("PIN fetch error:", error);
      }
    }
  };

  const handleUpdate = (field: string, value: any) => {
    setFormData((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");

        const p = parent as keyof typeof prev;
        const parentObj = prev[p] as any; // or Record<string, any>

        return {
          ...prev,
          [p]: {
            ...parentObj,
            [child]: value,
          },
        };
      }

      return {
        ...prev,
        [field]: value as any,
      };
    });
  };

  // NEW: Opens the generic picker modal for a given field + option list
  const openPicker = (field: string, options: string[]) => {
    setActivePickerField(field);
    setActivePickerOptions(options);
  };

  // Submit handler
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");

      // Prepare data
      const personalInfo = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        about: formData.about,
        age: parseInt(formData.age),
        contactNumber: formData.contactNumber,
        pwd: formData.pwd,
        email: formData.email,
        gender: formData.gender,
        monthlyIncome: formData.monthlyIncome,
        socialCategory: formData.socialCategory,
        incomeSrc: formData.incomeSrc,
        languages: formData.languages,
      };

      const otherInfo = {
        aadharNumber: formData.aadharNumber,
        panNumber: formData.panNumber,
        upiId: formData.upiId,
        numOfperformanceLastYear: formData.numOfperformanceLastYear,
        idProof: formData.idProof,
        gstIn: formData.gstIn,
        anunalIncomeByPerf: formData.anunalIncomeByPerf,
        yearOfCompletion: formData.yearOfCompletion,
        highestEducation: formData.highestEducation,
        passportNumber: formData.passportNumber,
      };

      const response = await fetch(
        "https://api.ekalakaar.com/api/v1/artists/profile",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: formData.address,
            personalInfo,
            otherInfo,
            socialLinks: formData.handles,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", data.message || "Failed to update profile");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.firstName) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.container}></View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Basic Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Personal Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              First Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.firstName}
              onChangeText={(text) => handleUpdate("firstName", text)}
              placeholder="Enter first name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Last Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.lastName}
              onChangeText={(text) => handleUpdate("lastName", text)}
              placeholder="Enter last name"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.email}
              editable={false}
              placeholder="Email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Contact Number <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.phoneContainer}>
              <TextInput
                style={[styles.input, styles.countryCode]}
                value={formData.contactNumber.countryCode}
                editable={false}
              />
              <TextInput
                style={[styles.input, styles.phoneNumber]}
                value={formData.contactNumber.number}
                onChangeText={(text) =>
                  handleUpdate("contactNumber.number", text)
                }
                placeholder="1234567890"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>
                Age <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => handleUpdate("age", text)}
                placeholder="Age"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>
                Gender <Text style={styles.required}>*</Text>
              </Text>
              {/* CHANGED: View -> TouchableOpacity, opens Gender picker */}
              <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => openPicker("gender", GENDER_OPTIONS)}
              >
                <Text style={styles.pickerText}>
                  {formData.gender || "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Languages Known <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.multiSelectContainer}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.multiSelectText}>
                {formData.languages.length > 0
                  ? formData.languages.join(", ")
                  : "Select languages"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADDRESS</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Pincode <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.address.pincode}
              onChangeText={(text) => {
                handleUpdate("address.pincode", text);
                fetchPinData(text);
              }}
              placeholder="Enter pincode"
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.address.state}
              editable={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={formData.address.city}
              editable={false}
            />
          </View>
        </View>

        {/* Other Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OTHER DETAILS</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Highest Education Qualification</Text>
            {/* CHANGED: View -> TouchableOpacity */}
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => openPicker("highestEducation", EDUCATION_OPTIONS)}
            >
              <Text style={styles.pickerText}>
                {formData.highestEducation || "Select"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Year of Completion</Text>
            {/* CHANGED: View -> TouchableOpacity */}
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => openPicker("yearOfCompletion", YEAR_OPTIONS)}
            >
              <Text style={styles.pickerText}>
                {formData.yearOfCompletion || "Select"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Social Category</Text>
            {/* CHANGED: View -> TouchableOpacity */}
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("socialCategory", SOCIAL_CATEGORY_OPTIONS)
              }
            >
              <Text style={styles.pickerText}>
                {formData.socialCategory || "Select"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Person With Disability (PwD)</Text>
            {/* CHANGED: View -> TouchableOpacity */}
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => openPicker("pwd", PWD_OPTIONS)}
            >
              <Text style={styles.pickerText}>{formData.pwd || "Select"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Primary Source Of Income</Text>
            {/* CHANGED: View -> TouchableOpacity */}
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => openPicker("incomeSrc", INCOME_SRC_OPTIONS)}
            >
              <Text style={styles.pickerText}>
                {formData.incomeSrc || "Select"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Annual Income from Performing Art (INR)
            </Text>
            {/* CHANGED: View -> TouchableOpacity */}
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() =>
                openPicker("anunalIncomeByPerf", INCOME_RANGE_OPTIONS)
              }
            >
              <Text style={styles.pickerText}>
                {formData.anunalIncomeByPerf || "Select"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Identity Proof</Text>
            {/* CHANGED: View -> TouchableOpacity */}
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => openPicker("idProof.name", ID_PROOF_OPTIONS)}
            >
              <Text style={styles.pickerText}>
                {formData.idProof.name || "Select"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID Proof Number</Text>
            <TextInput
              style={styles.input}
              value={formData.idProof.num}
              onChangeText={(text) => handleUpdate("idProof.num", text)}
              placeholder="Enter ID number"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>PAN Card</Text>
            <TextInput
              style={styles.input}
              value={formData.panNumber}
              onChangeText={(text) => handleUpdate("panNumber", text)}
              placeholder="Enter PAN number"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valid Passport</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {formData.passportNumber
                  ? new Date(formData.passportNumber).toLocaleDateString()
                  : "Select date"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={
                formData.passportNumber
                  ? new Date(formData.passportNumber)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  handleUpdate("passportNumber", selectedDate.toISOString());
                }
              }}
            />
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>UPI ID (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.upiId}
              onChangeText={(text) => handleUpdate("upiId", text)}
              placeholder="Enter UPI ID"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>GST IN</Text>
            <TextInput
              style={styles.input}
              value={formData.gstIn}
              onChangeText={(text) => handleUpdate("gstIn", text)}
              placeholder="Enter GST IN"
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Social Media Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SOCIAL MEDIA</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Instagram</Text>
            <TextInput
              style={styles.input}
              value={formData.handles.instagram}
              onChangeText={(text) => handleUpdate("handles.instagram", text)}
              placeholder="Instagram handle"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Facebook</Text>
            <TextInput
              style={styles.input}
              value={formData.handles.facebook}
              onChangeText={(text) => handleUpdate("handles.facebook", text)}
              placeholder="Facebook profile"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>YouTube</Text>
            <TextInput
              style={styles.input}
              value={formData.handles.youtube}
              onChangeText={(text) => handleUpdate("handles.youtube", text)}
              placeholder="YouTube channel"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>LinkedIn</Text>
            <TextInput
              style={styles.input}
              value={formData.handles.linkedIn}
              onChangeText={(text) => handleUpdate("handles.linkedIn", text)}
              placeholder="LinkedIn profile"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Website</Text>
            <TextInput
              style={styles.input}
              value={formData.handles.website}
              onChangeText={(text) => handleUpdate("handles.website", text)}
              placeholder="Website URL"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>X (Twitter)</Text>
            <TextInput
              style={styles.input}
              value={formData.handles.twitter}
              onChangeText={(text) => handleUpdate("handles.twitter", text)}
              placeholder="X handle"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT MY JOURNEY</Text>
          <TextInput
            style={styles.textArea}
            value={formData.about}
            onChangeText={(text) => handleUpdate("about", text)}
            placeholder="Tell us about your artistic journey..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* NEW: Generic single-select picker modal, reused by all the fields above */}
      <Modal
        visible={activePickerField !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActivePickerField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an option</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {activePickerOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => {
                    if (activePickerField) {
                      handleUpdate(activePickerField, option);
                    }
                    setActivePickerField(null);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setActivePickerField(null)}
            >
              <Text style={styles.modalCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language multi-select modal — ADD THIS NEW BLOCK */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Languages</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {LANGUAGES.map((lang) => {
                const isSelected = formData.languages.includes(lang);
                return (
                  <TouchableOpacity
                    key={lang}
                    style={styles.modalOption}
                    onPress={() => {
                      setFormData((prev) => {
                        const alreadySelected = prev.languages.includes(lang);
                        const updatedLanguages = alreadySelected
                          ? prev.languages.filter((l) => l !== lang)
                          : [...prev.languages, lang];
                        return { ...prev, languages: updatedLanguages };
                      });
                    }}
                  >
                    <View style={styles.checkboxRow}>
                      <Ionicons
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={20}
                        color={isSelected ? "#b91c1c" : "#999"}
                      />
                      <Text style={styles.modalOptionText}>{lang}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowLanguageModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    paddingTop: 48,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  required: {
    color: "#b91c1c",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  phoneContainer: {
    flexDirection: "row",
    gap: 8,
  },
  countryCode: {
    flex: 0.25,
  },
  phoneNumber: {
    flex: 0.75,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  pickerText: {
    fontSize: 14,
    color: "#333",
  },
  multiSelectContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    minHeight: 48,
  },
  multiSelectText: {
    fontSize: 14,
    color: "#333",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  datePickerText: {
    fontSize: 14,
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: "#b91c1c",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  // NEW: styles for the generic picker modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  modalOption: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionText: {
    fontSize: 14,
    color: "#333",
  },
  modalCloseBtn: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#b91c1c",
    fontWeight: "600",
  },
  //
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
