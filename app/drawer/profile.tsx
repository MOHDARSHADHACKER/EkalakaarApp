// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function Profile() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0.7);
//   const [avatar, setAvatar] = useState<string | null>(null);

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//  // 🚀 Fetch Profile From API
// const fetchProfile = async () => {
//   try {
//     setLoading(true);
//     const token = await AsyncStorage.getItem("accessToken");

//     if (!token) {
//       Alert.alert("Error", "⚠️ No access token found, please login again");
//       return;
//     }

//     const res = await fetch("https://api.ekalakaar.com/api/v1/artists/profile", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     console.log("🔥 Full Profile Response:", JSON.stringify(data, null, 2));

//     if (res.ok && data.data) {
//       setUser(data.data);

//       // ⭐ FIXED: Construct full avatar URL
//       const avatarFile = data.data.personalInfo?.avatar?.url;

//       const fullAvatarUrl = avatarFile
//         ? `https://api.ekalakaar.com/images/${avatarFile}`
//         : "https://i.pravatar.cc/300?img=12";

//       setAvatar(fullAvatarUrl);
//     } else {
//       Alert.alert("Error", data.message || "Failed to fetch profile");
//     }
//   } catch (err) {
//     console.error("Profile fetch error:", err);
//     Alert.alert("Error", "Something went wrong while fetching profile");
//   } finally {
//     setLoading(false);
//   }
// };

//   // 🚀 Upload Avatar to API
//   const uploadAvatar = async (imageUri: string) => {
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       if (!token) {
//         Alert.alert("Error", "No token found");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("avatar", {
//         uri: imageUri,
//         name: "avatar.jpg",
//         type: "image/jpeg",
//       } as any);

//       const res = await fetch(
//         "https://api.ekalakaar.com/api/v1/artists/profile/avatar",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//           body: formData,
//         }
//       );

//       const data = await res.json();
//       console.log("🔥 Upload Response:", JSON.stringify(data, null, 2));

//       if (res.ok) {
//         Alert.alert("Success", "Profile picture updated!");
//         fetchProfile(); // refresh after upload
//       } else {
//         Alert.alert("Error", data.message || "Upload failed");
//       }
//     } catch (err) {
//       console.log("Avatar Upload Error:", err);
//       Alert.alert("Error", "Failed to upload avatar");
//     }
//   };

//   // 🚀 Pick Image & Upload
//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       const imgUri = result.assets[0].uri;
//       setAvatar(imgUri); // show instantly
//       uploadAvatar(imgUri); // upload to API
//     }
//   };

//   // 🔄 Loading State
//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#b91c1c" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       {/* Profile Picture */}
//       <View style={styles.center}>
//         <View style={styles.avatarWrapper}>
//           <Image
//             source={{
//               uri: avatar || "https://i.pravatar.cc/300?img=12",
//             }}
//             style={styles.avatar}
//           />

//           <View style={styles.progressCircle}>
//             <Text style={styles.progressText}>
//               {Math.round(progress * 100)}%
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.name}>
//           {user?.personalInfo?.firstName || "First"}{" "}
//           {user?.personalInfo?.lastName || "Last"}
//         </Text>

//         <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
//           <Text style={styles.uploadText}>Upload / Change Profile Picture</Text>
//         </TouchableOpacity>
//       </View>

//       {/* BASIC PROFILE */}
//       <Card title="Basic Profile" icon="person-outline">
//         <ProfileRow label="First Name" value={user?.personalInfo?.firstName} />
//         <ProfileRow label="Last Name" value={user?.personalInfo?.lastName} />
//         <ProfileRow label="Email" value={user?.personalInfo?.email} />
//         <ProfileRow
//           label="Contact Number"
//           value={
//             user?.personalInfo?.contactNumber
//               ? `${user.personalInfo.contactNumber.countryCode}-${user.personalInfo.contactNumber.number}`
//               : "N/A"
//           }
//         />
//         <ProfileRow label="Age" value={user?.personalInfo?.age?.toString()} />
//         <ProfileRow label="Gender" value={user?.personalInfo?.gender} />
//         <ProfileRow label="Pincode" value={user?.address?.pincode?.toString()} />
//         <ProfileRow label="Language" value={user?.personalInfo?.languages?.[0]} />
//       </Card>

//       {/* ART PROFILE */}
//       <Card title="Art Profile" icon="mic-outline">
//         <ProfileRow
//           label="Category of art"
//           value={user?.artInfo?.artCategory?.[0]}
//         />
//         <ProfileRow label="Name of Art" value={user?.artInfo?.artName?.[0]} />
//       </Card>

//       {/* PERFORMANCE PROFILE */}
//       <Card title="Performance Profile" icon="musical-notes-outline">
//         <ProfileRow
//           label="Total Performances"
//           value={user?.performanceInfo?.totalPerfs?.toString()}
//         />
//         <ProfileRow
//           label="Experience"
//           value={user?.performanceInfo?.experience?.toString()}
//         />
//       </Card>

//       {/* AWARD PROFILE */}
//       <Card title="Award Profile" icon="star-outline">
//         <ProfileRow
//           label="Total Awards"
//           value={user?.awardsInfo?.totalAwards?.toString()}
//         />
//         <ProfileRow
//           label="Highest Level"
//           value={user?.awardsInfo?.level}
//         />
//       </Card>
//     </ScrollView>
//   );
// }

// // 📌 Card Component
// const Card = ({ title, icon, children }: any) => (
//   <View style={styles.card}>
//     <View style={styles.cardHeader}>
//       <Ionicons name={icon} size={18} color="#000" />
//       <Text style={styles.cardTitle}>{title}</Text>
//       <Ionicons name="pencil" size={18} color="#b91c1c" />
//     </View>
//     {children}
//   </View>
// );

// // 📌 Profile Row
// const ProfileRow = ({ label, value }: any) => (
//   <View style={styles.row}>
//     <Text style={styles.rowLabel}>{label}:</Text>
//     <Text style={styles.rowValue}>{value || "N/A"}</Text>
//   </View>
// );

// // 🎨 Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 12 },
//   center: { alignItems: "center", marginVertical: 20 },
//   avatarWrapper: { position: "relative", marginBottom: 10 },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 2,
//     borderColor: "#b91c1c",
//   },
//   progressCircle: {
//     position: "absolute",
//     bottom: -5,
//     right: -5,
//     backgroundColor: "#b91c1c",
//     borderRadius: 20,
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//   },
//   progressText: { color: "#fff", fontWeight: "700" },
//   name: { fontSize: 20, fontWeight: "700", marginVertical: 6 },
//   uploadBtn: {
//     backgroundColor: "#b91c1c",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   uploadText: { color: "#fff", fontWeight: "600" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   cardTitle: { fontWeight: "700", fontSize: 16, marginLeft: 6 },
//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   rowLabel: { fontWeight: "600", color: "#444" },
//   rowValue: { color: "#666" },
// });

//profile

import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";

import { useRouter } from "expo-router";

import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0.7);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // 🚀 Fetch Profile From API
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");

      console.log("🔑 Token being sent:", token); // 👈 ye line add karo

      if (!token) {
        Alert.alert("Error", "⚠️ No access token found, please login again");
        return;
      }

      // const res = await fetch(
      //   "https://api.ekalakaar.com/api/v1/artists/profile",
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   },
      // );
      // "http://192.168.1.24:4000/api/v1/artists/profile/userid",

      const res = await fetch(
        "https://api.ekalakaar.com/api/v1/artists/profile/69cd062aed280923ebfe8666",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      console.log("🔥 Full Profile Response:", JSON.stringify(data, null, 2));

      if (res.ok && data.data) {
        setUser(data.data);

        // ⭐ FIXED: Construct full avatar URL
        const avatarFile = data.data.personalInfo?.avatar?.url;

        const fullAvatarUrl = avatarFile
          ? `https://api.ekalakaar.com/images/${avatarFile}`
          : "https://i.pravatar.cc/300?img=12";

        setAvatar(fullAvatarUrl);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
      Alert.alert("Error", "Something went wrong while fetching profile");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Upload Avatar to API
  const uploadAvatar = async (imageUri: string) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No token found");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", {
        uri: imageUri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      const res = await fetch(
        "https://api.ekalakaar.com/api/v1/artists/profile/avatar",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        },
      );

      const data = await res.json();
      console.log("🔥 Upload Response:", JSON.stringify(data, null, 2));

      if (res.ok) {
        Alert.alert("Success", "Profile picture updated!");
        fetchProfile(); // refresh after upload
      } else {
        Alert.alert("Error", data.message || "Upload failed");
      }
    } catch (err) {
      console.log("Avatar Upload Error:", err);
      Alert.alert("Error", "Failed to upload avatar");
    }
  };

  // 🚀 Pick Image & Upload
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const imgUri = result.assets[0].uri;
      setAvatar(imgUri); // show instantly
      uploadAvatar(imgUri); // upload to API
    }
  };

  // 🔄 Loading State
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await fetchProfile();
            setRefreshing(false);
          }}
        />
      }
    >
      <View style={styles.center}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: avatar || "https://i.pravatar.cc/300?img=12",
            }}
            style={styles.avatar}
          />

          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>

        <Text style={styles.name}>
          {user?.personalInfo?.firstName || "First"}{" "}
          {user?.personalInfo?.lastName || "Last"}
        </Text>

        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Text style={styles.uploadText}>Upload / Change Profile Picture</Text>
        </TouchableOpacity>
      </View>

      {/* BASIC PROFILE */}
      <Card
        title="Basic Profile"
        icon="person-outline"
        route="/drawer/edit-basic-profile"
      >
        <ProfileRow label="First Name" value={user?.personalInfo?.firstName} />
        <ProfileRow label="Last Name" value={user?.personalInfo?.lastName} />
        <ProfileRow label="Email" value={user?.personalInfo?.email} />
        <ProfileRow
          label="Contact Number"
          value={
            user?.personalInfo?.contactNumber
              ? `${user.personalInfo.contactNumber.countryCode}-${user.personalInfo.contactNumber.number}`
              : "N/A"
          }
        />
        <ProfileRow label="Age" value={user?.personalInfo?.age?.toString()} />
        <ProfileRow label="Gender" value={user?.personalInfo?.gender} />
        <ProfileRow
          label="Pincode"
          value={user?.address?.pincode?.toString()}
        />
        <ProfileRow
          label="Language"
          value={user?.personalInfo?.languages?.[0]}
        />
      </Card>

      {/* ART PROFILE */}
      <Card
        title="Art Profile"
        icon="mic-outline"
        route="/drawer/edit-art-profile"
      >
        <ProfileRow
          label="Category of art"
          value={user?.artInfo?.artCategory?.[0]}
        />
        <ProfileRow label="Name of Art" value={user?.artInfo?.artName?.[0]} />
      </Card>

      {/* PERFORMANCE PROFILE */}

      <Card
        title="Performance Profile"
        icon="musical-notes-outline"
        route="/drawer/edit-performance-profile"
      >
        <ProfileRow
          label="Total Performances"
          value={user?.performanceInfo?.totalPerfs?.toString()}
        />
        <ProfileRow
          label="Experience"
          value={user?.performanceInfo?.experience?.toString()}
        />
      </Card>

      {/* AWARD PROFILE */}
      <Card
        title="Award Profile"
        icon="star-outline"
        route="/drawer/edit-award-profile"
      >
        <ProfileRow
          label="Total Awards"
          value={user?.awardsInfo?.totalAwards?.toString()}
        />
        <ProfileRow label="Highest Level" value={user?.awardsInfo?.level} />
      </Card>
    </ScrollView>
  );
}

// 📌 Card Component

// 📌 Card Component
const Card = ({ title, icon, children, route }: any) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={18} color="#000" />
        <Text style={styles.cardTitle}>{title}</Text>
        {/* <TouchableOpacity onPress={() => router.push(route)}>
          <Ionicons name="pencil" size={18} color="#b91c1c" />
        </TouchableOpacity> */}
        <TouchableOpacity
          disabled={!route}
          onPress={() => {
            if (route) router.push(route);
            else Alert.alert("No route specified for this card.");
          }}
        >
          <Ionicons
            name="pencil"
            size={18}
            color={route ? "#b91c1c" : "#ccc"}
          />
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
};

// 📌 Profile Row
const ProfileRow = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}:</Text>
    <Text style={styles.rowValue}>{value || "N/A"}</Text>
  </View>
);

// 🎨 Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 12 },
  center: { alignItems: "center", marginVertical: 20 },
  avatarWrapper: { position: "relative", marginBottom: 10 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#b91c1c",
  },
  progressCircle: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#b91c1c",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  progressText: { color: "#fff", fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "700", marginVertical: 6 },
  uploadBtn: {
    backgroundColor: "#b91c1c",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  uploadText: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: { fontWeight: "700", fontSize: 16, marginLeft: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLabel: { fontWeight: "600", color: "#444" },
  rowValue: { color: "#666" },
});
