import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { RecipeCard } from "@/components/ui/RecipeCard/RecipeCard";
import { useFavorites } from "@hooks/useFavorites";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function FavoritesScreen() {
  const { favorites, loading, refresh } = useFavorites();

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, []),
  );

  if (loading) return <LoadingSpinner />;

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Você ainda não tem receitas favoritas
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => router.push(`/recipe/${item.idMeal}`)}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
