
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomTabBar() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const currentRoute = route.name;

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('home' as never)}
        style={styles.tabButton}
      >
        <Ionicons 
          name="bag-handle" 
          size={22} 
          color={currentRoute === 'home' ? '#b91c1c' : '#444'} 
        />
        <Text style={currentRoute === 'home' ? styles.navActive : styles.navText}>
          Opportunities
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('applications' as never)}
        style={styles.tabButton}
      >
        <Ionicons 
          name="globe-outline" 
          size={22} 
          color={currentRoute === 'applications' ? '#b91c1c' : '#444'} 
        />
        <Text style={currentRoute === 'applications' ? styles.navActive : styles.navText}>
          Applications
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('skill-development' as never)}
        style={styles.tabButton}
      >
        <Ionicons 
          name="bar-chart-outline" 
          size={22} 
          color={currentRoute === 'skill-development' ? '#b91c1c' : '#444'} 
        />
        <Text style={currentRoute === 'skill-development' ? styles.navActive : styles.navText}>
          Skill Development
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate('news-update' as never)}
        style={styles.tabButton}
      >
        <Ionicons 
          name="newspaper-outline" 
          size={22} 
          color={currentRoute === 'news-update' ? '#b91c1c' : '#444'} 
        />
        <Text style={currentRoute === 'news-update' ? styles.navActive : styles.navText}>
          News
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  tabButton: {
    alignItems: 'center',
  },
  navText: { 
    fontSize: 12, 
    color: "#444", 
    textAlign: "center", 
    marginTop: 2 
  },
  navActive: {
    fontSize: 12,
    color: "#b91c1c",
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },
});

