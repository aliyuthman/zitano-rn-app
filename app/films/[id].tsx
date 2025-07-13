import { Film } from "@/types/interfaces";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const FAVORITE_KEY = "favorites";

const FilmDetails = () => {
  const { id } = useLocalSearchParams();

  const [film, setFilm] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFilm = async () => {
      try {
        const response = await fetch(`https://swapi.info/api/films/${id}`);
        const data = await response.json();
        setFilm(data);
        checkFavoriteStatus(data.episode_id);
        setLoading(false);
      } catch (error) {
        setError(error as string);
        setLoading(false);
      }
    };
    fetchFilm();
  }, [id]);

  const checkFavoriteStatus = async (filmId: number) => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITE_KEY);
      if (favorites) {
        const favoritesArray = JSON.parse(favorites) as Film[];
        const isFavorite = favoritesArray.some(
          (film) => film.episode_id === filmId
        );
        setIsFavorite(isFavorite);
      }
    } catch (error) {
      console.error("Error checking favorite status:", error);
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    if (!film) return;

    try {
      const favorites = await AsyncStorage.getItem(FAVORITE_KEY);

    let favoriteFilms = favorites ? JSON.parse(favorites) as Film[] : [];

    if (isFavorite) {
      favoriteFilms = favoriteFilms.filter(
        (film: Film) => film.episode_id !== film.episode_id
      );
    } else {
      favoriteFilms.push(film as unknown as Film);
    }

      await AsyncStorage.setItem(
        FAVORITE_KEY,
        JSON.stringify(favoriteFilms)
      );
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading film details...</Text>
      </View>
    );
  }

  if (error || !film) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading film details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#FFD700" : "#FFD700"}
              />
            </TouchableOpacity>
          ),
        }}
      />
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{film.title}</Text>
          <View style={styles.episodeBadge}>
            <Text style={styles.episodeText}>EPISODE {film.episode_id}</Text>
          </View>
        </View>
        <Text style={styles.releaseDate}>{formatDate(film.release_date)}</Text>
      </View>

      {/* Film Information */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Director</Text>
            <Text style={styles.value}>{film.director}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Producer</Text>
            <Text style={styles.value}>{film.producer}</Text>
          </View>
        </View>
      </View>

      {/* Opening Crawl Section */}
      <View style={styles.crawlSection}>
        <View style={styles.crawlHeader}>
          <Text style={styles.crawlTitle}>Opening Crawl</Text>
        </View>
        <View style={styles.crawlContainer}>
          <Text style={styles.openingCrawl}>{film.opening_crawl}</Text>
        </View>
      </View>

      {/* Additional Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Film Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Characters:</Text>
          <Text style={styles.detailValue}>
            {film.characters?.length || 0} characters
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Planets:</Text>
          <Text style={styles.detailValue}>
            {film.planets?.length || 0} planets
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Starships:</Text>
          <Text style={styles.detailValue}>
            {film.starships?.length || 0} starships
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vehicles:</Text>
          <Text style={styles.detailValue}>
            {film.vehicles?.length || 0} vehicles
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Species:</Text>
          <Text style={styles.detailValue}>
            {film.species?.length || 0} species
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default FilmDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  loadingText: {
    fontSize: 18,
    color: "#ffd700",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a0a",
  },
  errorText: {
    fontSize: 18,
    color: "#ff6b6b",
    fontWeight: "600",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
    marginRight: 16,
    lineHeight: 32,
  },
  episodeBadge: {
    backgroundColor: "#ffd700",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ffed4e",
  },
  episodeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
  },
  releaseDate: {
    fontSize: 16,
    color: "#cccccc",
    fontWeight: "500",
  },
  infoSection: {
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  infoRow: {
    flexDirection: "row",
    gap: 24,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
    color: "#ffffff",
    lineHeight: 22,
  },
  crawlSection: {
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  crawlHeader: {
    marginBottom: 16,
  },
  crawlTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffd700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  crawlContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#444444",
  },
  openingCrawl: {
    fontSize: 16,
    color: "#e0e0e0",
    lineHeight: 26,
    fontStyle: "italic",
    textAlign: "justify",
  },
  detailsSection: {
    padding: 20,
    backgroundColor: "#1a1a1a",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffd700",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#cccccc",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
