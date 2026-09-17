// import { Ionicons } from "@expo/vector-icons";
// import { DrawerActions, useNavigation } from "@react-navigation/native";
// import React from "react";
// import { SafeAreaView } from 'react-native-safe-area-context';
// import BottomTabBar from '../../components/BottomTabBar';
// import {
//     FlatList,
//     Image,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from "react-native";

// const newsData = [
//   {
//     id: "1",
//     title: "IYDF and Kannagi's Nrityabodhi School of Performing Arts",
//     description:
//       "New Delhi [India], September 25: In September 2024, the International Youth Development Foundation (IYDF), in collaboration with Kannagi's...",
//     image:
//       "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?fit=crop&w=800&q=80",
//   },
//   {
//     id: "2",
//     title: "Witness Odissi and Carnatic music come together",
//     description:
//       "The Kiran Nadar Museum of Art (KNMA) has announced its Performing Arts Programming for 2024. The event will kick off with a performance...",
//     image:
//       "https://images.unsplash.com/photo-1602526216438-6f2a444ef98a?fit=crop&w=800&q=80",
//   },
//   {
//     id: "3",
//     title: "Confluence of culture and classical arts",
//     description:
//       "CHENNAI: In an era where screens dominate, the vibrant display of Indian classical arts brings tradition back to life with grace...",
//     image:
//       "https://images.unsplash.com/photo-1617196031330-0890c235a491?fit=crop&w=800&q=80",
//   },
// ];

// export default function News() {
//   const navigation = useNavigation();

//   const renderItem = ({ item }: any) => (
//     <View style={styles.card}>
//       <Image source={{ uri: item.image }} style={styles.image} />
//       <View style={styles.content}>
//         <Text style={styles.title} numberOfLines={2}>
//           {item.title}
//         </Text>
//         <Text style={styles.description} numberOfLines={3}>
//           {item.description}
//         </Text>
//         <TouchableOpacity style={styles.readMore}>
//           <Text style={styles.readMoreText}>Read More →</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.iconBtn}
//           onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//         >
//           <Ionicons name="menu" size={26} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Latest News</Text>
//         <TouchableOpacity
//           style={styles.iconBtn}
//           onPress={() => navigation.navigate("profile" as never)}
//         >
//           <Ionicons name="person-circle-outline" size={28} color="#333" />
//         </TouchableOpacity>
//       </View>

//       {/* News List */}
//       <FlatList
//         data={newsData}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={{ padding: 16 }}
//         showsVerticalScrollIndicator={false}
//       />
//        <BottomTabBar />
//     </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },

//   // Header
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: "#f9fafb",
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
//   iconBtn: { padding: 6 },

//   // Card
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     marginBottom: 18,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   image: { width: "100%", height: 180 },
//   content: { padding: 12 },
//   title: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 6 },
//   description: { fontSize: 13, color: "#555", marginBottom: 10 },
//   readMore: { alignSelf: "flex-start" },
//   readMoreText: { fontSize: 13, fontWeight: "600", color: "#b91c1c" },
// });


import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomTabBar from '../../components/BottomTabBar';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Dimensions
} from "react-native";

const { width } = Dimensions.get('window');

// ==========================================
// TODO: Replace with API call
// Fetch featured news for carousel
// ==========================================
const featuredNews = [
  {
    id: "1",
    age: "14 Years",
    title: "OLD GIRL",
    subtitle: "Got 1st Prize\nin Bharatanatyam",
    image: "https://images.unsplash.com/photo-1583224732453-f4c6e17c2b75?fit=crop&w=800&q=80",
  },
  {
    id: "2",
    age: "16 Years",
    title: "YOUNG TALENT",
    subtitle: "Winner in Classical\nDance Competition",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?fit=crop&w=800&q=80",
  },
];

// ==========================================
// TODO: Replace with API call
// Fetch today's news items
// ==========================================
const todaysNews = [
  {
    id: "1",
    title: "News Headline",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?fit=crop&w=800&q=80",
  },
  {
    id: "2",
    title: "Latest Update",
    description: "Sed do eiusmod tempor incididunt ut labore et dolore...",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?fit=crop&w=800&q=80",
  },
  {
    id: "3",
    title: "Breaking News",
    description: "Ut enim ad minim veniam, quis nostrud exercitation...",
    image: "https://images.unsplash.com/photo-1586339949216-35c2747cc36d?fit=crop&w=800&q=80",
  },
];

// ==========================================
// TODO: Replace with API call
// Fetch news categories
// ==========================================
const categories = [
  {
    id: "1",
    name: "Dance",
    image: "https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?fit=crop&w=400&q=80",
  },
  {
    id: "2",
    name: "Music",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?fit=crop&w=400&q=80",
  },
  {
    id: "3",
    name: "Drama",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?fit=crop&w=400&q=80",
  },
  {
    id: "4",
    name: "Acting",
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?fit=crop&w=400&q=80",
  },
  {
    id: "5",
    name: "Fine Art",
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?fit=crop&w=400&q=80",
  },
  {
    id: "6",
    name: "Comedy",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?fit=crop&w=400&q=80",
  },
];

// ==========================================
// TODO: Replace with API call
// Fetch articles list
// ==========================================
const articles = [
  {
    id: "1",
    title: "Article Title",
    image: "https://images.unsplash.com/photo-1583224732453-f4c6e17c2b75?fit=crop&w=400&q=80",
    postedBy: "Jake Paul",
    postedOn: "19/03/2022",
  },
  {
    id: "2",
    title: "Article Title",
    image: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?fit=crop&w=400&q=80",
    postedBy: "Jake Paul",
    postedOn: "19/03/2022",
  },
];

export default function News() {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================
  // TODO: Implement search functionality with API
  // ==========================================
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Call API with search query
  };

  const renderFeaturedItem = ({ item, index }: any) => (
    <View style={styles.featuredCard}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.ageText}>{item.age}</Text>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredSubtitle}>{item.subtitle}</Text>
        <TouchableOpacity style={styles.readMoreBtn}>
          <Text style={styles.readMoreBtnText}>Read More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTodaysNewsItem = ({ item, index }: any) => (
    <TouchableOpacity style={styles.todaysNewsCard}>
      <Image source={{ uri: item.image }} style={styles.todaysNewsImage} />
      <View style={styles.todaysNewsOverlay}>
        <Text style={styles.todaysNewsTitle}>{item.title}</Text>
        <Text style={styles.todaysNewsDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }: any) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay}>
        <Text style={styles.categoryName}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderArticleItem = ({ item }: any) => (
    <View style={styles.articleCard}>
      <Image source={{ uri: item.image }} style={styles.articleImage} />
      <Text style={styles.articleTitle}>{item.title}</Text>
      <View style={styles.articleMeta}>
        <View style={styles.articleMetaRow}>
          <Text style={styles.articleMetaLabel}>Posted By:</Text>
          <Text style={styles.articleMetaValue}>{item.postedBy}</Text>
        </View>
        <View style={styles.articleMetaRow}>
          <Text style={styles.articleMetaLabel}>Posted On:</Text>
          <Text style={styles.articleMetaValue}>{item.postedOn}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.readArticleBtn}>
        <Text style={styles.readArticleBtnText}>Read Article</Text>
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.headerTitle}>News</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="bookmark-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate("profile" as never)}
            >
              <Ionicons name="person-circle-outline" size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search news"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {/* Featured News Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              data={featuredNews}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => item.id}
              onScroll={(e) => {
                const slide = Math.round(
                  e.nativeEvent.contentOffset.x / (width - 32)
                );
                setActiveSlide(slide);
              }}
            />
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              {featuredNews.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === activeSlide && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Today's News Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's News</Text>
            <View style={styles.todaysNewsContainer}>
              <FlatList
                data={todaysNews}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderTodaysNewsItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.todaysNewsList}
              />
              {/* Navigation Arrows */}
              <View style={styles.arrowContainer}>
                <TouchableOpacity style={styles.arrowBtn}>
                  <Ionicons name="chevron-back" size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.arrowBtn}>
                  <Ionicons name="chevron-forward" size={20} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* News Category Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>News Category</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <Image source={{ uri: category.image }} style={styles.categoryImage} />
                  <View style={styles.categoryOverlay}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Articles Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Articles</Text>
            <View style={styles.articlesGrid}>
              {articles.map((article) => (
                <View key={article.id} style={styles.articleCard}>
                  <Image source={{ uri: article.image }} style={styles.articleImage} />
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <View style={styles.articleMeta}>
                    <View style={styles.articleMetaRow}>
                      <Text style={styles.articleMetaLabel}>Posted By:</Text>
                      <Text style={styles.articleMetaValue}>{article.postedBy}</Text>
                    </View>
                    <View style={styles.articleMetaRow}>
                      <Text style={styles.articleMetaLabel}>Posted On:</Text>
                      <Text style={styles.articleMetaValue}>{article.postedOn}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.readArticleBtn}>
                    <Text style={styles.readArticleBtnText}>Read Article</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 80 }} />
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: { padding: 6 },

  // Search Bar
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 45,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },

  // Featured Carousel
  carouselContainer: {
    marginBottom: 20,
  },
  featuredCard: {
    width: width - 32,
    height: 200,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
    justifyContent: "center",
  },
  ageText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  featuredTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 12,
  },
  readMoreBtn: {
    alignSelf: "flex-start",
    borderWidth: 2,
    borderColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  readMoreBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
  },
  paginationDotActive: {
    backgroundColor: "#b91c1c",
    width: 24,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#b91c1c",
    marginLeft: 16,
    marginBottom: 12,
  },

  // Today's News
  todaysNewsContainer: {
    position: "relative",
  },
  todaysNewsList: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  todaysNewsCard: {
    width: 240,
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  todaysNewsImage: {
    width: "100%",
    height: "100%",
  },
  todaysNewsOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
  },
  todaysNewsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  todaysNewsDesc: {
    fontSize: 12,
    color: "#eee",
  },
  arrowContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 12,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },

  // Categories
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: (width - 44) / 2,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 12,
    alignItems: "center",
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // Articles
  articlesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  articleCard: {
    width: (width - 44) / 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleImage: {
    width: "100%",
    height: 140,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    padding: 12,
    paddingBottom: 8,
  },
  articleMeta: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  articleMetaRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  articleMetaLabel: {
    fontSize: 12,
    color: "#666",
    marginRight: 6,
  },
  articleMetaValue: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  readArticleBtn: {
    backgroundColor: "#b91c1c",
    margin: 12,
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  readArticleBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});