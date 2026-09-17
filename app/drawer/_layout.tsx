import { Drawer } from "expo-router/drawer";
import React from "react";
import CustomDrawer from "../../components/CustomDrawer";

export default function Layout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      {/* Screens with bottom navigation */}
      <Drawer.Screen name="home" options={{ title: "Home" }} />
      <Drawer.Screen name="applications" options={{ title: "Applications" }} />
      <Drawer.Screen name="skill-development" options={{ title: "Skill Development" }} />
      <Drawer.Screen name="news-update" options={{ title: "News Update" }} />
      
      {/* Other drawer screens without bottom nav */}
      <Drawer.Screen name="profile" options={{ title: "Profile" }} />
      <Drawer.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Drawer.Screen name="resources" options={{ title: "Resources" }} />
      <Drawer.Screen name="contact-us" options={{ title: "Contact Us" }} />


      <Drawer.Screen name="edit-basic-profile" options={{ title: "Basic Profile" }} />
      <Drawer.Screen name="edit-performance-profile" options={{ title: "Performance Profile" }} />
      <Drawer.Screen name="edit-art-profile" options={{ title: "Art Profile" }} />
      <Drawer.Screen name="edit-award-profile" options={{ title: "Award Profile" }} />
    </Drawer>
  );
}