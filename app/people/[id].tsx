import { colors } from "@/constants/color";
import { Person } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const PersonDetails = () => {
  const { id } = useLocalSearchParams();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const response = await fetch(`https://swapi.info/api/people/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch person details");
        }
        const data = await response.json();
        setPerson(data);
      } catch (error) {
        console.error("Error fetching person:", error);
        setError("Failed to load person details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPerson();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffd700" />
        <Text style={styles.loadingText}>Loading person details...</Text>
      </View>
    );
  }

  if (error || !person) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>
          {error || "Person not found"}
        </Text>
      </View>
    );
  }

  const formatHeight = (height: string) => {
    if (height === "unknown") return "Unknown";
    return `${height} cm`;
  };

  const formatMass = (mass: string) => {
    if (mass === "unknown") return "Unknown";
    return `${mass} kg`;
  };

  const formatAttribute = (attr: string) => {
    if (attr === "unknown" || attr === "n/a") return "Unknown";
    return attr.charAt(0).toUpperCase() + attr.slice(1);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          title: person.name,
        }}
      />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{person.name}</Text>
          <View style={styles.genderBadge}>
            <Ionicons 
              name={person.gender === 'male' ? 'man' : person.gender === 'female' ? 'woman' : 'help'} 
              size={20} 
              color="#000" 
            />
            <Text style={styles.genderText}>{formatAttribute(person.gender)}</Text>
          </View>
        </View>
        <Text style={styles.birthYear}>Born {person.birth_year}</Text>
      </View>

      {/* Physical Characteristics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Physical Characteristics</Text>
        <View style={styles.characteristicsGrid}>
          <View style={styles.characteristicCard}>
            <Ionicons name="resize" size={24} color="#ffd700" />
            <Text style={styles.characteristicLabel}>Height</Text>
            <Text style={styles.characteristicValue}>{formatHeight(person.height)}</Text>
          </View>
          <View style={styles.characteristicCard}>
            <Ionicons name="fitness" size={24} color="#ffd700" />
            <Text style={styles.characteristicLabel}>Mass</Text>
            <Text style={styles.characteristicValue}>{formatMass(person.mass)}</Text>
          </View>
          <View style={styles.characteristicCard}>
            <Ionicons name="color-palette" size={24} color="#ffd700" />
            <Text style={styles.characteristicLabel}>Hair Color</Text>
            <Text style={styles.characteristicValue}>{formatAttribute(person.hair_color)}</Text>
          </View>
          <View style={styles.characteristicCard}>
            <Ionicons name="eye" size={24} color="#ffd700" />
            <Text style={styles.characteristicLabel}>Eye Color</Text>
            <Text style={styles.characteristicValue}>{formatAttribute(person.eye_color)}</Text>
          </View>
          <View style={styles.characteristicCard}>
            <Ionicons name="body" size={24} color="#ffd700" />
            <Text style={styles.characteristicLabel}>Skin Color</Text>
            <Text style={styles.characteristicValue}>{formatAttribute(person.skin_color)}</Text>
          </View>
        </View>
      </View>

      {/* Statistics Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearances</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="film" size={32} color="#ffd700" />
            <Text style={styles.statNumber}>{person.films.length}</Text>
            <Text style={styles.statLabel}>Films</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="car" size={32} color="#ffd700" />
            <Text style={styles.statNumber}>{person.vehicles.length}</Text>
            <Text style={styles.statLabel}>Vehicles</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="rocket" size={32} color="#ffd700" />
            <Text style={styles.statNumber}>{person.starships.length}</Text>
            <Text style={styles.statLabel}>Starships</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color="#ffd700" />
            <Text style={styles.statNumber}>{person.species.length}</Text>
            <Text style={styles.statLabel}>Species</Text>
          </View>
        </View>
      </View>

      {/* Additional Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Homeworld:</Text>
            <Text style={styles.infoValue}>Available via API</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>
              {new Date(person.created).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Updated:</Text>
            <Text style={styles.infoValue}>
              {new Date(person.edited).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PersonDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: "#ffd700",
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    textAlign: "center",
    marginTop: 16,
  },
  header: {
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
  genderBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffd700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  genderText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
  },
  birthYear: {
    fontSize: 16,
    color: "#ccc",
    fontWeight: "500",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffd700",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  characteristicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  characteristicCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: "#333",
  },
  characteristicLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  characteristicValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 16,
  },
  statCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#333",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    textTransform: "uppercase",
  },
  infoContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
});