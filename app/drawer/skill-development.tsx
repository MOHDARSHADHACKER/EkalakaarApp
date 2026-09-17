import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../../components/BottomTabBar';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// Popular Courses with stock images
const popularCourses = [
  {
    id: "1",
    title: "Singing",
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
  },
  {
    id: "2",
    title: "Dancing",
    image: "https://images.unsplash.com/photo-1515169067865-5387ec356754",
  },
  {
    id: "3",
    title: "Theater",
    image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439",
  },
];

// Categories with stock images
const categories = [
  {
    id: "1",
    title: "Dance",
    image: "https://images.unsplash.com/photo-1549887534-152d2d8d42b4",
  },
  {
    id: "2",
    title: "Song",
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
  },
  {
    id: "3",
    title: "Music",
    image: "https://images.unsplash.com/photo-1511376777868-611b54f68947",
  },
  {
    id: "4",
    title: "Theater",
    image: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a",
  },
  {
    id: "5",
    title: "Acting",
    image: "https://images.unsplash.com/photo-1515169067865-5387ec356754",
  },
  {
    id: "6",
    title: "Painting",
    image: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92",
  },
];

export default function SkillDevelopment() {
  const navigation = useNavigation();

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
        <Text style={styles.headerTitle}>Skill Development</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate("profile" as never)}
        >
          <Ionicons name="person-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Popular Courses */}
        <Text style={styles.sectionTitle}>Popular Courses</Text>
        <FlatList
          data={popularCourses}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <View style={styles.popularCard}>
              <Image source={{ uri: item.image }} style={styles.popularImage} />
              <View style={styles.overlay}>
                <Text style={styles.popularText}>{item.title}</Text>
              </View>
            </View>
          )}
        />

        {/* Categories */}
        <View style={styles.categoryHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <View style={styles.categoryCard} key={cat.id}>
              <Image source={{ uri: cat.image }} style={styles.categoryImage} />
              <View style={styles.overlay}>
                <Text style={styles.categoryText}>{cat.title}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
       <BottomTabBar />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9fafb",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  iconBtn: { padding: 6 },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },

  // Popular Courses
  popularCard: {
    width: 200,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    marginRight: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  popularImage: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
  },
  popularText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  // Categories
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
  },
  viewAll: { fontSize: 14, fontWeight: "600", color: "#b91c1c" },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 12,
  },
  categoryCard: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: { width: "100%", height: "100%" },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});
