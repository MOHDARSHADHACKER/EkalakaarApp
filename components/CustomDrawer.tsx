// import { Ionicons } from "@expo/vector-icons";
// import { DrawerContentScrollView } from "@react-navigation/drawer";
// import React from "react";
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// export default function CustomDrawer(props: any) {
//   return (
//     <View style={{ flex: 1, backgroundColor: "#b91c1c" }}>
//       {/* User Info */}
//       <View style={styles.profileSection}>
//         <Ionicons name="person-circle-outline" size={80} color="#fff" />
//         <Text style={styles.name}>Abhay Nishand</Text>
//         <Text style={styles.email}>iamabhaynishad@gmail.com</Text>
//       </View>

//       <DrawerContentScrollView {...props}>
//         <ScrollView>
//         <TouchableOpacity
//   style={styles.menuItem}
//   onPress={() => props.navigation.navigate("profile")}
// >
//   <Ionicons name="person-outline" size={20} color="#fff" />
//   <Text style={styles.menuText}>Profile</Text>
// </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate("portfolio")}>
//             <Ionicons name="document-outline" size={20} color="#fff" />
//             <Text style={styles.menuText}>Portfolio</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate("calendar")}>
//             <Ionicons name="calendar-outline" size={20} color="#fff" />
//             <Text style={styles.menuText}>Calendar</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//   style={styles.menuItem}
//   onPress={() => props.navigation.navigate("dashboard")}
// >
//   <Ionicons name="grid-outline" size={20} color="#fff" />
//   <Text style={styles.menuText}>Dashboard</Text>
// </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate("home")}>
//             <Ionicons name="briefcase-outline" size={20} color="#fff" />
//             <Text style={styles.menuText}>Opportunities</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate("applications")}>
//             <Ionicons name="globe-outline" size={20} color="#fff" />
//             <Text style={styles.menuText}>Applications</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate("skill-development")}>
//             <Ionicons name="bar-chart-outline" size={20} color="#fff" />
//             <Text style={styles.menuText}>Skill Development</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate("news-update")}>
//             <Ionicons name="newspaper-outline" size={20} color="#fff" />
//             <Text style={styles.menuText}>News Update</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate("resources")}>
//             <Ionicons name="link-outline" size={20} color="#fff" />
//             <Text style={styles.menuText}>Resources</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem} onPress={() => props.navigation.navigate("contact-us")}>
//             <Ionicons name="call-outline" size={20} color="#fff" />
//             <Text style={styles.menuText}>Contact Us</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </DrawerContentScrollView>

//       {/* Logout Button */}
//       <TouchableOpacity style={styles.logoutBtn} onPress={() => console.log("Logout")}>
//         <Ionicons name="log-out-outline" size={20} color="#b91c1c" />
//         <Text style={styles.logoutText}>Log Out</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   profileSection: {
//     backgroundColor: "#a31616",
//     paddingVertical: 30,
//     alignItems: "center",
//   },
//   name: { fontSize: 18, fontWeight: "600", color: "#fff", marginTop: 8 },
//   email: { fontSize: 13, color: "#f1f1f1" },

//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//     paddingHorizontal: 20,
//   },
//   menuText: {
//     color: "#fff",
//     fontSize: 15,
//     marginLeft: 12,
//   },

//   logoutBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#fff",
//     margin: 16,
//     paddingVertical: 12,
//     borderRadius: 10,
//   },
//   logoutText: {
//     color: "#b91c1c",
//     marginLeft: 8,
//     fontWeight: "600",
//     fontSize: 15,
//   },
// });

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CustomDrawer(props: any) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");

      if (!accessToken) {
        setLoading(false);
        return;
      }
      // Fetch user profile from API (same endpoint as Profile.tsx)
      // const response = await fetch(
      //   "http://localhost:4000/api/v1/artists/profile",
      //   {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   },
      // );

      const response = await fetch(
        "https://api.ekalakaar.com/api/v1/artists/profile/69cd062aed280923ebfe8666",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();

      console.log("Response Status:", response.status);
      console.log("API Data:", data);
      console.log("First Name:", data?.data?.personalInfo?.firstName);

      console.log("🔥 Drawer Profile Response:", JSON.stringify(data, null, 2));

      if (response.ok && data.data) {
        // Extract name from personalInfo
        const firstName = data.data.personalInfo?.firstName || "";
        const lastName = data.data.personalInfo?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();

        // Extract email
        const email = data.data.personalInfo?.email || "";

        // Extract avatar
        const avatarFile = data.data.personalInfo?.avatar?.url;
        const fullAvatarUrl = avatarFile
          ? `https://api.ekalakaar.com/images/${avatarFile}`
          : null;

        setUserName(fullName || "User");
        setUserEmail(email || "");
        setAvatar(fullAvatarUrl);

        // Optionally cache in AsyncStorage for offline access
        await AsyncStorage.setItem("userName", fullName);
        await AsyncStorage.setItem("userEmail", email);
        if (fullAvatarUrl) {
          await AsyncStorage.setItem("userAvatar", fullAvatarUrl);
        }
      }
    } catch (error) {
      console.log("Error fetching user data:", error);

      // Fallback to cached data if API fails
      const cachedName = await AsyncStorage.getItem("userName");
      const cachedEmail = await AsyncStorage.getItem("userEmail");
      const cachedAvatar = await AsyncStorage.getItem("userAvatar");

      if (cachedName) setUserName(cachedName);
      if (cachedEmail) setUserEmail(cachedEmail);
      if (cachedAvatar) setAvatar(cachedAvatar);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Remove tokens and user data from local storage
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("role");
      await AsyncStorage.removeItem("userName");
      await AsyncStorage.removeItem("userEmail");
      await AsyncStorage.removeItem("userAvatar");

      // Navigate to Login screen
      props.navigation.reset({
        index: 0,
        routes: [{ name: "SignIn" }],
      });
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#AD2F3B" }}>
      {/* User Info */}
      <View style={styles.profileSection}>
        {loading ? (
          <ActivityIndicator color="#fff" size="large" />
        ) : (
          <>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle-outline" size={80} color="#fff" />
            )}
            <Text style={styles.name}>{userName || "Guest User"}</Text>
            <Text style={styles.email}>{userEmail || "guest@example.com"}</Text>
          </>
        )}
      </View>

      <DrawerContentScrollView {...props}>
        <ScrollView>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("profile")}
          >
            <Ionicons name="person-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("portfolio")}
          >
            <Ionicons name="document-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Portfolio</Text>
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("calendar")}
          >
            <Ionicons name="calendar-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Calendar</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("dashboard")}
          >
            <Ionicons name="grid-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("home")}
          >
            <Ionicons name="briefcase-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Opportunities</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("applications")}
          >
            <Ionicons name="globe-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Applications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("skill-development")}
          >
            <Ionicons name="bar-chart-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Skill Development</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("news-update")}
          >
            <Ionicons name="newspaper-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>News Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("resources")}
          >
            <Ionicons name="link-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Resources</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => props.navigation.navigate("contact-us")}
          >
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={styles.menuText}>Contact Us</Text>
          </TouchableOpacity>
        </ScrollView>
      </DrawerContentScrollView>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#AD2F3B" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    backgroundColor: "#AD2F3B",
    paddingVertical: 30,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 8,
  },
  name: { fontSize: 18, fontWeight: "600", color: "#fff", marginTop: 8 },
  email: { fontSize: 13, color: "#f1f1f1", marginTop: 4 },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuText: {
    color: "#fff",
    fontSize: 15,
    marginLeft: 12,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  logoutText: {
    color: "#AD2F3B",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 15,
  },
});
