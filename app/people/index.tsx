import ListEmptyComponent from "@/components/ListEmpty";
import { colors } from "@/constants/color";
import { ApiResponse, Person } from "@/types/interfaces";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const People = () => {
  const insets = useSafeAreaInsets();
  const [people, setPeople] = useState<Person[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<TextInput>(null);

  const fetchPeople = async (url: string = "https://swapi.info/api/people/", append: boolean = false) => {
    if (!append) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await fetch(url);
      const data: ApiResponse<Person> = await response.json();
      
      if (append) {
        setPeople(prev => [...prev, ...data.results]);
        setFilteredPeople(prev => [...prev, ...data.results]);
      } else {
        setPeople(data.results || []);
        setFilteredPeople(data.results || []);
      }
      
      setNextUrl(data.next);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Error fetching people:", error);
      setError("Failed to load people. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const loadMorePeople = useCallback(() => {
    if (nextUrl && !loadingMore && hasMore) {
      fetchPeople(nextUrl, true);
    }
  }, [nextUrl, loadingMore, hasMore]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredPeople(people || []);
    } else {
      const filtered = (people || []).filter(person =>
        person.name.toLowerCase().includes(query.toLowerCase()) ||
        person.gender.toLowerCase().includes(query.toLowerCase()) ||
        person.birth_year.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPeople(filtered);
    }
  }, [people]);

  useEffect(() => {
    fetchPeople();
  }, []);

  const renderPersonItem = ({ item }: { item: Person }) => {
    const personId = item.url.split("/").filter(Boolean).pop();
    
    return (
      <Link href={`/people/${personId}`} asChild>
        <TouchableOpacity style={styles.personCard}>
          <View style={styles.cardContent}>
            <View style={styles.personHeader}>
              <Text style={styles.personName}>{item.name}</Text>
              <View style={styles.genderBadge}>
                <Ionicons 
                  name={item.gender === 'male' ? 'man' : item.gender === 'female' ? 'woman' : 'help'} 
                  size={16} 
                  color="#000" 
                />
                <Text style={styles.genderText}>{item.gender}</Text>
              </View>
            </View>
            
            <View style={styles.personInfo}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Birth Year</Text>
                  <Text style={styles.infoValue}>{item.birth_year}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Height</Text>
                  <Text style={styles.infoValue}>{item.height} cm</Text>
                </View>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Hair Color</Text>
                  <Text style={styles.infoValue}>{item.hair_color}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Eye Color</Text>
                  <Text style={styles.infoValue}>{item.eye_color}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.filmCount}>
              <Ionicons name="film" size={16} color="#ffd700" />
              <Text style={styles.filmCountText}>{item.films.length} films</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter} />
        </TouchableOpacity>
      </Link>
    );
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.pageTitle}>People</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          ref={searchInputRef}
          style={styles.searchInput}
          placeholder="Search people..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => handleSearch("")}
          >
            <Ionicons name="close" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={styles.resultCount}>
        {filteredPeople?.length || 0} {(filteredPeople?.length || 0) === 1 ? 'person' : 'people'}
        {searchQuery && ` found for "${searchQuery}"`}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#ffd700" />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery("");
    fetchPeople();
  };

  if (error && people.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchPeople()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredPeople || []}
        renderItem={renderPersonItem}
        keyExtractor={(item) => item.url}
        ListEmptyComponent={<ListEmptyComponent loading={loading} />}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
          />
        }
        onEndReached={loadMorePeople}
        onEndReachedThreshold={0.1}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={10}
      />
    </View>
  );
};

export default People;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  resultCount: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  personCard: {
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
  },
  cardContent: {
    padding: 20,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  personName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  genderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffd700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  genderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    textTransform: 'capitalize',
  },
  personInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 20,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  filmCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  filmCountText: {
    fontSize: 14,
    color: '#ffd700',
    fontWeight: '500',
  },
  cardFooter: {
    height: 4,
    backgroundColor: '#ffd700',
    borderRadius: 2,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#000',
    fontWeight: '700',
  },
});