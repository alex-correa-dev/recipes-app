import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { RecipeCard } from "@/components/ui/RecipeCard/RecipeCard";
import { recipeApi } from "@services/recipeApi";
import { useQuery } from "@tanstack/react-query";
import { Recipe } from "@types/recipe";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const category = "Seafood";

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", category],
    queryFn: () => recipeApi.getRecipesByCategory(category),
  });

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.idMeal}`);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container} testID="home-container">
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
        )}
        contentContainerStyle={styles.list}
        testID="recipes-list"
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
});
