import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const resourceSections = [
  {
    id: "1",
    title: "Important Links & Resources",
    links: [
      { name: "Government of India: Art-Culture", url: "https://www.india.gov.in" },
      { name: "Indian Culture Portal", url: "https://indianculture.gov.in" },
      { name: "Ministry of Culture – Intangible Cultural Heritage", url: "https://www.indiaculture.nic.in" },
      { name: "Sangeet Natak Akademi", url: "https://sangeetnatak.gov.in" },
      { name: "National School of Drama", url: "https://nsd.gov.in" },
      { name: "Centre for Cultural Resources & Training", url: "https://ccrtindia.gov.in" },
      { name: "Indian Council for Cultural Relations", url: "https://iccr.gov.in" },
      { name: "India Foundation for the Arts", url: "https://indiaifa.org" },
    ],
  },
  {
    id: "2",
    title: "Events & Programmes",
    links: [
      { name: "Spic Macay Events", url: "https://spicmacay.org" },
      { name: "Kala Academy Goa", url: "https://kalaacademygoa.co.in" },
    ],
  },
  {
    id: "3",
    title: "News Updates",
    links: [
      { name: "The Hindu – Arts", url: "https://www.thehindu.com/entertainment/art" },
      { name: "ANI News – Performing Arts", url: "https://www.aninews.in" },
    ],
  },
];

export default function Resources() {
  const navigation = useNavigation();
  const [expanded, setExpanded] = useState<string | null>("1");

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const renderLinks = (links: { name: string; url: string }[]) => (
    <FlatList
      data={links}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.linkCard}
          onPress={() => Linking.openURL(item.url)}
        >
          <Text style={styles.linkText}>{item.name}</Text>
          <Ionicons name="open-outline" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    />
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resources</Text>
        <View style={{ width: 28 }} /> {/* spacer */}
      </View>

      {/* Sections */}
      {resourceSections.map((section) => (
        <View key={section.id} style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleExpand(section.id)}
          >
            <Ionicons name="apps-outline" size={18} color="#b91c1c" />
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Ionicons
              name={expanded === section.id ? "chevron-up" : "chevron-down"}
              size={18}
              color="#333"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          {expanded === section.id && renderLinks(section.links)}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f9fafb",
    elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },

  // Section
  section: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    color: "#222",
  },

  // Link Cards
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#b91c1c",
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  linkText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
