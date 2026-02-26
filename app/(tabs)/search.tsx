import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { RecipeCard } from "@/components/ui/RecipeCard/RecipeCard";
import { SearchBar } from "@/components/ui/SearchBar/SearchBar";
import { recipeApi } from "@services/recipeApi";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { debounce } from "lodash";
import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => recipeApi.searchRecipes(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const debouncedSearch = useCallback(
    debounce((text: string) => setSearchQuery(text), 500),
    [],
  );

  return (
    <View style={styles.container}>
      <SearchBar
        onChangeText={debouncedSearch}
        placeholder="Digite o nome da receita..."
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              onPress={() => router.push(`/recipe/${item.idMeal}`)}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            searchQuery.length > 2 ? (
              <View style={styles.empty}>
                <Text>Nenhuma receita encontrada</Text>
              </View>
            ) : null
          }
        />
      )}
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
  empty: {
    padding: 20,
    alignItems: "center",
  },
});
