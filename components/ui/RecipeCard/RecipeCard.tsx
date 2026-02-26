import { Recipe } from "@types/recipe";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  recipe: Recipe;
  onPress: () => void;
}

export const RecipeCard = ({ recipe, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      testID="recipe-card"
    >
      <Image
        source={{ uri: recipe.strMealThumb }}
        style={styles.image}
        testID="recipe-image"
      />
      <View style={styles.content} testID="recipe-content">
        <Text style={styles.title} numberOfLines={2} testID="recipe-title">
          {recipe.strMeal}
        </Text>
        {recipe.strCategory && (
          <Text style={styles.category} testID="recipe-category">
            {recipe.strCategory}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: "#666",
  },
});
