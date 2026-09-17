// import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { DrawerActions, useNavigation } from "@react-navigation/native";
// import React, { useEffect, useState } from "react";
// import api from "../../src/services/api";

// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Modal,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   ScrollView,
// } from "react-native";
// import { SafeAreaView } from 'react-native-safe-area-context';
// import BottomTabBar from '../../components/BottomTabBar';

// export default function Home() {
//   const [search, setSearch] = useState("");
//   const [opportunities, setOpportunities] = useState<any[]>([]);
//   const [filteredData, setFilteredData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [sortModalVisible, setSortModalVisible] = useState(false);
//   const navigation = useNavigation();

//   // Filter States
//   const [selectedArtName, setSelectedArtName] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState("");
//   const [minAmount, setMinAmount] = useState("");
//   const [maxAmount, setMaxAmount] = useState("");
//   const [selectedAmountRange, setSelectedAmountRange] = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [performanceDateFrom, setPerformanceDateFrom] = useState("");
//   const [performanceDateTo, setPerformanceDateTo] = useState("");
//   const [dueDateFrom, setDueDateFrom] = useState("");
//   const [dueDateTo, setDueDateTo] = useState("");

//   // Sort State
//   const [sortBy, setSortBy] = useState("");

//   // Applied filters for display
//   const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

//   useEffect(() => {
//     fetchOpportunities();
//   }, []);

//   const fetchOpportunities = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("accessToken");
//       if (!token) {
//         Alert.alert("Error", "No access token found, please login again");
//         setLoading(false);
//         return;
//       }

//       const response = await api.get("/artists/opportunities");
//       const data = response.data;
//       console.log("Fetched Opportunities API data:", data);

//       if (data?.data) {
//         setOpportunities(data.data);
//         setFilteredData(data.data);
//       } else {
//         Alert.alert("Error", data.message || "Failed to fetch opportunities");
//         setOpportunities([]);
//         setFilteredData([]);
//       }
//     } catch (err: any) {
//       console.log("Opportunities error:", err?.response?.data || err);
//       Alert.alert(
//         "Error",
//         err?.response?.data?.message ||
//           "Something went wrong while fetching opportunities"
//       );
//       setOpportunities([]);
//       setFilteredData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = [...opportunities];
//     const filters: string[] = [];

//     // Filter by art name
//     if (selectedArtName.trim()) {
//       filtered = filtered.filter(item =>
//         item.artForm?.toLowerCase().includes(selectedArtName.toLowerCase()) ||
//         item.artName?.toLowerCase().includes(selectedArtName.toLowerCase())
//       );
//       filters.push(`Art: ${selectedArtName}`);
//     }

//     // Filter by location
//     if (selectedLocation.trim()) {
//       filtered = filtered.filter(item =>
//         item.location?.toLowerCase().includes(selectedLocation.toLowerCase())
//       );
//       filters.push(`Loc: ${selectedLocation}`);
//     }

//     // Filter by amount range
//     if (selectedAmountRange) {
//       filtered = filtered.filter(item => {
//         const budget = item.budget || 0;
//         switch (selectedAmountRange) {
//           case "below5000":
//             return budget < 5000;
//           case "5000-10000":
//             return budget >= 5000 && budget <= 10000;
//           case "10000-20000":
//             return budget >= 10000 && budget <= 20000;
//           case "20000-50000":
//             return budget >= 20000 && budget <= 50000;
//           case "above50000":
//             return budget > 50000;
//           default:
//             return true;
//         }
//       });

//       const rangeLabels: any = {
//         "below5000": "Below ₹5k",
//         "5000-10000": "₹5k-₹10k",
//         "10000-20000": "₹10k-₹20k",
//         "20000-50000": "₹20k-₹50k",
//         "above50000": "Above ₹50k"
//       };
//       filters.push(rangeLabels[selectedAmountRange]);
//     }

//     // Filter by custom min/max amount
//     if (minAmount && maxAmount) {
//       const min = parseFloat(minAmount);
//       const max = parseFloat(maxAmount);
//       filtered = filtered.filter(item => {
//         const budget = item.budget || 0;
//         return budget >= min && budget <= max;
//       });
//       filters.push(`₹${minAmount}-₹${maxAmount}`);
//     } else if (minAmount) {
//       const min = parseFloat(minAmount);
//       filtered = filtered.filter(item => (item.budget || 0) >= min);
//       filters.push(`Min ₹${minAmount}`);
//     } else if (maxAmount) {
//       const max = parseFloat(maxAmount);
//       filtered = filtered.filter(item => (item.budget || 0) <= max);
//       filters.push(`Max ₹${maxAmount}`);
//     }

//     // Filter by language
//     if (selectedLanguage.trim()) {
//       filtered = filtered.filter(item => {
//         const langs = Array.isArray(item.languages)
//           ? item.languages
//           : [item.languages];
//         return langs.some((lang: string) =>
//           lang?.toLowerCase().includes(selectedLanguage.toLowerCase())
//         );
//       });
//       filters.push(`Lang: ${selectedLanguage}`);
//     }

//     // Filter by performance date
//     if (performanceDateFrom || performanceDateTo) {
//       filtered = filtered.filter(item => {
//         if (!item.performanceDate) return false;
//         const perfDate = new Date(item.performanceDate);

//         if (performanceDateFrom && performanceDateTo) {
//           const from = new Date(performanceDateFrom);
//           const to = new Date(performanceDateTo);
//           return perfDate >= from && perfDate <= to;
//         } else if (performanceDateFrom) {
//           const from = new Date(performanceDateFrom);
//           return perfDate >= from;
//         } else if (performanceDateTo) {
//           const to = new Date(performanceDateTo);
//           return perfDate <= to;
//         }
//         return true;
//       });

//       if (performanceDateFrom && performanceDateTo) {
//         filters.push(`Perf: ${performanceDateFrom} to ${performanceDateTo}`);
//       } else if (performanceDateFrom) {
//         filters.push(`Perf From: ${performanceDateFrom}`);
//       } else if (performanceDateTo) {
//         filters.push(`Perf Till: ${performanceDateTo}`);
//       }
//     }

//     // Filter by application due date
//     if (dueDateFrom || dueDateTo) {
//       filtered = filtered.filter(item => {
//         if (!item.applicationPeriod?.end) return false;
//         const dueDate = new Date(item.applicationPeriod.end);

//         if (dueDateFrom && dueDateTo) {
//           const from = new Date(dueDateFrom);
//           const to = new Date(dueDateTo);
//           return dueDate >= from && dueDate <= to;
//         } else if (dueDateFrom) {
//           const from = new Date(dueDateFrom);
//           return dueDate >= from;
//         } else if (dueDateTo) {
//           const to = new Date(dueDateTo);
//           return dueDate <= to;
//         }
//         return true;
//       });

//       if (dueDateFrom && dueDateTo) {
//         filters.push(`Due: ${dueDateFrom} to ${dueDateTo}`);
//       } else if (dueDateFrom) {
//         filters.push(`Due From: ${dueDateFrom}`);
//       } else if (dueDateTo) {
//         filters.push(`Due Till: ${dueDateTo}`);
//       }
//     }

//     setFilteredData(filtered);
//     setAppliedFilters(filters);
//     setFilterModalVisible(false);
//   };

//   const applySort = (sortOption: string) => {
//     let sorted = [...filteredData];

//     switch (sortOption) {
//       case "amount_low_high":
//         sorted.sort((a, b) => (a.budget || 0) - (b.budget || 0));
//         break;
//       case "amount_high_low":
//         sorted.sort((a, b) => (b.budget || 0) - (a.budget || 0));
//         break;
//       case "date_newest":
//         sorted.sort((a, b) => {
//           const dateA = a.performanceDate ? new Date(a.performanceDate).getTime() : 0;
//           const dateB = b.performanceDate ? new Date(b.performanceDate).getTime() : 0;
//           return dateB - dateA;
//         });
//         break;
//       case "date_oldest":
//         sorted.sort((a, b) => {
//           const dateA = a.performanceDate ? new Date(a.performanceDate).getTime() : 0;
//           const dateB = b.performanceDate ? new Date(b.performanceDate).getTime() : 0;
//           return dateA - dateB;
//         });
//         break;
//       case "deadline_soon":
//         sorted.sort((a, b) => {
//           const dateA = a.applicationPeriod?.end ? new Date(a.applicationPeriod.end).getTime() : Infinity;
//           const dateB = b.applicationPeriod?.end ? new Date(b.applicationPeriod.end).getTime() : Infinity;
//           return dateA - dateB;
//         });
//         break;
//       case "deadline_later":
//         sorted.sort((a, b) => {
//           const dateA = a.applicationPeriod?.end ? new Date(a.applicationPeriod.end).getTime() : 0;
//           const dateB = b.applicationPeriod?.end ? new Date(b.applicationPeriod.end).getTime() : 0;
//           return dateB - dateA;
//         });
//         break;
//       case "title_az":
//         sorted.sort((a, b) => {
//           const titleA = (a.purpose || a.title || "").toLowerCase();
//           const titleB = (b.purpose || b.title || "").toLowerCase();
//           return titleA.localeCompare(titleB);
//         });
//         break;
//       case "title_za":
//         sorted.sort((a, b) => {
//           const titleA = (a.purpose || a.title || "").toLowerCase();
//           const titleB = (b.purpose || b.title || "").toLowerCase();
//           return titleB.localeCompare(titleA);
//         });
//         break;
//     }

//     setFilteredData(sorted);
//     setSortBy(sortOption);
//     setSortModalVisible(false);
//   };

//   const resetFilters = () => {
//     setSelectedArtName("");
//     setSelectedLocation("");
//     setMinAmount("");
//     setMaxAmount("");
//     setSelectedAmountRange("");
//     setSelectedLanguage("");
//     setPerformanceDateFrom("");
//     setPerformanceDateTo("");
//     setDueDateFrom("");
//     setDueDateTo("");
//     setFilteredData(opportunities);
//     setAppliedFilters([]);
//     setFilterModalVisible(false);
//   };

//   const removeFilter = (filterToRemove: string) => {
//     setAppliedFilters(appliedFilters.filter(f => f !== filterToRemove));

//     if (filterToRemove.startsWith("Art:")) setSelectedArtName("");
//     if (filterToRemove.startsWith("Loc:")) setSelectedLocation("");
//     if (filterToRemove.startsWith("Lang:")) setSelectedLanguage("");
//     if (filterToRemove.startsWith("Perf")) {
//       setPerformanceDateFrom("");
//       setPerformanceDateTo("");
//     }
//     if (filterToRemove.startsWith("Due")) {
//       setDueDateFrom("");
//       setDueDateTo("");
//     }

//     const rangeLabels = ["Below ₹5k", "₹5k-₹10k", "₹10k-₹20k", "₹20k-₹50k", "Above ₹50k"];
//     if (rangeLabels.includes(filterToRemove)) {
//       setSelectedAmountRange("");
//     }

//     if (filterToRemove.includes("₹") && (filterToRemove.includes("Min") || filterToRemove.includes("Max") || filterToRemove.includes("-"))) {
//       setMinAmount("");
//       setMaxAmount("");
//     }

//     setTimeout(() => applyFilters(), 100);
//   };

//   const searchFilteredOpportunities = filteredData.filter((item) => {
//     const title = item.title ? item.title.toLowerCase() : "";
//     const description = item.description ? item.description.toLowerCase() : "";
//     const purpose = item.purpose ? item.purpose.toLowerCase() : "";
//     const searchTerm = search.toLowerCase();

//     return title.includes(searchTerm) ||
//            description.includes(searchTerm) ||
//            purpose.includes(searchTerm);
//   });

//   if (loading) {
//     return (
//       <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//         <View style={styles.emptyState}>
//           <ActivityIndicator size="large" color="#AD2F3B" />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   const OpportunityCard = ({ item }: any) => (
//     <View style={styles.card}>
//       <Text style={styles.cardTitle}>{item.purpose || item.title || "Untitled"}</Text>
//       <Text style={styles.cardDesc}>{item.description}</Text>

//       <View style={styles.detailRow}>
//         <Ionicons name="color-palette-outline" size={16} color="#AD2F3B" />
//         <Text style={styles.detailLabel}>Nature of Art:</Text>
//         <Text style={styles.detailValue}>{item.artForm || item.artName || "N/A"}</Text>
//       </View>
//       <View style={styles.detailRow}>
//         <Ionicons name="location-outline" size={16} color="#AD2F3B" />
//         <Text style={styles.detailLabel}>Location:</Text>
//         <Text style={styles.detailValue}>{item.location || "N/A"}</Text>
//       </View>
//       <View style={styles.detailRow}>
//         <Ionicons name="language-outline" size={16} color="#AD2F3B" />
//         <Text style={styles.detailLabel}>Language:</Text>
//         <Text style={styles.detailValue}>
//           {Array.isArray(item.languages) ? item.languages.join(", ") : item.languages || "N/A"}
//         </Text>
//       </View>
//       <View style={styles.detailRow}>
//         <Ionicons name="cash-outline" size={16} color="#AD2F3B" />
//         <Text style={styles.detailLabel}>Amount:</Text>
//         <Text style={styles.detailValue}>
//           {item.budget ? `₹${item.budget}` : "N/A"}
//         </Text>
//       </View>
//       <View style={styles.detailRow}>
//         <Ionicons name="calendar-outline" size={16} color="#AD2F3B" />
//         <Text style={styles.detailLabel}>Date of Performance:</Text>
//         <Text style={styles.detailValue}>
//           {item.performanceDate
//             ? new Date(item.performanceDate).toLocaleDateString()
//             : "N/A"}
//         </Text>
//       </View>
//       <View style={styles.detailRow}>
//         <Ionicons name="alarm-outline" size={16} color="#AD2F3B" />
//         <Text style={styles.detailLabel}>Application Due Date:</Text>
//         <Text style={styles.detailValue}>
//           {item.applicationPeriod?.end ? new Date(item.applicationPeriod.end).toLocaleDateString() : "N/A"}
//         </Text>
//       </View>

//       <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
//         <TouchableOpacity
//           style={styles.infoBtn}
//           onPress={() => (navigation as any).navigate("MoreInformation", { item: JSON.stringify(item) })}
//         >
//           <Text style={styles.infoText}>More Information</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={styles.applyBtn}
//           onPress={() => (navigation as any).navigate("ApplyScreen", { item: JSON.stringify(item) })}
//         >
//           <Text style={styles.applyText}>Apply Now</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <View style={styles.container}>
//         {/* Header */}
//         <View style={styles.header}>
//           <TouchableOpacity
//             style={styles.iconBtn}
//             onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//           >
//             <Ionicons name="menu" size={26} color="#333" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Opportunities</Text>
//           <TouchableOpacity
//             style={styles.iconBtn}
//             onPress={() => navigation.navigate("profile" as never)}
//           >
//             <Ionicons name="person-circle-outline" size={28} color="#333" />
//           </TouchableOpacity>
//         </View>

//         {/* Search Bar */}
//         <View style={styles.searchBar}>
//           <Ionicons name="search-outline" size={20} color="#666" />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search Events"
//             placeholderTextColor="#999"
//             value={search}
//             onChangeText={setSearch}
//           />
//         </View>

//         {/* Filter & Sort */}
//         <View style={styles.filterRow}>
//           <TouchableOpacity
//             style={styles.filterBtn}
//             onPress={() => setFilterModalVisible(true)}
//           >
//             <Ionicons name="filter-outline" size={18} color="#fff" />
//             <Text style={styles.filterText}>Filters</Text>
//             {appliedFilters.length > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>{appliedFilters.length}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.sortBtn}
//             onPress={() => setSortModalVisible(true)}
//           >
//             <MaterialCommunityIcons name="sort" size={18} color="#fff" />
//             <Text style={styles.filterText}>Sort By</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Applied Filters Display */}
//         {appliedFilters.length > 0 && (
//           <View style={styles.appliedFiltersContainer}>
//             <ScrollView
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               contentContainerStyle={styles.appliedFiltersScroll}
//             >
//               {appliedFilters.map((filter, index) => (
//                 <View key={index} style={styles.appliedFilterChip}>
//                   <Text style={styles.appliedFilterText}>{filter}</Text>
//                   <TouchableOpacity onPress={() => removeFilter(filter)}>
//                     <Ionicons name="close-circle" size={16} color="#AD2F3B" />
//                   </TouchableOpacity>
//                 </View>
//               ))}
//               <TouchableOpacity
//                 style={styles.clearAllBtn}
//                 onPress={resetFilters}
//               >
//                 <Text style={styles.clearAllText}>Clear All</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </View>
//         )}

//         {/* Opportunities List */}
//         {searchFilteredOpportunities.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Ionicons name="briefcase-outline" size={70} color="#aaa" />
//             <Text style={styles.emptyText}>No Opportunities Found</Text>
//           </View>
//         ) : (
//           <FlatList
//             data={searchFilteredOpportunities}
//             keyExtractor={(item) => item._id}
//             renderItem={OpportunityCard}
//             contentContainerStyle={{ paddingBottom: 10 }}
//           />
//         )}

//         {/* Filter Modal */}
//         <Modal
//           visible={filterModalVisible}
//           transparent
//           animationType="slide"
//           onRequestClose={() => setFilterModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Filter Opportunities</Text>
//                 <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
//                   <Ionicons name="close" size={28} color="#fff" />
//                 </TouchableOpacity>
//               </View>

//               <ScrollView showsVerticalScrollIndicator={false}>

//                 {/* Art Name */}
//                 <Text style={styles.filterLabel}>Art Name</Text>
//                 <TextInput
//                   style={styles.filterInput}
//                   placeholder="Enter Art Name"
//                   placeholderTextColor="#999"
//                   value={selectedArtName}
//                   onChangeText={setSelectedArtName}
//                 />

//                 {/* Location */}
//                 <Text style={styles.filterLabel}>Location</Text>
//                 <TextInput
//                   style={styles.filterInput}
//                   placeholder="Enter Location"
//                   placeholderTextColor="#999"
//                   value={selectedLocation}
//                   onChangeText={setSelectedLocation}
//                 />

//                 {/* Amount */}
//                 <Text style={styles.filterLabel}>Amount (Custom Range)</Text>
//                 <View style={styles.amountRow}>
//                   <TextInput
//                     style={styles.amountInput}
//                     placeholder="Min"
//                     placeholderTextColor="#999"
//                     value={minAmount}
//                     onChangeText={setMinAmount}
//                     keyboardType="numeric"
//                   />
//                   <TextInput
//                     style={styles.amountInput}
//                     placeholder="Max"
//                     placeholderTextColor="#999"
//                     value={maxAmount}
//                     onChangeText={setMaxAmount}
//                     keyboardType="numeric"
//                   />
//                 </View>

//                 {/* Amount Ranges */}
//                 <Text style={styles.filterLabel}>Or Select Range</Text>
//                 <TouchableOpacity
//                   style={styles.radioRow}
//                   onPress={() => setSelectedAmountRange(selectedAmountRange === "below5000" ? "" : "below5000")}
//                 >
//                   <View style={styles.radio}>
//                     {selectedAmountRange === "below5000" && <View style={styles.radioSelected} />}
//                   </View>
//                   <Text style={styles.radioText}>Below ₹5,000</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.radioRow}
//                   onPress={() => setSelectedAmountRange(selectedAmountRange === "5000-10000" ? "" : "5000-10000")}
//                 >
//                   <View style={styles.radio}>
//                     {selectedAmountRange === "5000-10000" && <View style={styles.radioSelected} />}
//                   </View>
//                   <Text style={styles.radioText}>₹5,000 - ₹10,000</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.radioRow}
//                   onPress={() => setSelectedAmountRange(selectedAmountRange === "10000-20000" ? "" : "10000-20000")}
//                 >
//                   <View style={styles.radio}>
//                     {selectedAmountRange === "10000-20000" && <View style={styles.radioSelected} />}
//                   </View>
//                   <Text style={styles.radioText}>₹10,000 - ₹20,000</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.radioRow}
//                   onPress={() => setSelectedAmountRange(selectedAmountRange === "20000-50000" ? "" : "20000-50000")}
//                 >
//                   <View style={styles.radio}>
//                     {selectedAmountRange === "20000-50000" && <View style={styles.radioSelected} />}
//                   </View>
//                   <Text style={styles.radioText}>₹20,000 - ₹50,000</Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={styles.radioRow}
//                   onPress={() => setSelectedAmountRange(selectedAmountRange === "above50000" ? "" : "above50000")}
//                 >
//                   <View style={styles.radio}>
//                     {selectedAmountRange === "above50000" && <View style={styles.radioSelected} />}
//                   </View>
//                   <Text style={styles.radioText}>Above ₹50,000</Text>
//                 </TouchableOpacity>

//                 {/* Language */}
//                 <Text style={styles.filterLabel}>Language</Text>
//                 <TextInput
//                   style={styles.filterInput}
//                   placeholder="Enter language"
//                   placeholderTextColor="#999"
//                   value={selectedLanguage}
//                   onChangeText={setSelectedLanguage}
//                 />

//                 {/* Performance Date */}
//                 <Text style={styles.filterLabel}>Performance Date Range</Text>
//                 <View style={styles.dateRow}>
//                   <TextInput
//                     style={styles.dateInput}
//                     placeholder="From (YYYY-MM-DD)"
//                     placeholderTextColor="#999"
//                     value={performanceDateFrom}
//                     onChangeText={setPerformanceDateFrom}
//                   />
//                   <TextInput
//                     style={styles.dateInput}
//                     placeholder="To (YYYY-MM-DD)"
//                     placeholderTextColor="#999"
//                     value={performanceDateTo}
//                     onChangeText={setPerformanceDateTo}
//                   />
//                 </View>

//                 {/* Application Due Date */}
//                 <Text style={styles.filterLabel}>Application Due Date Range</Text>
//                 <View style={styles.dateRow}>
//                   <TextInput
//                     style={styles.dateInput}
//                     placeholder="From (YYYY-MM-DD)"
//                     placeholderTextColor="#999"
//                     value={dueDateFrom}
//                     onChangeText={setDueDateFrom}
//                   />
//                   <TextInput
//                     style={styles.dateInput}
//                     placeholder="To (YYYY-MM-DD)"
//                     placeholderTextColor="#999"
//                     value={dueDateTo}
//                     onChangeText={setDueDateTo}
//                   />
//                 </View>

//                 {/* Buttons */}
//                 <View style={styles.buttonRow}>
//                   <TouchableOpacity
//                     style={styles.cancelBtn}
//                     onPress={resetFilters}
//                   >
//                     <Text style={styles.cancelText}>Reset All</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={styles.applyFilterBtn}
//                     onPress={applyFilters}
//                   >
//                     <Text style={styles.applyFilterText}>Apply Filters</Text>
//                   </TouchableOpacity>
//                 </View>
//               </ScrollView>
//             </View>
//           </View>
//         </Modal>

//         {/* Sort Modal */}
//         <Modal
//           visible={sortModalVisible}
//           transparent
//           animationType="slide"
//           onRequestClose={() => setSortModalVisible(false)}
//         >
//           <View style={styles.modalOverlay}>
//             <View style={styles.sortModalContent}>
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Sort By</Text>
//                 <TouchableOpacity onPress={() => setSortModalVisible(false)}>
//                   <Ionicons name="close" size={28} color="#fff" />
//                 </TouchableOpacity>
//               </View>

//               <ScrollView>
//                 <TouchableOpacity
//                   style={[styles.sortOption, sortBy === "amount_low_high" && styles.sortOptionSelected]}
//                   onPress={() => applySort("amount_low_high")}
//                 >
//                   <Ionicons name="trending-up-outline" size={20} color="#fff" />
//                   <Text style={styles.sortOptionText}>Amount: Low to High</Text>
//                   {sortBy === "amount_low_high" && <Ionicons name="checkmark" size={24} color="#AD2F3B" />}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.sortOption, sortBy === "amount_high_low" && styles.sortOptionSelected]}
//                   onPress={() => applySort("amount_high_low")}
//                 >
//                   <Ionicons name="trending-down-outline" size={20} color="#fff" />
//                   <Text style={styles.sortOptionText}>Amount: High to Low</Text>
//                   {sortBy === "amount_high_low" && <Ionicons name="checkmark" size={24} color="#AD2F3B" />}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.sortOption, sortBy === "date_newest" && styles.sortOptionSelected]}
//                   onPress={() => applySort("date_newest")}
//                 >
//                   <Ionicons name="calendar-outline" size={20} color="#fff" />
//                   <Text style={styles.sortOptionText}>Performance Date: Newest First</Text>
//                   {sortBy === "date_newest" && <Ionicons name="checkmark" size={24} color="#AD2F3B" />}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.sortOption, sortBy === "date_oldest" && styles.sortOptionSelected]}
//                   onPress={() => applySort("date_oldest")}
//                 >
//                   <Ionicons name="calendar-outline" size={20} color="#fff" />
//                   <Text style={styles.sortOptionText}>Performance Date: Oldest First</Text>
//                   {sortBy === "date_oldest" && <Ionicons name="checkmark" size={24} color="#AD2F3B" />}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.sortOption, sortBy === "deadline_soon" && styles.sortOptionSelected]}
//                   onPress={() => applySort("deadline_soon")}
//                 >
//                   <Ionicons name="alarm-outline" size={20} color="#fff" />
//                   <Text style={styles.sortOptionText}>Deadline: Soonest First</Text>
//                   {sortBy === "deadline_soon" && <Ionicons name="checkmark" size={24} color="#AD2F3B" />}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.sortOption, sortBy === "deadline_later" && styles.sortOptionSelected]}
//                   onPress={() => applySort("deadline_later")}
//                 >
//                   <Ionicons name="alarm-outline" size={20} color="#fff" />
//                   <Text style={styles.sortOptionText}>Deadline: Latest First</Text>
//                   {sortBy === "deadline_later" && <Ionicons name="checkmark" size={24} color="#AD2F3B" />}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.sortOption, sortBy === "title_az" && styles.sortOptionSelected]}
//                   onPress={() => applySort("title_az")}
//                 >
//                   <Ionicons name="text-outline" size={20} color="#fff" />
//                   <Text style={styles.sortOptionText}>Title: A to Z</Text>
//                   {sortBy === "title_az" && <Ionicons name="checkmark" size={24} color="#AD2F3B" />}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[styles.sortOption, sortBy === "title_za" && styles.sortOptionSelected]}
//                   onPress={() => applySort("title_za")}
//                 >
//                   <Ionicons name="text-outline" size={20} color="#fff" />
//                   <Text style={styles.sortOptionText}>Title: Z to A</Text>
//                   {sortBy === "title_za" && <Ionicons name="checkmark" size={24} color="#AD2F3B" />}
//                 </TouchableOpacity>
//               </ScrollView>
//             </View>
//           </View>
//         </Modal>

//         {/* Bottom Tab Bar */}
//         <BottomTabBar />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
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
//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f3f4f6",
//     margin: 16,
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//   },
//   searchInput: { flex: 1, padding: 8, fontSize: 15, color: "#333" },
//   filterRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginHorizontal: 16,
//     marginBottom: 12,
//   },
//   filterBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#AD2F3B",
//     paddingVertical: 10,
//     borderRadius: 10,
//     elevation: 2,
//     marginRight: 8,
//     position: "relative",
//   },
//   sortBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#1d4ed8",
//     paddingVertical: 10,
//     borderRadius: 10,
//     elevation: 2,
//     marginLeft: 8,
//   },
//   filterText: { color: "#fff", marginLeft: 6, fontSize: 14, fontWeight: "600" },
//   badge: {
//     position: "absolute",
//     top: -6,
//     right: -6,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   badgeText: {
//     color: "#AD2F3B",
//     fontSize: 11,
//     fontWeight: "700",
//   },

//   // Applied Filters Display
//   appliedFiltersContainer: {
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   appliedFiltersScroll: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   appliedFilterChip: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#AD2F3B",
//     borderRadius: 20,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     marginRight: 8,
//   },
//   appliedFilterText: {
//     color: "#AD2F3B",
//     fontSize: 12,
//     fontWeight: "600",
//     marginRight: 6,
//   },
//   clearAllBtn: {
//     backgroundColor: "#f3f4f6",
//     borderRadius: 20,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//   },
//   clearAllText: {
//     color: "#AD2F3B",
//     fontSize: 12,
//     fontWeight: "700",
//   },

//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyText: { marginTop: 12, fontSize: 16, color: "#777", fontWeight: "500" },
//   card: {
//     backgroundColor: "#fff",
//     padding: 16,
//     marginHorizontal: 16,
//     marginVertical: 12,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#AD2F3B",
//     textAlign: "center",
//     marginBottom: 2,
//   },
//   cardDesc: {
//     fontSize: 12,
//     color: "#222",
//     marginBottom: 10,
//     textAlign: "left",
//   },
//   detailRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 2,
//     marginTop: 4,
//   },
//   detailLabel: {
//     color: "#AD2F3B",
//     fontSize: 12,
//     marginLeft: 5,
//     width: 140,
//   },
//   detailValue: {
//     color: "#000",
//     fontSize: 12,
//     marginLeft: 5,
//     fontWeight: "bold",
//   },
//   infoBtn: {
//     borderColor: "#AD2F3B",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     marginRight: 8,
//   },
//   infoText: { color: "#AD2F3B", fontWeight: "600", fontSize: 13 },
//   applyBtn: {
//     backgroundColor: "#AD2F3B",
//     borderRadius: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 22,
//   },
//   applyText: { color: "#fff", fontWeight: "600", fontSize: 13 },

//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: "#4a4a4a",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: "85%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "700",
//   },
//   filterLabel: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   filterInput: {
//     backgroundColor: "#6b6b6b",
//     color: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 14,
//     marginBottom: 8,
//   },
//   amountRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   amountInput: {
//     flex: 1,
//     backgroundColor: "#6b6b6b",
//     color: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 14,
//     marginHorizontal: 4,
//   },
//   dateRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   dateInput: {
//     flex: 1,
//     backgroundColor: "#6b6b6b",
//     color: "#fff",
//     padding: 12,
//     borderRadius: 8,
//     fontSize: 12,
//     marginHorizontal: 4,
//   },
//   radioRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 8,
//   },
//   radio: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     borderColor: "#fff",
//     marginRight: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   radioSelected: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#AD2F3B",
//   },
//   radioText: {
//     color: "#fff",
//     fontSize: 14,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 24,
//     marginBottom: 10,
//   },
//   cancelBtn: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginRight: 8,
//   },
//   cancelText: {
//     color: "#AD2F3B",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   applyFilterBtn: {
//     flex: 1,
//     backgroundColor: "#AD2F3B",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   applyFilterText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   // Sort Modal Styles
//   sortModalContent: {
//     backgroundColor: "#4a4a4a",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: "70%",
//   },
//   sortOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#6b6b6b",
//     padding: 16,
//     borderRadius: 10,
//     marginBottom: 12,
//   },
//   sortOptionSelected: {
//     backgroundColor: "#5a5a5a",
//     borderWidth: 2,
//     borderColor: "#AD2F3B",
//   },
//   sortOptionText: {
//     flex: 1,
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "500",
//     marginLeft: 12,
//   },
// });

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import api from "../../src/services/api";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomTabBar from "../../components/BottomTabBar";

export default function Home() {
  const [search, setSearch] = useState("");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const navigation = useNavigation();

  // Filter States
  const [selectedArtName, setSelectedArtName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedAmountRange, setSelectedAmountRange] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [performanceDateFrom, setPerformanceDateFrom] = useState("");
  const [performanceDateTo, setPerformanceDateTo] = useState("");
  const [dueDateFrom, setDueDateFrom] = useState("");
  const [dueDateTo, setDueDateTo] = useState("");

  // Sort State
  const [sortBy, setSortBy] = useState("");

  // Applied filters for display
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        Alert.alert("Error", "No access token found, please login again");
        setLoading(false);
        return;
      }

      const response = await api.get("/artists/opportunities");
      const data = response.data;
      console.log("Fetched Opportunities API data:", data);

      if (data?.data) {
        setOpportunities(data.data);
        setFilteredData(data.data);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch opportunities");
        setOpportunities([]);
        setFilteredData([]);
      }
    } catch (err: any) {
      console.log("Opportunities error:", err?.response?.data || err);
      Alert.alert(
        "Error",
        err?.response?.data?.message ||
          "Something went wrong while fetching opportunities",
      );
      setOpportunities([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...opportunities];
    const filters: string[] = [];

    // Filter by art name
    if (selectedArtName.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.artForm?.toLowerCase().includes(selectedArtName.toLowerCase()) ||
          item.artName?.toLowerCase().includes(selectedArtName.toLowerCase()),
      );
      filters.push(`Art: ${selectedArtName}`);
    }

    // Filter by location
    if (selectedLocation.trim()) {
      filtered = filtered.filter((item) =>
        item.location?.toLowerCase().includes(selectedLocation.toLowerCase()),
      );
      filters.push(`Loc: ${selectedLocation}`);
    }

    // Filter by amount range
    if (selectedAmountRange) {
      filtered = filtered.filter((item) => {
        const budget = item.budget || 0;
        switch (selectedAmountRange) {
          case "below5000":
            return budget < 5000;
          case "5000-10000":
            return budget >= 5000 && budget <= 10000;
          case "10000-20000":
            return budget >= 10000 && budget <= 20000;
          case "20000-50000":
            return budget >= 20000 && budget <= 50000;
          case "above50000":
            return budget > 50000;
          default:
            return true;
        }
      });

      const rangeLabels: any = {
        below5000: "Below ₹5k",
        "5000-10000": "₹5k-₹10k",
        "10000-20000": "₹10k-₹20k",
        "20000-50000": "₹20k-₹50k",
        above50000: "Above ₹50k",
      };
      filters.push(rangeLabels[selectedAmountRange]);
    }

    // Filter by custom min/max amount
    if (minAmount && maxAmount) {
      const min = parseFloat(minAmount);
      const max = parseFloat(maxAmount);
      filtered = filtered.filter((item) => {
        const budget = item.budget || 0;
        return budget >= min && budget <= max;
      });
      filters.push(`₹${minAmount}-₹${maxAmount}`);
    } else if (minAmount) {
      const min = parseFloat(minAmount);
      filtered = filtered.filter((item) => (item.budget || 0) >= min);
      filters.push(`Min ₹${minAmount}`);
    } else if (maxAmount) {
      const max = parseFloat(maxAmount);
      filtered = filtered.filter((item) => (item.budget || 0) <= max);
      filters.push(`Max ₹${maxAmount}`);
    }

    // Filter by language
    if (selectedLanguage.trim()) {
      filtered = filtered.filter((item) => {
        const langs = Array.isArray(item.languages)
          ? item.languages
          : [item.languages];
        return langs.some((lang: string) =>
          lang?.toLowerCase().includes(selectedLanguage.toLowerCase()),
        );
      });
      filters.push(`Lang: ${selectedLanguage}`);
    }

    // Filter by performance date
    if (performanceDateFrom || performanceDateTo) {
      filtered = filtered.filter((item) => {
        if (!item.performanceDate) return false;
        const perfDate = new Date(item.performanceDate);

        if (performanceDateFrom && performanceDateTo) {
          const from = new Date(performanceDateFrom);
          const to = new Date(performanceDateTo);
          return perfDate >= from && perfDate <= to;
        } else if (performanceDateFrom) {
          const from = new Date(performanceDateFrom);
          return perfDate >= from;
        } else if (performanceDateTo) {
          const to = new Date(performanceDateTo);
          return perfDate <= to;
        }
        return true;
      });

      if (performanceDateFrom && performanceDateTo) {
        filters.push(`Perf: ${performanceDateFrom} to ${performanceDateTo}`);
      } else if (performanceDateFrom) {
        filters.push(`Perf From: ${performanceDateFrom}`);
      } else if (performanceDateTo) {
        filters.push(`Perf Till: ${performanceDateTo}`);
      }
    }

    // Filter by application due date
    if (dueDateFrom || dueDateTo) {
      filtered = filtered.filter((item) => {
        if (!item.applicationPeriod?.end) return false;
        const dueDate = new Date(item.applicationPeriod.end);

        if (dueDateFrom && dueDateTo) {
          const from = new Date(dueDateFrom);
          const to = new Date(dueDateTo);
          return dueDate >= from && dueDate <= to;
        } else if (dueDateFrom) {
          const from = new Date(dueDateFrom);
          return dueDate >= from;
        } else if (dueDateTo) {
          const to = new Date(dueDateTo);
          return dueDate <= to;
        }
        return true;
      });

      if (dueDateFrom && dueDateTo) {
        filters.push(`Due: ${dueDateFrom} to ${dueDateTo}`);
      } else if (dueDateFrom) {
        filters.push(`Due From: ${dueDateFrom}`);
      } else if (dueDateTo) {
        filters.push(`Due Till: ${dueDateTo}`);
      }
    }

    setFilteredData(filtered);
    setAppliedFilters(filters);
    setFilterModalVisible(false);
  };

  const applySort = (sortOption: string) => {
    let sorted = [...filteredData];

    switch (sortOption) {
      case "amount_low_high":
        sorted.sort((a, b) => (a.budget || 0) - (b.budget || 0));
        break;
      case "amount_high_low":
        sorted.sort((a, b) => (b.budget || 0) - (a.budget || 0));
        break;
      case "date_newest":
        sorted.sort((a, b) => {
          const dateA = a.performanceDate
            ? new Date(a.performanceDate).getTime()
            : 0;
          const dateB = b.performanceDate
            ? new Date(b.performanceDate).getTime()
            : 0;
          return dateB - dateA;
        });
        break;
      case "date_oldest":
        sorted.sort((a, b) => {
          const dateA = a.performanceDate
            ? new Date(a.performanceDate).getTime()
            : 0;
          const dateB = b.performanceDate
            ? new Date(b.performanceDate).getTime()
            : 0;
          return dateA - dateB;
        });
        break;
      case "deadline_soon":
        sorted.sort((a, b) => {
          const dateA = a.applicationPeriod?.end
            ? new Date(a.applicationPeriod.end).getTime()
            : Infinity;
          const dateB = b.applicationPeriod?.end
            ? new Date(b.applicationPeriod.end).getTime()
            : Infinity;
          return dateA - dateB;
        });
        break;
      case "deadline_later":
        sorted.sort((a, b) => {
          const dateA = a.applicationPeriod?.end
            ? new Date(a.applicationPeriod.end).getTime()
            : 0;
          const dateB = b.applicationPeriod?.end
            ? new Date(b.applicationPeriod.end).getTime()
            : 0;
          return dateB - dateA;
        });
        break;
      case "title_az":
        sorted.sort((a, b) => {
          const titleA = (a.purpose || a.title || "").toLowerCase();
          const titleB = (b.purpose || b.title || "").toLowerCase();
          return titleA.localeCompare(titleB);
        });
        break;
      case "title_za":
        sorted.sort((a, b) => {
          const titleA = (a.purpose || a.title || "").toLowerCase();
          const titleB = (b.purpose || b.title || "").toLowerCase();
          return titleB.localeCompare(titleA);
        });
        break;
    }

    setFilteredData(sorted);
    setSortBy(sortOption);
    setSortModalVisible(false);
  };

  const resetFilters = () => {
    setSelectedArtName("");
    setSelectedLocation("");
    setMinAmount("");
    setMaxAmount("");
    setSelectedAmountRange("");
    setSelectedLanguage("");
    setPerformanceDateFrom("");
    setPerformanceDateTo("");
    setDueDateFrom("");
    setDueDateTo("");
    setFilteredData(opportunities);
    setAppliedFilters([]);
    setFilterModalVisible(false);
  };

  const removeFilter = (filterToRemove: string) => {
    setAppliedFilters(appliedFilters.filter((f) => f !== filterToRemove));

    if (filterToRemove.startsWith("Art:")) setSelectedArtName("");
    if (filterToRemove.startsWith("Loc:")) setSelectedLocation("");
    if (filterToRemove.startsWith("Lang:")) setSelectedLanguage("");
    if (filterToRemove.startsWith("Perf")) {
      setPerformanceDateFrom("");
      setPerformanceDateTo("");
    }
    if (filterToRemove.startsWith("Due")) {
      setDueDateFrom("");
      setDueDateTo("");
    }

    const rangeLabels = [
      "Below ₹5k",
      "₹5k-₹10k",
      "₹10k-₹20k",
      "₹20k-₹50k",
      "Above ₹50k",
    ];
    if (rangeLabels.includes(filterToRemove)) {
      setSelectedAmountRange("");
    }

    if (
      filterToRemove.includes("₹") &&
      (filterToRemove.includes("Min") ||
        filterToRemove.includes("Max") ||
        filterToRemove.includes("-"))
    ) {
      setMinAmount("");
      setMaxAmount("");
    }

    setTimeout(() => applyFilters(), 100);
  };

  const searchFilteredOpportunities = filteredData.filter((item) => {
    const title = item.title ? item.title.toLowerCase() : "";
    const description = item.description ? item.description.toLowerCase() : "";
    const purpose = item.purpose ? item.purpose.toLowerCase() : "";
    const searchTerm = search.toLowerCase();

    return (
      title.includes(searchTerm) ||
      description.includes(searchTerm) ||
      purpose.includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#AD2F3B" />
        </View>
      </SafeAreaView>
    );
  }

  const OpportunityCard = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {item.purpose || item.title || "Untitled"}
      </Text>
      <Text style={styles.cardDesc}>{item.description}</Text>

      <View style={styles.detailRow}>
        <Ionicons name="color-palette-outline" size={16} color="#AD2F3B" />
        <Text style={styles.detailLabel}>Nature of Art:</Text>
        <Text style={styles.detailValue}>
          {item.artForm || item.artName || "N/A"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="location-outline" size={16} color="#AD2F3B" />
        <Text style={styles.detailLabel}>Location:</Text>
        <Text style={styles.detailValue}>{item.location || "N/A"}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="language-outline" size={16} color="#AD2F3B" />
        <Text style={styles.detailLabel}>Language:</Text>
        <Text style={styles.detailValue}>
          {Array.isArray(item.languages)
            ? item.languages.join(", ")
            : item.languages || "N/A"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="cash-outline" size={16} color="#AD2F3B" />
        <Text style={styles.detailLabel}>Amount:</Text>
        <Text style={styles.detailValue}>
          {item.budget ? `₹${item.budget}` : "N/A"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={16} color="#AD2F3B" />
        <Text style={styles.detailLabel}>Date of Performance:</Text>
        <Text style={styles.detailValue}>
          {item.performanceDate
            ? new Date(item.performanceDate).toLocaleDateString()
            : "N/A"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="alarm-outline" size={16} color="#AD2F3B" />
        <Text style={styles.detailLabel}>Application Due Date:</Text>
        <Text style={styles.detailValue}>
          {item.applicationPeriod?.end
            ? new Date(item.applicationPeriod.end).toLocaleDateString()
            : "N/A"}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <TouchableOpacity
          style={styles.infoBtn}
          onPress={() =>
            (navigation as any).navigate("MoreInformation", {
              item: JSON.stringify(item),
            })
          }
        >
          <Text style={styles.infoText}>More Information</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() =>
            (navigation as any).navigate("ApplyScreen", {
              item: JSON.stringify(item),
            })
          }
        >
          <Text style={styles.applyText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
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
          <Text style={styles.headerTitle}>Opportunities</Text>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("profile" as never)}
          >
            <Ionicons name="person-circle-outline" size={28} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Events"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Filter & Sort */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="filter-outline" size={18} color="#fff" />
            <Text style={styles.filterText}>Filters</Text>
            {appliedFilters.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{appliedFilters.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortModalVisible(true)}
          >
            <MaterialCommunityIcons name="sort" size={18} color="#fff" />
            <Text style={styles.filterText}>Sort By</Text>
          </TouchableOpacity>
        </View>

        {/* Applied Filters Display */}
        {appliedFilters.length > 0 && (
          <View style={styles.appliedFiltersContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.appliedFiltersScroll}
            >
              {appliedFilters.map((filter, index) => (
                <View key={index} style={styles.appliedFilterChip}>
                  <Text style={styles.appliedFilterText}>{filter}</Text>
                  <TouchableOpacity onPress={() => removeFilter(filter)}>
                    <Ionicons name="close-circle" size={16} color="#AD2F3B" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                style={styles.clearAllBtn}
                onPress={resetFilters}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}

        {/* Opportunities List */}
        {searchFilteredOpportunities.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={70} color="#aaa" />
            <Text style={styles.emptyText}>No Opportunities Found</Text>
          </View>
        ) : (
          <FlatList
            data={searchFilteredOpportunities}
            keyExtractor={(item) => item._id}
            renderItem={OpportunityCard}
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        )}

        {/* Filter Modal */}
        <Modal
          visible={filterModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filter Opportunities</Text>
                <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Art Name */}
                <Text style={styles.filterLabel}>Art Name</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Enter Art Name"
                  placeholderTextColor="#999"
                  value={selectedArtName}
                  onChangeText={setSelectedArtName}
                />

                {/* Location */}
                <Text style={styles.filterLabel}>Location</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Enter Location"
                  placeholderTextColor="#999"
                  value={selectedLocation}
                  onChangeText={setSelectedLocation}
                />

                {/* Amount */}
                <Text style={styles.filterLabel}>Amount (Custom Range)</Text>
                <View style={styles.amountRow}>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Min"
                    placeholderTextColor="#999"
                    value={minAmount}
                    onChangeText={setMinAmount}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.amountInput}
                    placeholder="Max"
                    placeholderTextColor="#999"
                    value={maxAmount}
                    onChangeText={setMaxAmount}
                    keyboardType="numeric"
                  />
                </View>

                {/* Amount Ranges */}
                <Text style={styles.filterLabel}>Or Select Range</Text>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() =>
                    setSelectedAmountRange(
                      selectedAmountRange === "below5000" ? "" : "below5000",
                    )
                  }
                >
                  <View style={styles.radio}>
                    {selectedAmountRange === "below5000" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioText}>Below ₹5,000</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() =>
                    setSelectedAmountRange(
                      selectedAmountRange === "5000-10000" ? "" : "5000-10000",
                    )
                  }
                >
                  <View style={styles.radio}>
                    {selectedAmountRange === "5000-10000" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioText}>₹5,000 - ₹10,000</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() =>
                    setSelectedAmountRange(
                      selectedAmountRange === "10000-20000"
                        ? ""
                        : "10000-20000",
                    )
                  }
                >
                  <View style={styles.radio}>
                    {selectedAmountRange === "10000-20000" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioText}>₹10,000 - ₹20,000</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() =>
                    setSelectedAmountRange(
                      selectedAmountRange === "20000-50000"
                        ? ""
                        : "20000-50000",
                    )
                  }
                >
                  <View style={styles.radio}>
                    {selectedAmountRange === "20000-50000" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioText}>₹20,000 - ₹50,000</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() =>
                    setSelectedAmountRange(
                      selectedAmountRange === "above50000" ? "" : "above50000",
                    )
                  }
                >
                  <View style={styles.radio}>
                    {selectedAmountRange === "above50000" && (
                      <View style={styles.radioSelected} />
                    )}
                  </View>
                  <Text style={styles.radioText}>Above ₹50,000</Text>
                </TouchableOpacity>

                {/* Language */}
                <Text style={styles.filterLabel}>Language</Text>
                <TextInput
                  style={styles.filterInput}
                  placeholder="Enter language"
                  placeholderTextColor="#999"
                  value={selectedLanguage}
                  onChangeText={setSelectedLanguage}
                />

                {/* Performance Date */}
                <Text style={styles.filterLabel}>Performance Date Range</Text>
                <View style={styles.dateRow}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="From (YYYY-MM-DD)"
                    placeholderTextColor="#999"
                    value={performanceDateFrom}
                    onChangeText={setPerformanceDateFrom}
                  />
                  <TextInput
                    style={styles.dateInput}
                    placeholder="To (YYYY-MM-DD)"
                    placeholderTextColor="#999"
                    value={performanceDateTo}
                    onChangeText={setPerformanceDateTo}
                  />
                </View>

                {/* Application Due Date */}
                <Text style={styles.filterLabel}>
                  Application Due Date Range
                </Text>
                <View style={styles.dateRow}>
                  <TextInput
                    style={styles.dateInput}
                    placeholder="From (YYYY-MM-DD)"
                    placeholderTextColor="#999"
                    value={dueDateFrom}
                    onChangeText={setDueDateFrom}
                  />
                  <TextInput
                    style={styles.dateInput}
                    placeholder="To (YYYY-MM-DD)"
                    placeholderTextColor="#999"
                    value={dueDateTo}
                    onChangeText={setDueDateTo}
                  />
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={resetFilters}
                  >
                    <Text style={styles.cancelText}>Reset All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.applyFilterBtn}
                    onPress={applyFilters}
                  >
                    <Text style={styles.applyFilterText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Sort Modal */}
        <Modal
          visible={sortModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setSortModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.sortModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sort By</Text>
                <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === "amount_low_high" && styles.sortOptionSelected,
                  ]}
                  onPress={() => applySort("amount_low_high")}
                >
                  <Ionicons name="trending-up-outline" size={20} color="#fff" />
                  <Text style={styles.sortOptionText}>Amount: Low to High</Text>
                  {sortBy === "amount_low_high" && (
                    <Ionicons name="checkmark" size={24} color="#AD2F3B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === "amount_high_low" && styles.sortOptionSelected,
                  ]}
                  onPress={() => applySort("amount_high_low")}
                >
                  <Ionicons
                    name="trending-down-outline"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.sortOptionText}>Amount: High to Low</Text>
                  {sortBy === "amount_high_low" && (
                    <Ionicons name="checkmark" size={24} color="#AD2F3B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === "date_newest" && styles.sortOptionSelected,
                  ]}
                  onPress={() => applySort("date_newest")}
                >
                  <Ionicons name="calendar-outline" size={20} color="#fff" />
                  <Text style={styles.sortOptionText}>
                    Performance Date: Newest First
                  </Text>
                  {sortBy === "date_newest" && (
                    <Ionicons name="checkmark" size={24} color="#AD2F3B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === "date_oldest" && styles.sortOptionSelected,
                  ]}
                  onPress={() => applySort("date_oldest")}
                >
                  <Ionicons name="calendar-outline" size={20} color="#fff" />
                  <Text style={styles.sortOptionText}>
                    Performance Date: Oldest First
                  </Text>
                  {sortBy === "date_oldest" && (
                    <Ionicons name="checkmark" size={24} color="#AD2F3B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === "deadline_soon" && styles.sortOptionSelected,
                  ]}
                  onPress={() => applySort("deadline_soon")}
                >
                  <Ionicons name="alarm-outline" size={20} color="#fff" />
                  <Text style={styles.sortOptionText}>
                    Deadline: Soonest First
                  </Text>
                  {sortBy === "deadline_soon" && (
                    <Ionicons name="checkmark" size={24} color="#AD2F3B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === "deadline_later" && styles.sortOptionSelected,
                  ]}
                  onPress={() => applySort("deadline_later")}
                >
                  <Ionicons name="alarm-outline" size={20} color="#fff" />
                  <Text style={styles.sortOptionText}>
                    Deadline: Latest First
                  </Text>
                  {sortBy === "deadline_later" && (
                    <Ionicons name="checkmark" size={24} color="#AD2F3B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === "title_az" && styles.sortOptionSelected,
                  ]}
                  onPress={() => applySort("title_az")}
                >
                  <Ionicons name="text-outline" size={20} color="#fff" />
                  <Text style={styles.sortOptionText}>Title: A to Z</Text>
                  {sortBy === "title_az" && (
                    <Ionicons name="checkmark" size={24} color="#AD2F3B" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortOption,
                    sortBy === "title_za" && styles.sortOptionSelected,
                  ]}
                  onPress={() => applySort("title_za")}
                >
                  <Ionicons name="text-outline" size={20} color="#fff" />
                  <Text style={styles.sortOptionText}>Title: Z to A</Text>
                  {sortBy === "title_za" && (
                    <Ionicons name="checkmark" size={24} color="#AD2F3B" />
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Bottom Tab Bar */}
        <BottomTabBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    margin: 16,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  searchInput: { flex: 1, padding: 8, fontSize: 15, color: "#333" },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  filterBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#AD2F3B",
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
    marginRight: 8,
    position: "relative",
  },
  sortBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1d4ed8",
    paddingVertical: 10,
    borderRadius: 10,
    elevation: 2,
    marginLeft: 8,
  },
  filterText: { color: "#fff", marginLeft: 6, fontSize: 14, fontWeight: "600" },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#AD2F3B",
    fontSize: 11,
    fontWeight: "700",
  },

  // Applied Filters Display
  appliedFiltersContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  appliedFiltersScroll: {
    flexDirection: "row",
    alignItems: "center",
  },
  appliedFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#AD2F3B",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  appliedFilterText: {
    color: "#AD2F3B",
    fontSize: 12,
    fontWeight: "600",
    marginRight: 6,
  },
  clearAllBtn: {
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearAllText: {
    color: "#AD2F3B",
    fontSize: 12,
    fontWeight: "700",
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { marginTop: 12, fontSize: 16, color: "#777", fontWeight: "500" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#AD2F3B",
    textAlign: "center",
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: "#222",
    marginBottom: 10,
    textAlign: "left",
  },
  // --- UPDATED: alignment fix so long values wrap inside the card instead of overflowing ---
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    marginTop: 4,
  },
  detailLabel: {
    color: "#AD2F3B",
    fontSize: 12,
    marginLeft: 5,
    width: 140,
    flexShrink: 0,
  },
  detailValue: {
    color: "#000",
    fontSize: 12,
    marginLeft: 5,
    fontWeight: "bold",
    flex: 1,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  // --- END UPDATED ---
  infoBtn: {
    borderColor: "#AD2F3B",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  infoText: { color: "#AD2F3B", fontWeight: "600", fontSize: 13 },
  applyBtn: {
    backgroundColor: "#AD2F3B",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 22,
  },
  applyText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#4a4a4a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  filterLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: "#6b6b6b",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    backgroundColor: "#6b6b6b",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    marginHorizontal: 4,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateInput: {
    flex: 1,
    backgroundColor: "#6b6b6b",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    fontSize: 12,
    marginHorizontal: 4,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#AD2F3B",
  },
  radioText: {
    color: "#fff",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    marginBottom: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  cancelText: {
    color: "#AD2F3B",
    fontSize: 16,
    fontWeight: "600",
  },
  applyFilterBtn: {
    flex: 1,
    backgroundColor: "#AD2F3B",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  applyFilterText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Sort Modal Styles
  sortModalContent: {
    backgroundColor: "#4a4a4a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "70%",
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6b6b6b",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  sortOptionSelected: {
    backgroundColor: "#5a5a5a",
    borderWidth: 2,
    borderColor: "#AD2F3B",
  },
  sortOptionText: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 12,
  },
});
