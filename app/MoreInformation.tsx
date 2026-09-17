// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useLocalSearchParams } from "expo-router";
// import React from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function MoreInformation() {
//   const navigation = useNavigation();
//   const params = useLocalSearchParams();
//   const item = params.item ? JSON.parse(params.item as string) : {};

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="arrow-back" size={24} color="#333" />
//           </TouchableOpacity>
//         </View>

//         {/* Title Section */}
//         <View style={styles.titleSection}>
//           <Text style={styles.title}>{item.title || "Opportunity Title"}</Text>
          
//           <View style={styles.actionButtons}>
//             <TouchableOpacity style={styles.saveBtn}>
//               <Text style={styles.saveBtnText}>Save</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.shareBtn}>
//               <Text style={styles.shareBtnText}>Share</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Meta Information */}
//         <View style={styles.metaSection}>
//           <Text style={styles.metaText}>Category: {item.artCategory || "N/A"}</Text>
//           <Text style={styles.metaText}>
//             Posted On: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
//           </Text>
//           <Text style={styles.metaText}>
//             Due Date: {item.applicationPeriod?.[1] ? new Date(item.applicationPeriod[1]).toLocaleDateString() : "N/A"}
//           </Text>
//           <Text style={styles.metaText}>Opening: {item.openings || "N/A"}</Text>
//         </View>

//         {/* Description */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Description</Text>
//           <Text style={styles.descriptionText}>
//             {item.description || "No description available."}
//           </Text>
//         </View>

//         {/* Roles, Skills and Other Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Roles, Skills and Other Information</Text>
          
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
//             <Text style={styles.detailLabel}>Theme:</Text>
//             <Text style={styles.detailValue}>{item.theme || "No"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Performance Time:</Text>
//             <Text style={styles.detailValue}>{item.performanceTime || "Night"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Duration of Performance:</Text>
//             <Text style={styles.detailValue}>{item.duration || item.performanceDuration || "20 Minutes"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Nature of Art:</Text>
//             <Text style={styles.detailValue}>{item.artCategory || "Dance"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Performance Type:</Text>
//             <Text style={styles.detailValue}>{item.performanceType || "Solo"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Live / Recorded:</Text>
//             <Text style={styles.detailValue}>{item.liveRecorded || item.performanceMode || "Live"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Level of Artist:</Text>
//             <Text style={styles.detailValue}>{item.artistLevel || "Professional"}</Text>
//           </View>

//           <View style={styles.detailRow}>
//             <Text style={styles.detailLabel}>Posted By:</Text>
//             <Text style={styles.detailValue}>{item.postedBy || item.organizerName || "Random Username"}</Text>
//           </View>
//         </View>

//         {/* Perks and Benefits */}
//         {item.perks && item.perks.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Perks and Benefits</Text>
//             <View style={styles.perksContainer}>
//               {item.perks.map((perk: string, index: number) => (
//                 <View key={index} style={styles.perkBadge}>
//                   <Text style={styles.perkText}>{perk}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Apply Button */}
//         <View style={styles.bottomSection}>
//           <TouchableOpacity
//             style={styles.applyBtn}
//             onPress={() => (navigation as any).navigate("ApplyScreen", { item: JSON.stringify(item) })}
//           >
//             <Text style={styles.applyBtnText}>Apply Now</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.backBtn}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.backBtnText}>Back</Text>
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
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#b91c1c",
//     marginBottom: 16,
//     lineHeight: 28,
//   },
//   actionButtons: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   saveBtn: {
//     backgroundColor: "#b91c1c",
//     paddingHorizontal: 32,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   saveBtnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   shareBtn: {
//     borderColor: "#b91c1c",
//     borderWidth: 1.5,
//     paddingHorizontal: 28,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   shareBtnText: {
//     color: "#b91c1c",
//     fontWeight: "600",
//     fontSize: 15,
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
//   detailRow: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: "#333",
//     width: 180,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: "#000",
//     fontWeight: "600",
//     flex: 1,
//   },
//   perksContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 10,
//   },
//   perkBadge: {
//     borderColor: "#ddd",
//     borderWidth: 1,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   perkText: {
//     fontSize: 13,
//     color: "#333",
//   },
//   bottomSection: {
//     paddingHorizontal: 16,
//     paddingBottom: 30,
//     paddingTop: 10,
//   },
//   applyBtn: {
//     backgroundColor: "#b91c1c",
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   applyBtnText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   backBtn: {
//     alignItems: "center",
//     paddingVertical: 12,
//   },
//   backBtnText: {
//     color: "#333",
//     fontSize: 15,
//     fontWeight: "600",
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import { Share } from "react-native";
import { useNavigation, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreInformation() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item as string) : {};

const shareHandler = async () => {
  try {
    const message = `
✨ *${item.purpose || item.title || "Opportunity"}* ✨

📜 Description:
${item.description || "No description available."}

📍 Location: ${item.location || "N/A"}
💰 Budget: ${item.budget ? `₹${item.budget.toLocaleString('en-IN')}` : "N/A"}
📅 Due Date: ${item.applicationPeriod?.end ? new Date(item.applicationPeriod.end).toLocaleDateString() : "N/A"}

👉 Check out more details in the app!
`;

    await Share.share({
      message,
    });
  } catch (error) {
    alert("Failed to share the opportunity. Please try again.");
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

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{item.purpose || item.title || "Opportunity Title"}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
           <TouchableOpacity style={styles.shareBtn} onPress={shareHandler}>
  <Text style={styles.shareBtnText}>Share</Text>
</TouchableOpacity>

          </View>
        </View>

        {/* Meta Information */}
        <View style={styles.metaSection}>
          <Text style={styles.metaText}>Category: {item.artForm || item.artCategory || "N/A"}</Text>
          <Text style={styles.metaText}>
            Posted On: {item.applicationPeriod?.start ? new Date(item.applicationPeriod.start).toLocaleDateString() : "N/A"}
          </Text>
          <Text style={styles.metaText}>
            Due Date: {item.applicationPeriod?.end ? new Date(item.applicationPeriod.end).toLocaleDateString() : "N/A"}
          </Text>
          <Text style={styles.metaText}>Opening: {item.numberOfOpenings || "N/A"}</Text>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {item.description || "No description available."}
          </Text>
        </View>

        {/* Roles, Skills and Other Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Roles, Skills and Other Information</Text>
          
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
            <Text style={styles.detailLabel}>Theme:</Text>
            <Text style={styles.detailValue}>{item.theme || "No"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Performance Time:</Text>
            <Text style={styles.detailValue}>{item.performanceTime || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration of Performance:</Text>
            <Text style={styles.detailValue}>{item.performanceDuration || item.duration || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Performance Date:</Text>
            <Text style={styles.detailValue}>
              {item.performanceDate ? new Date(item.performanceDate).toLocaleDateString() : "N/A"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Performance Type:</Text>
            <Text style={styles.detailValue}>{item.performanceType || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Live / Recorded:</Text>
            <Text style={styles.detailValue}>{item.performanceMode || item.liveRecorded || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Level of Artist:</Text>
            <Text style={styles.detailValue}>{item.experienceLevel || item.artistLevel || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Posted By:</Text>
            <Text style={styles.detailValue}>{item.organizer?.name || item.postedBy || "N/A"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Number of Openings:</Text>
            <Text style={styles.detailValue}>{item.numberOfOpenings || "N/A"}</Text>
          </View>
        </View>

        {/* Perks and Benefits */}
        {item.perks && item.perks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Perks and Benefits</Text>
            <View style={styles.perksContainer}>
              {item.perks.map((perk: string, index: number) => (
                <View key={index} style={styles.perkBadge}>
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Apply Button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={() => (navigation as any).navigate("ApplyScreen", { item: JSON.stringify(item) })}
          >
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Back</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: 16,
    lineHeight: 28,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  saveBtn: {
    backgroundColor: "#b91c1c",
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  shareBtn: {
    borderColor: "#b91c1c",
    borderWidth: 1.5,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shareBtnText: {
    color: "#b91c1c",
    fontWeight: "600",
    fontSize: 15,
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
  detailRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: "#333",
    width: 180,
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    flex: 1,
  },
  perksContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  perkBadge: {
    borderColor: "#ddd",
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  perkText: {
    fontSize: 13,
    color: "#333",
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 10,
  },
  applyBtn: {
    backgroundColor: "#b91c1c",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  applyBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backBtn: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backBtnText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },
});