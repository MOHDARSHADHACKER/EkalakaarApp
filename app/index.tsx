// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import React, { useEffect } from "react";
// import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

// export default function SplashScreen() {
//   const router = useRouter();

//   useEffect(() => {
//     const checkLogin = async () => {
//       const token = await AsyncStorage.getItem("accessToken");
//       setTimeout(() => {
//         if (token) {
//            router.replace("/drawer/home"); // agar login hai to profile pe le jao
//         } else {
//           router.replace("/SignIn"); // agar login nahi hai to signin pe
//         }
//       }, 2000); // 2 sec splash dikhane ke liye
//     };

//     checkLogin();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* Logo */}
//       <Image
//         source={require("../assets/images/splash.png")}
//         style={styles.logo}
//         resizeMode="cover"
//       />

//       {/* Tagline */}
//       <Text style={styles.tagline}>Art Beyond Entertainment</Text>

//       {/* Loader */}
//       <ActivityIndicator size="large" color="#b91c1c" style={{ marginTop: 30 }} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logo: {
//     width: 220,
//     height: 100,
//   },
//   tagline: {
//     marginTop: 15,
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#444",
//   },

//   fullSplash: {
//   width: "100%",
//   height: "100%",
//   position: "absolute",
//   top: 0,
//   left: 0,
// },

// });


import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("accessToken");

      setTimeout(() => {
        if (token) {
          router.replace("/drawer/home");
        } else {
          router.replace("/SignIn");
        }
      }, 3000);
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/splash.png")}
        style={styles.fullSplash}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fullSplash: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
