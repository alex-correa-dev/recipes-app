import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { RecipeCard } from "@/components/ui/RecipeCard/RecipeCard";
import { recipeApi } from "@services/recipeApi";
import { useQuery } from "@tanstack/react-query";
import { Recipe } from "@types/recipe";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Seafood");

  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes", selectedCategory],
    queryFn: () => recipeApi.getRecipesByCategory(selectedCategory),
  });

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe/${recipe.idMeal}`);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
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
});
