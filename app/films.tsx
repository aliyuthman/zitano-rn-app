import { colors } from "@/constants/color";
import { Film } from "@/types/interfaces";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

const Films = () => {
  const [films, setFilms] = useState<Film[]>([]);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFilms = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://swapi.info/api/films/");
      const data = await response.json();
      console.log("API Response:", data);
      setFilms(data.results || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const renderItem = ({ item }: { item: Film }) => {
    console.log(item);
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    );
  };

  console.log("Films array:", films, "Length:", films.length);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFilms();
  };

  return (
    <View style={styles.container}>
      {loading && <Text>Loading films...</Text>}
      {!loading && films.length === 0 && <Text>No films found</Text>}
      <FlatList
        data={films}
        renderItem={renderItem}
        keyExtractor={(item) => item.episode_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.text}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No films found</Text>
        }
      />
    </View>
  );
};

export default Films;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.containerBackground,
  },
  item: {
    backgroundColor: colors.text,
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.text,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.containerBackground,
  },
  empty: {
    fontSize: 20,
    color: colors.text,
    textAlign: "center",
    marginTop: 20,
  },
});
