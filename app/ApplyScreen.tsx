// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation, useLocalSearchParams } from "expo-router";
// import React, { useState } from "react";
// import {
//   Alert,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function ApplyScreen() {
//   const navigation = useNavigation();
//   const params = useLocalSearchParams();
//   const item = params.item ? JSON.parse(params.item as string) : {};
//   const [applicationText, setApplicationText] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Debug: Log the item data to see what fields are available
//   console.log("ApplyScreen - Item data:", JSON.stringify(item, null, 2));

//   const handleSubmit = async () => {
//     if (!applicationText.trim()) {
//       Alert.alert("Required", "Please explain why you want to apply for this role.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       if (!token) {
//         Alert.alert("Error", "No access token found, please login again");
//         setIsSubmitting(false);
//         return;
//       }

//       const response = await fetch(
//         "https://api.ekalakaar.com/api/v1/artists/applications",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             opportunityId: item._id,
//             message: applicationText,
//           }),
//         }
//       );

//       const data = await response.json();
//       setIsSubmitting(false);

//       if (response.ok) {
//         Alert.alert(
//           "Success",
//           data.message || "Application submitted successfully!",
//           [
//             {
//               text: "OK",
//               onPress: () => navigation.goBack(),
//             },
//           ]
//         );
//       } else {
//         Alert.alert("Error", data.message || "Failed to submit application.");
//       }
//     } catch (err) {
//       setIsSubmitting(false);
//       Alert.alert("Error", "Something went wrong while submitting your application.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//         </View>

//         {/* Title */}
//         <View style={styles.titleSection}>
//           <Text style={styles.title}>{item.title || "Opportunity Title"}</Text>
//         </View>

//         {/* Meta Information */}
//         <View style={styles.metaSection}>
//           <Text style={styles.metaText}>
//             Posted On: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
//           </Text>
//           <Text style={styles.metaText}>
//             Last Date to Apply: {item.applicationPeriod?.[1] ? new Date(item.applicationPeriod[1]).toLocaleDateString() : "N/A"}
//           </Text>
//         </View>

//         {/* Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Description</Text>
//           <Text style={styles.descriptionText}>
//             {item.description || "No description available."}
//           </Text>
//         </View>

//         {/* Other Details */}
//         <View style={styles.section}>
//           <View style={styles.detailsHeader}>
//             <Text style={styles.sectionTitle}>Other Details</Text>
//             <TouchableOpacity
//               onPress={() => (navigation as any).navigate("MoreInformation", { item: JSON.stringify(item) })}
//             >
//               <Text style={styles.viewAllLink}>view all info</Text>
//             </TouchableOpacity>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Nature of art:</Text>
//             <Text style={styles.detailValue}>{item.artName || item.artCategory || "N/A"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Expertise:</Text>
//             <Text style={styles.detailValue}>{item.expertise || "Acting, Dancing, Time Management"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Location:</Text>
//             <Text style={styles.detailValue}>{item.location || "N/A"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Language:</Text>
//             <Text style={styles.detailValue}>{item.languages || "N/A"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Amount:</Text>
//             <Text style={styles.detailValue}>{item.budget ? `${item.budget} INR` : "N/A"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Required Artist:</Text>
//             <Text style={styles.detailValue}>{item.numberOfOpenings || item.openings || "5"}</Text>
//           </View>
//         </View>

//         {/* Application Question */}
//         <View style={styles.section}>
//           <Text style={styles.questionTitle}>Why do you want at Apply for this Role?</Text>
//           <TextInput
//             style={styles.textArea}
//             placeholder="Enter your response here..."
//             placeholderTextColor="#999"
//             multiline
//             numberOfLines={6}
//             textAlignVertical="top"
//             value={applicationText}
//             onChangeText={setApplicationText}
//           />
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.bottomSection}>
//           <TouchableOpacity
//             style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
//             onPress={handleSubmit}
//             disabled={isSubmitting}
//           >
//             <Text style={styles.submitBtnText}>
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.cancelBtn}
//             onPress={() => navigation.goBack()}
//             disabled={isSubmitting}
//           >
//             <Text style={styles.cancelBtnText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   titleSection: {
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#b91c1c",
//     lineHeight: 28,
//   },
//   metaSection: {
//     paddingHorizontal: 16,
//     marginBottom: 20,
//   },
//   metaText: {
//     fontSize: 13,
//     color: "#333",
//     marginBottom: 4,
//   },
//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#222",
//     marginBottom: 12,
//   },
//   descriptionText: {
//     fontSize: 14,
//     color: "#555",
//     lineHeight: 22,
//     textAlign: "justify",
//   },
//   detailsHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   viewAllLink: {
//     fontSize: 13,
//     color: "#b91c1c",
//     textDecorationLine: "underline",
//   },
//   detailRow: {
//     flexDirection: "row",
//     marginBottom: 8,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: "#333",
//     width: 130,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: "#000",
//     fontWeight: "600",
//     flex: 1,
//   },
//   questionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#222",
//     marginBottom: 12,
//   },
//   textArea: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 14,
//     color: "#333",
//     minHeight: 140,
//     backgroundColor: "#fafafa",
//   },
//   bottomSection: {
//     paddingHorizontal: 16,
//     paddingBottom: 30,
//     paddingTop: 10,
//   },
//   submitBtn: {
//     backgroundColor: "#b91c1c",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   submitBtnDisabled: {
//     backgroundColor: "#d1a3a3",
//   },
//   submitBtnText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   cancelBtn: {
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   cancelBtnText: {
//     color: "#333",
//     fontSize: 15,
//     fontWeight: "600",
//   },
// });



import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../src/services/api";

export default function ApplyScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item as string) : {};
  const [quotedPrice, setQuotedPrice] = useState("");
  const [applicationText, setApplicationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug: Log the item data to see what fields are available
  console.log("ApplyScreen - Item data:", JSON.stringify(item, null, 2));

  // const handleSubmit = async () => {
  //   if (!applicationText.trim()) {
  //     Alert.alert("Required", "Please explain why you want to apply for this opportunity.");
  //     return;
  //   }

  //   if (!quotedPrice.trim()) {
  //     Alert.alert("Required", "Please enter your quoted price.");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   try {
  //     const token = await AsyncStorage.getItem("accessToken");
  //     if (!token) {
  //       Alert.alert("Error", "No access token found, please login again");
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     const response = await fetch(
  //       `https://api.ekalakaar.com/api/v1/artists/applications/${item._id}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           quotedPrice: quotedPrice,
  //           answer: applicationText,
  //         }),
  //       }
  //     );

  //     const data = await response.json();
  //     setIsSubmitting(false);

  //     if (response.ok && data.status === "success") {
  //       Alert.alert(
  //         "Success",
  //         "Successfully applied!",
  //         [
  //           {
  //             text: "OK",
  //             onPress: () => navigation.goBack(),
  //           },
  //         ]
  //       );
  //       setQuotedPrice("");
  //       setApplicationText("");
  //     } else {
  //       Alert.alert("Error", data.message || "Failed to submit application.");
  //     }
  //   } catch (err) {
  //     setIsSubmitting(false);
  //     Alert.alert("Error", "Something went wrong while submitting your application.");
  //     console.error("Application error:", err);
  //   }
  // };


  const handleSubmit = async () => {
  if (!applicationText.trim()) {
    Alert.alert(
      "Required",
      "Please explain why you want to apply for this opportunity."
    );
    return;
  }

  if (!quotedPrice.trim()) {
    Alert.alert("Required", "Please enter your quoted price.");
    return;
  }

  setIsSubmitting(true);
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      Alert.alert("Error", "No access token found, please login again");
      setIsSubmitting(false);
      return;
    }

    const response = await api.post(
      `/artists/applications/${item._id}`,
      {
        quotedPrice: quotedPrice,
        answer: applicationText,
      }
    );

    const data = response.data;
    setIsSubmitting(false);

    if (data?.status === "success") {
      Alert.alert("Success", "Successfully applied!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
      setQuotedPrice("");
      setApplicationText("");
    } else {
      Alert.alert("Error", data?.message || "Failed to submit application.");
    }
  } catch (err: any) {
    setIsSubmitting(false);
    console.error("Application error:", err?.response?.data || err);
    Alert.alert(
      "Error",
      err?.response?.data?.message ||
        "Something went wrong while submitting your application."
    );
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{item.purpose || item.title || "Opportunity Title"}</Text>
        </View>

        {/* Meta Information */}
        <View style={styles.metaSection}>
          <Text style={styles.metaText}>
            Posted On: {item.applicationPeriod?.start ? new Date(item.applicationPeriod.start).toLocaleDateString() : "N/A"}
          </Text>
          <Text style={styles.metaText}>
            Last Date to Apply: {item.applicationPeriod?.end ? new Date(item.applicationPeriod.end).toLocaleDateString() : "N/A"}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {item.description || "No description available."}
          </Text>
        </View>

        {/* Other Details */}
        <View style={styles.section}>
          <View style={styles.detailsHeader}>
            <Text style={styles.sectionTitle}>Other Details</Text>
            <TouchableOpacity
              onPress={() => (navigation as any).navigate("MoreInformation", { item: JSON.stringify(item) })}
            >
              <Text style={styles.viewAllLink}>view all info</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nature of art:</Text>
            <Text style={styles.detailValue}>{item.artForm || item.artName || item.artCategory || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expertise:</Text>
            <Text style={styles.detailValue}>{item.skills?.join(", ") || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{item.location || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Language:</Text>
            <Text style={styles.detailValue}>
              {Array.isArray(item.languages) ? item.languages.join(", ") : item.languages || "N/A"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>{item.budget ? `${item.budget} INR` : "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Required Artist:</Text>
            <Text style={styles.detailValue}>{item.numberOfOpenings || "N/A"}</Text>
          </View>
        </View>

        {/* Application Form */}
        <View style={styles.section}>
          <Text style={styles.questionTitle}>My Quoted Price</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Enter your quoted price"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={quotedPrice}
            onChangeText={setQuotedPrice}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.questionTitle}>Why do you want to apply for this opportunity?</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter your response here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={applicationText}
            onChangeText={setApplicationText}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#b91c1c",
    lineHeight: 28,
  },
  metaSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  metaText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    textAlign: "justify",
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllLink: {
    fontSize: 13,
    color: "#b91c1c",
    textDecorationLine: "underline",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#333",
    width: 130,
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    minHeight: 140,
    backgroundColor: "#fafafa",
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 10,
  },
  submitBtn: {
    backgroundColor: "#b91c1c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  submitBtnDisabled: {
    backgroundColor: "#d1a3a3",
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },
});