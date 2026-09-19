import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomTabBar from "../../components/BottomTabBar";
import api from "../../src/services/api";

import image from "../../assets/images/image.png";
// Tabs exactly like web
const tabs = ["Saved", "Applied", "In Progress", "Hired", "Declined"];

// Map tab names to backend status strings
const statusMap: { [key: string]: string } = {
  Applied: "Applied",
  "In Progress": "In-Progress",
  Hired: "Hired",
  Declined: "Rejected",
};

// Single detail row component
const EventDetailRow = ({
  iconName,
  label,
  value,
}: {
  iconName: any;
  label: string;
  value: string | undefined;
}) => {
  const IconComponent = [
    "star-outline",
    "cash",
    "calendar",
    "clock-outline",
  ].includes(iconName)
    ? MaterialCommunityIcons
    : Ionicons;

  return (
    <View style={cardStyles.detailRow}>
      <View style={cardStyles.detailLeft}>
        <IconComponent name={iconName} size={16} color="#b91c1c" />
        <Text style={cardStyles.detailLabel}>{label}</Text>
      </View>
      <Text style={cardStyles.detailValue} numberOfLines={1}>
        {value || "N/A"}
      </Text>
    </View>
  );
};

// Application card component showing opportunity details
const ApplicationCard = ({ item, router, activeTab }: any) => {
  // Saved applications me direct item properties use karne hain
  const dataSource = item.opportunity ? item.opportunity : item;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  let languageDisplay = "N/A";
  if (dataSource.languages) {
    if (Array.isArray(dataSource.languages)) {
      languageDisplay = dataSource.languages.join(", ");
    } else {
      languageDisplay = String(dataSource.languages);
    }
  }

  let amountDisplay = "N/A";
  if (dataSource.budget !== undefined && dataSource.budget !== null) {
    const val =
      typeof dataSource.budget === "object" && dataSource.budget.amount
        ? dataSource.budget.amount
        : dataSource.budget;
    amountDisplay = `${Number(val).toLocaleString("en-IN")} INR`;
  }

  const performanceDate = dataSource.performanceDate
    ? formatDate(dataSource.performanceDate)
    : "Full Day Event";
  const dueDate = dataSource.applicationPeriod
    ? formatDate(
        dataSource.applicationPeriod?.end || dataSource.applicationPeriod?.[1],
      )
    : "";

  // 'appliedAt' ya 'createdAt' mostly nahi aayega saved data me, to optional fallback
  const appliedDate = formatDate(item.appliedAt || item.createdAt);

  return (
    <View style={cardStyles.card}>
      <Text style={cardStyles.title}>
        {dataSource.purpose ||
          dataSource.title ||
          dataSource.artCategory ||
          "Untitled Event"}
      </Text>
      <Text style={cardStyles.description}>
        {dataSource.description
          ? dataSource.description.length > 100
            ? dataSource.description.substring(0, 100) + "..."
            : dataSource.description
          : "No description available"}
      </Text>

      <View style={cardStyles.separator} />

      <View style={cardStyles.detailsContainer}>
        <EventDetailRow
          iconName="star-outline"
          label="Nature of Art"
          value={dataSource.artName || dataSource.artCategory || "Kathak"}
        />
        <EventDetailRow
          iconName="location-outline"
          label="Location of Performance"
          value={dataSource.location || dataSource.city || "India"}
        />
        <EventDetailRow
          iconName="chatbubble-outline"
          label="Language"
          value={languageDisplay}
        />
        <EventDetailRow iconName="cash" label="Amount" value={amountDisplay} />
        <EventDetailRow
          iconName="calendar"
          label="Date of Performance"
          value={performanceDate}
        />
        <EventDetailRow
          iconName="clock-outline"
          label="Application Due Date"
          value={dueDate}
        />
      </View>

      <View style={cardStyles.footer}>
        <TouchableOpacity
          style={cardStyles.moreInfoBtn}
          onPress={() =>
            router.push({
              pathname: "/MoreInformation",
              params: { item: JSON.stringify(dataSource) },
            })
          }
        >
          <Text style={cardStyles.moreInfoText}>More Information</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Empty list message component
const EmptyListMessage = ({
  activeTab,
  router,
}: {
  activeTab: string;
  router: any;
}) => {
  let description = "No applications found.";
  switch (activeTab) {
    case "Saved":
      description = "You haven’t saved any event application";
      break;
    case "Applied":
      description = "You haven’t applied for any event application";
      break;
    case "In Progress":
      description = "There is no In Progress events application";
      break;
    case "Hired":
      description = "You haven't been hired for any events yet";
      break;
    case "Declined":
      description = "No applications have been declined";
      break;
  }

  return (
    <View style={styles.emptyWrapper}>
      {/* <View style={cardStyles.customPlaceholder} /> */}
      <Image
        source={image}
        style={cardStyles.customPlaceholder}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>Oops!</Text>
      <Text style={styles.emptyDesc}>{description}</Text>
      <TouchableOpacity
        onPress={() => router.push("/drawer/home")}
        style={styles.ctaBtn}
      >
        <Text style={styles.ctaText}>View Events</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main Applications screen component
export default function Applications() {
  const navigation = useNavigation();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Saved");
  const [search, setSearch] = useState("");
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [savedApplications, setSavedApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
    fetchSavedApplications();
  }, []);

  // Fetch all applications for normal tabs except Saved
  // const fetchApplications = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("accessToken");
  //     if (!token) return;

  //     const response = await fetch(
  //       "https://api.ekalakaar.com/api/v1/artists/applications",
  //       { headers: { Authorization: `Bearer ${token}` } },
  //     );
  //     const json = await response.json();
  //     setAllApplications(json?.data ?? []);
  //   } catch (error) {
  //     console.log("Fetch error:", error);
  //     setAllApplications([]);
  //   }
  // };

  const fetchApplications = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "Please login again");
        setAllApplications([]);
        return;
      }

      // fetch + manual headers ki jagah api.get
      const response = await api.get("/artists/applications");
      const json = response.data;

      setAllApplications(json?.data ?? []);
    } catch (error: any) {
      console.log("Fetch applications error:", error?.response?.data || error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch applications",
      );
      setAllApplications([]);
    }
  };

  // Fetch saved applications separately
  // const fetchSavedApplications = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("accessToken");
  //     if (!token) return;

  //     const response = await fetch(
  //       "https://api.ekalakaar.com/api/v1/artists/saved-opportunities",
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );
  //     const json = await response.json();

  //     console.log("Saved API response:", JSON.stringify(json, null, 2));

  //     setSavedApplications(json?.data ?? []);
  //   } catch (error) {
  //     console.log("Fetch saved error:", error);
  //     setSavedApplications([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchSavedApplications = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "Please login again");
        setSavedApplications([]);
        setLoading(false);
        return;
      }

      const response = await api.get("/artists/saved-opportunities");
      const json = response.data;

      console.log("Saved API response:", JSON.stringify(json, null, 2));

      setSavedApplications(json?.data ?? []);
    } catch (error: any) {
      console.log("Fetch saved error:", error?.response?.data || error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to fetch saved opportunities",
      );
      setSavedApplications([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered list based on active tab and search
  const filteredApplications =
    activeTab === "Saved"
      ? savedApplications.filter((item) => {
          const title = item.opportunity?.title?.toLowerCase() ?? "";
          const desc = item.opportunity?.description?.toLowerCase() ?? "";
          return (
            title.includes(search.toLowerCase()) ||
            desc.includes(search.toLowerCase())
          );
        })
      : allApplications.filter((item) => {
          const statusMatch =
            item.status?.toLowerCase() === statusMap[activeTab]?.toLowerCase();
          const title = item.opportunity?.title?.toLowerCase() ?? "";
          const desc = item.opportunity?.description?.toLowerCase() ?? "";
          const searchMatch =
            title.includes(search.toLowerCase()) ||
            desc.includes(search.toLowerCase());
          return statusMatch && searchMatch;
        });

  // Show loader while fetching any data
  const isLoading =
    loading &&
    (activeTab === "Saved"
      ? savedApplications.length === 0
      : allApplications.length === 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() =>
              navigation.dispatch(DrawerActions.openDrawer() as never)
            }
          >
            <Ionicons name="menu" size={26} color="#333" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("profile" as never)}
          >
            <Ionicons name="person-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                cardStyles.tabItem,
                activeTab === tab && cardStyles.activeTabItem,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  cardStyles.tabText,
                  activeTab === tab && cardStyles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Counts */}
        <Text style={styles.countText}>
          {activeTab} Events : {isLoading ? "..." : filteredApplications.length}
        </Text>

        {/* Content */}
        {isLoading ? (
          <View style={styles.emptyWrapper}>
            <ActivityIndicator size="large" color="#b91c1c" />
          </View>
        ) : filteredApplications.length === 0 ? (
          <EmptyListMessage activeTab={activeTab} router={router} />
        ) : (
          <FlatList
            data={filteredApplications}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ApplicationCard
                item={item}
                router={router}
                activeTab={activeTab}
              />
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
          />
        )}

        <BottomTabBar />
      </View>
    </SafeAreaView>
  );
}

// Styles (same as your design)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  iconBtn: { padding: 6 },
  tabRow: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: "row",
  },
  countText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginHorizontal: 16,
    marginBottom: 15,
  },
  emptyWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  emptyDesc: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  ctaBtn: {
    backgroundColor: "#b91c1c",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  ctaText: { color: "#fff", fontWeight: "600" },
});

const cardStyles = StyleSheet.create({
  tabItem: {
    height: 60,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 10,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
    lineHeight: 16,
  },
  activeTabItem: {
    backgroundColor: "#b91c1c",
    borderColor: "#b91c1c",
  },
  activeTabText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: "#f0f0f0",
  },
  title: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    color: "#666",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  detailsContainer: { marginBottom: 16 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
  },
  detailLabel: {
    fontSize: 12,
    color: "#666",
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    textAlign: "right",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  moreInfoBtn: {
    borderWidth: 1,
    borderColor: "#b91c1c",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  moreInfoText: {
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: "600",
  },
  // separator: { height: 1, backgroundColor: "#eee", marginBottom: 10 },
  // customPlaceholder: {
  //   width: 160,
  //   height: 160,
  //   backgroundColor: "#f5f5f5",
  //   borderRadius: 8,
  //   marginBottom: 20,
  // },
  separator: { height: 1, backgroundColor: "#eee", marginBottom: 10 },
  customPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 0,
  },
});
