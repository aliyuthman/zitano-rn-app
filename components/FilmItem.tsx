import { Film } from "@/types/interfaces";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FilmItemProps {
  item: Film;
}

const { width } = Dimensions.get("window");

const FilmItem: React.FC<FilmItemProps> = ({ item }) => {
  const id = item.url.split("/").filter(Boolean).pop();
  const [isCrawlExpanded, setIsCrawlExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleCrawl = () => {
    setIsCrawlExpanded(!isCrawlExpanded);
  };

  return (
    <Link href={`/films/${id}`} asChild>
      <TouchableOpacity>
        <View style={styles.card}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.episodeBadge}>
                <Text style={styles.episodeText}>EP {item.episode_id}</Text>
              </View>
            </View>
            <Text style={styles.releaseDate}>
              {formatDate(item.release_date)}
            </Text>
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            {/* Director & Producer Row */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Director</Text>
                <Text style={styles.value}>{item.director}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>Producer</Text>
                <Text style={styles.value}>{item.producer}</Text>
              </View>
            </View>
          </View>

          {/* Footer with subtle accent */}
          <View style={styles.footer} />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default FilmItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  header: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
    marginRight: 12,
    lineHeight: 28,
  },
  episodeBadge: {
    backgroundColor: "#ffd700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ffed4e",
  },
  episodeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000000",
  },
  releaseDate: {
    fontSize: 14,
    color: "#cccccc",
    fontWeight: "500",
  },
  content: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    gap: 20,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    lineHeight: 20,
  },
  footer: {
    height: 4,
    backgroundColor: "#ffd700",
    borderRadius: 2,
    marginTop: 16,
  },
});
