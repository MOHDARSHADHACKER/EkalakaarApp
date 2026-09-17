// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import React, { useEffect, useState } from "react";
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
// import { useRouter } from 'expo-router';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function Dashboard() {
//   const navigation = useNavigation();
//   const router = useRouter();

//   // State to hold numbers from APIs
//   const [stats, setStats] = useState({
//     opportunities: 0,
//     applied: 0,
//     performances: 0, // Placeholder if you have separate performance data
//     amount: 0,       // Placeholder
//   });

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   const fetchDashboardStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       if (!token) {
//         Alert.alert("Error", "No access token found, please login again");
//         return;
//       }

//       // Fetch Opportunities
//       const oppRes = await fetch(
//         "https://api.ekalakaar.com/api/v1/artists/opportunities",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const oppData = await oppRes.json();

//       // Fetch Applications
//       const appRes = await fetch(
//         "https://api.ekalakaar.com/api/v1/artists/applications",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const appData = await appRes.json();

//       // Calculate total applied applications and total amount (sample logic)
//       const appliedCount = appData?.data?.length || 0;
//       const totalAmount = (appData?.data ?? []).reduce(
//   (sum: number, item: any) => sum + (item.opportunity?.budget || 0),
//   0
// );

//       setStats({
//         opportunities: oppData?.data?.length || 0,
//         applied: appliedCount,
//         performances: 0, // Set this if you have a performances API/field
//         amount: totalAmount || 0,
//       });
//     } catch (err) {
//       Alert.alert("Error", "Failed to load dashboard stats.");
//     }
//   };

//   return (
//      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={22} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Dashboard</Text>
//         <View style={{ width: 22 }} />
//       </View>

//       <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
//         {/* Stats Row */}
//         <View style={styles.statsRow}>
//           <View style={styles.card}>
//             <Ionicons name="golf-outline" size={26} color="#b91c1c" />
//             <Text style={styles.cardValue}>{stats.opportunities}</Text>
//             <Text style={styles.cardLabel}>Opportunities</Text>
//           </View>
//           <View style={styles.card}>
//             <MaterialCommunityIcons name="file-check-outline" size={26} color="#b91c1c" />
//             <Text style={styles.cardValue}>{stats.applied}</Text>
//             <Text style={styles.cardLabel}>Applied</Text>
//           </View>
//           <View style={styles.card}>
//             <Ionicons name="star-outline" size={26} color="#b91c1c" />
//             <Text style={styles.cardValue}>{stats.performances}</Text>
//             <Text style={styles.cardLabel}>Performance</Text>
//           </View>
//           <View style={styles.card}>
//             <Ionicons name="cash-outline" size={26} color="#b91c1c" />
//             <Text style={styles.cardValue}>{stats.amount}</Text>
//             <Text style={styles.cardLabel}>Amount (INR)</Text>
//           </View>
//         </View>

//         {/* Explore Section */}
//         <View style={styles.exploreWrapper}>
//           <Text style={styles.exploreText}>Explore Opportunity</Text>
//         </View>

//         {/* Bottom Button */}
//         <TouchableOpacity onPress={() => router.push('/drawer/home')}
//           style={styles.bottomBtn}>
//           <Text style={styles.bottomBtnText}>Click here for more opportunity</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#b91c1c",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   headerTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 20,
//     marginHorizontal: 12,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: "#fff",
//     marginHorizontal: 4,
//     borderRadius: 12,
//     alignItems: "center",
//     paddingVertical: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   cardValue: { fontSize: 18, fontWeight: "700", color: "#b91c1c", marginTop: 6 },
//   cardLabel: { fontSize: 12, color: "#444", marginTop: 2, textAlign: "center" },
//   exploreWrapper: {
//     marginTop: 40,
//     alignItems: "center",
//   },
//   exploreText: { fontSize: 16, fontWeight: "700", color: "#b91c1c" },
//   bottomBtn: {
//     backgroundColor: "#b91c1c",
//     marginHorizontal: 40,
//     marginTop: 50,
//     paddingVertical: 12,
//     borderRadius: 25,
//     alignItems: "center",
//   },
//   bottomBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
// });

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../src/services/api";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const navigation = useNavigation();
  const router = useRouter();

  const [stats, setStats] = useState({
    opportunities: 0,
    applied: 0,
    performances: 0,
    amount: 0,
  });

  const [selectedMonth, setSelectedMonth] = useState("2 Months");
  const [latestOpportunity, setLatestOpportunity] = useState<any>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // const fetchDashboardStats = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("accessToken");
  //     if (!token) {
  //       Alert.alert("Error", "No access token found, please login again");
  //       return;
  //     }

  //     // Fetch Opportunities
  //     const oppRes = await fetch(
  //       "https://api.ekalakaar.com/api/v1/artists/opportunities",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     const oppData = await oppRes.json();

  //     // Fetch Applications
  //     const appRes = await fetch(
  //       "https://api.ekalakaar.com/api/v1/artists/applications",
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     const appData = await appRes.json();

  //     const appliedCount = appData?.data?.length || 0;
  //     const totalAmount = (appData?.data ?? []).reduce(
  //       (sum: number, item: any) => sum + (item.opportunity?.budget || 0),
  //       0
  //     );

  //     setStats({
  //       opportunities: oppData?.data?.length || 0,
  //       applied: appliedCount,
  //       performances: 0,
  //       amount: totalAmount || 0,
  //     });

  //     // Set latest opportunity for preview
  //     if (oppData?.data && oppData.data.length > 0) {
  //       setLatestOpportunity(oppData.data[0]);
  //     }
  //   } catch (err) {
  //     Alert.alert("Error", "Failed to load dashboard stats.");
  //   }
  // };

  const fetchDashboardStats = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No access token found, please login again");
        return;
      }

      // Opportunities & applications parallel me fetch karo
      const [oppRes, appRes] = await Promise.all([
        api.get("/artists/opportunities"),
        api.get("/artists/applications"),
      ]);

      const oppData = oppRes.data;
      const appData = appRes.data;

      const appliedCount = appData?.data?.length || 0;
      const totalAmount = (appData?.data ?? []).reduce(
        (sum: number, item: any) => sum + (item.opportunity?.budget || 0),
        0,
      );

      setStats({
        opportunities: oppData?.data?.length || 0,
        applied: appliedCount,
        performances: 0,
        amount: totalAmount || 0,
      });

      if (oppData?.data && oppData.data.length > 0) {
        setLatestOpportunity(oppData.data[0]);
      }
    } catch (err: any) {
      console.log("Dashboard stats error:", err?.response?.data || err);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to load dashboard stats.",
      );
    }
  };
  const monthButtons = ["2 Months", "4 Months", "6 Months", "12 Months"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Curved Header with Stats */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Ionicons name="briefcase-outline" size={28} color="#b91c1c" />
              <Text style={styles.statValue}>{stats.opportunities}</Text>
              <Text style={styles.statLabel}>Opportunities</Text>
            </View>
            <View style={styles.statCard}>
              <MaterialCommunityIcons
                name="file-check-outline"
                size={28}
                color="#b91c1c"
              />
              <Text style={styles.statValue}>{stats.applied}</Text>
              <Text style={styles.statLabel}>Applied</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={28} color="#b91c1c" />
              <Text style={styles.statValue}>{stats.performances}</Text>
              <Text style={styles.statLabel}>Performance</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="wallet-outline" size={28} color="#b91c1c" />
              <Text style={styles.statValue}>{stats.amount}</Text>
              <Text style={styles.statLabel}>Amount (INR)</Text>
            </View>
          </View>
        </View>

        {/* Opportunities Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Opportunities</Text>
            <View style={styles.chartInfo}>
              <Text style={styles.chartNumber}>15</Text>
              <Text style={styles.chartSubtext}>+32.40%</Text>
              <Text style={styles.chartLabel}>Opportunities</Text>
            </View>
          </View>

          <LineChart
            data={{
              labels: ["", "", "", "", "", ""],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43, 50],
                },
              ],
            }}
            width={width - 40}
            height={180}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#2563eb",
              },
            }}
            bezier
            style={styles.chart}
          />

          {/* Month Filter Buttons */}
          <View style={styles.monthButtons}>
            {monthButtons.map((month) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthBtn,
                  selectedMonth === month && styles.monthBtnActive,
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <Text
                  style={[
                    styles.monthBtnText,
                    selectedMonth === month && styles.monthBtnTextActive,
                  ]}
                >
                  {month}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Explore Opportunity Section */}
        <View style={styles.exploreSection}>
          <Text style={styles.exploreTitleMain}>Explore Opportunity</Text>

          {latestOpportunity && (
            <View style={styles.opportunityCard}>
              <Text style={styles.oppTitle}>
                {latestOpportunity.purpose || "Cultural Opportunity"}
              </Text>

              <View style={styles.oppDetail}>
                <Ionicons name="location-outline" size={16} color="#b91c1c" />
                <Text style={styles.oppLabel}>Location of Performance</Text>
                <Text style={styles.oppValue}>
                  {latestOpportunity.location}
                </Text>
              </View>

              <View style={styles.oppDetail}>
                <Ionicons name="language-outline" size={16} color="#b91c1c" />
                <Text style={styles.oppLabel}>Language</Text>
                <Text style={styles.oppValue}>
                  {Array.isArray(latestOpportunity.languages)
                    ? latestOpportunity.languages.join(", ")
                    : latestOpportunity.languages}
                </Text>
              </View>

              <View style={styles.oppDetail}>
                <Ionicons name="cash-outline" size={16} color="#b91c1c" />
                <Text style={styles.oppLabel}>Amount</Text>
                <Text style={styles.oppValue}>
                  {latestOpportunity.budget} INR
                </Text>
              </View>

              <View style={styles.oppDetail}>
                <Ionicons name="calendar-outline" size={16} color="#b91c1c" />
                <Text style={styles.oppLabel}>Date of Performance</Text>
                <Text style={styles.oppValue}>
                  {new Date(
                    latestOpportunity.performanceDate,
                  ).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.oppDetail}>
                <Ionicons name="time-outline" size={16} color="#b91c1c" />
                <Text style={styles.oppLabel}>Application Due Date</Text>
                <Text style={styles.oppValue}>
                  {new Date(
                    latestOpportunity.applicationPeriod?.end,
                  ).toLocaleDateString()}
                </Text>
              </View>

              <View style={styles.oppButtons}>
                <TouchableOpacity
                  style={styles.moreInfoBtn}
                  onPress={() =>
                    (navigation as any).navigate("MoreInformation", {
                      item: JSON.stringify(latestOpportunity),
                    })
                  }
                >
                  <Text style={styles.moreInfoText}>More Information</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyNowBtn}
                  onPress={() =>
                    (navigation as any).navigate("ApplyScreen", {
                      item: JSON.stringify(latestOpportunity),
                    })
                  }
                >
                  <Text style={styles.applyNowText}>Apply Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.redBtn}
            onPress={() => router.push("/drawer/home")}
          >
            <Text style={styles.redBtnText}>
              Click here for more opportunity
            </Text>
          </TouchableOpacity>
        </View>

        {/* Explore Skill Development */}
        <View style={styles.skillSection}>
          <Text style={styles.exploreTitleMain}>Explore Skill Development</Text>
          <View style={styles.skillCard}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
              }}
              style={styles.skillImage}
            />
            <View style={styles.skillOverlay}>
              <Text style={styles.skillText}>Western Song</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.redBtn}
            onPress={() => router.push("/drawer/skill-development")}
          >
            <Text style={styles.redBtnText}>
              Click here for skills Development
            </Text>
          </TouchableOpacity>
        </View>

        {/* Explore News */}
        <View style={styles.newsSection}>
          <Text style={styles.exploreTitleMain}>Explore News</Text>
          <View style={styles.newsCard}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
              }}
              style={styles.newsImage}
            />
            <View style={styles.newsOverlay}>
              <Text style={styles.newsText}>
                Jonathan Buckmaster's picture shows England fans reacting to a
                missed goal...
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.redBtn}
            onPress={() => router.push("/drawer/news-update")}
          >
            <Text style={styles.redBtnText}>Click here for latest news</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#b91c1c",
    paddingTop: 20,
    paddingBottom: 100,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    width: (width - 64) / 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#b91c1c",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  chartSection: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginTop: -60,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#b91c1c",
  },
  chartInfo: {
    alignItems: "flex-end",
  },
  chartNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  chartSubtext: {
    fontSize: 12,
    color: "#22c55e",
  },
  chartLabel: {
    fontSize: 10,
    color: "#999",
  },
  chart: {
    marginVertical: 8,
    marginHorizontal: -15,
    borderRadius: 16,
  },
  monthButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  monthBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  monthBtnActive: {
    backgroundColor: "#b91c1c",
    borderColor: "#b91c1c",
  },
  monthBtnText: {
    fontSize: 12,
    color: "#666",
  },
  monthBtnTextActive: {
    color: "#fff",
  },
  exploreSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  exploreTitleMain: {
    fontSize: 18,
    fontWeight: "700",
    color: "#b91c1c",
    textAlign: "center",
    marginBottom: 20,
  },
  opportunityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  oppTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#b91c1c",
    marginBottom: 12,
    textAlign: "center",
  },
  oppDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  oppLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  oppValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },
  oppButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  moreInfoBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#b91c1c",
    borderRadius: 8,
    paddingVertical: 10,
    marginRight: 8,
    alignItems: "center",
  },
  moreInfoText: {
    color: "#b91c1c",
    fontWeight: "600",
    fontSize: 13,
  },
  applyNowBtn: {
    flex: 1,
    backgroundColor: "#b91c1c",
    borderRadius: 8,
    paddingVertical: 10,
    marginLeft: 8,
    alignItems: "center",
  },
  applyNowText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  redBtn: {
    backgroundColor: "#b91c1c",
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  redBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  skillSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  skillCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
    marginBottom: 16,
  },
  skillImage: {
    width: "100%",
    height: "100%",
  },
  skillOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
  },
  skillText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  newsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  newsCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
    marginBottom: 16,
  },
  newsImage: {
    width: "100%",
    height: "100%",
  },
  newsOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 16,
  },
  newsText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});
