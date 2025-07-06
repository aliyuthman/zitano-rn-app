import FilmItem from "@/components/FilmItem";
import ListEmptyComponent from "@/components/ListEmpty";
import { colors } from "@/constants/color";
import { Film } from "@/types/interfaces";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

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
    return <FilmItem item={item} />;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFilms();
  };

  return (
    <View style={styles.container}>
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
        ListEmptyComponent={<ListEmptyComponent loading={loading} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Films;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.containerBackground,
  },
  listContainer: {
    paddingVertical: 8,
  },
});
