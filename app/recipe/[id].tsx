import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "@hooks/useFavorites";
import { recipeApi } from "@services/recipeApi";
import { Recipe } from "@types/recipe";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    loadRecipe();
    checkFavorite();
  }, [id]);

  const loadRecipe = async () => {
    setLoading(true);
    const data = await recipeApi.getRecipeDetails(id);
    setRecipe(data);
    setLoading(false);
  };

  const checkFavorite = async () => {
    const fav = await isFavorite(id);
    setFavorite(fav);
  };

  const toggleFavorite = async () => {
    if (!recipe) return;

    if (favorite) {
      await removeFavorite(id);
      Alert.alert("Sucesso", "Receita removida dos favoritos");
    } else {
      await addFavorite(recipe);
      Alert.alert("Sucesso", "Receita adicionada aos favoritos");
    }
    setFavorite(!favorite);
  };

  const openVideo = () => {
    if (recipe?.strYoutube) {
      Linking.openURL(recipe.strYoutube);
    }
  };

  if (loading || !recipe) return <LoadingSpinner />;

  // Extrair ingredientes
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure });
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <Ionicons
          name={favorite ? "heart" : "heart-outline"}
          size={30}
          color={favorite ? "#ff4444" : "#fff"}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.strMeal}</Text>

        <View style={styles.metaContainer}>
          {recipe.strCategory && (
            <Text style={styles.metaText}>{recipe.strCategory}</Text>
          )}
          {recipe.strArea && (
            <>
              <Text style={styles.metaSeparator}>•</Text>
              <Text style={styles.metaText}>{recipe.strArea}</Text>
            </>
          )}
        </View>

        {recipe.strYoutube && (
          <TouchableOpacity style={styles.videoButton} onPress={openVideo}>
            <Ionicons name="logo-youtube" size={20} color="#ff0000" />
            <Text style={styles.videoButtonText}>Assistir no YouTube</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Ingredientes</Text>
        {ingredients.map((item, index) => (
          <View key={index} style={styles.ingredientRow}>
            <Text style={styles.ingredientText}>
              • {item.ingredient}: {item.measure}
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Modo de Preparo</Text>
        <Text style={styles.instructions}>{recipe.strInstructions}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 25,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  metaText: {
    fontSize: 16,
    color: "#666",
  },
  metaSeparator: {
    fontSize: 16,
    color: "#666",
    marginHorizontal: 8,
  },
  videoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  videoButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
  },
  ingredientRow: {
    marginBottom: 6,
  },
  ingredientText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 22,
  },
  instructions: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "justify",
  },
});
