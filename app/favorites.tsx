import { colors } from "@/constants/color";
import { FAVORITE_KEY } from "@/constants/keys";
import { Film } from "@/types/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Favorites = () => {
  const [favorites, setFavorites] = useState<Film[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITE_KEY);
      if (favorites) {
        setFavorites(JSON.parse(favorites) as Film[]);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
    finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const removeFavorite = async (filmToRemove: Film) => {
    try {
      const updatedFavorites = favorites.filter(
        (film) => film.episode_id !== filmToRemove.episode_id
      );
      await AsyncStorage.setItem(FAVORITE_KEY, JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleRemoveFavorite = (film: Film) => {
    Alert.alert(
      "Remove Favorite",
      `Remove "${film.title}" from favorites?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFavorite(film),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Film }) => {
    const id = item.url.split("/").filter(Boolean).pop();
    
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    return (
      <View style={styles.favoriteCard}>
        <Link href={`/films/${id}`} asChild>
          <TouchableOpacity style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.episodeBadge}>
                  <Text style={styles.episodeText}>EP {item.episode_id}</Text>
                </View>
              </View>
              <Text style={styles.releaseDate}>
                {formatDate(item.release_date)}
              </Text>
            </View>

            <View style={styles.cardContent}>
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

            <View style={styles.cardFooter} />
          </TouchableOpacity>
        </Link>
        
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    fetchFavorites();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>⭐</Text>
      </View>
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptySubtitle}>
        Your favorite Star Wars films will appear here
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGradient}>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>
            {favorites.length} {favorites.length === 1 ? 'film' : 'films'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.episode_id.toString()}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={favorites.length === 0 ? styles.emptyListContainer : styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.text]}
            tintColor={colors.text}
          />
        }
      />
    </View>
  );
};

export default Favorites;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerGradient: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyIcon: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 24,
  },
  favoriteCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
    lineHeight: 28,
  },
  episodeBadge: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffed4e',
  },
  episodeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  releaseDate: {
    fontSize: 14,
    color: '#cccccc',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 20,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    lineHeight: 20,
  },
  cardFooter: {
    height: 4,
    backgroundColor: '#ffd700',
    borderRadius: 2,
    marginTop: 16,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
