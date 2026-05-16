import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CacheDetails from "../components/CacheDetails";
import { useState } from "react";
import { GPXCache } from "../models/Cache";
import { useCacheStore } from "../utils/cacheStore";

const mockedFavourites = [
  { code: "GC524321", name: "Supersura SilverSara", type: "Mystery" },
  { code: "GC096443", name: "Forsande forsen", type: "Traditional" },
  { code: "GC432674", name: "Häxan Surtant", type: "Letterbox" },
];

const COLORS = {
  background: "#2f3a2d",
  card: "#3a4637",
  cardLight: "#465442",
  accent: "#7cb342",
  accentDark: "#2e7d32",
  text: "#f4f4f4",
  textSecondary: "#e1eedb",
  border: "#556052",
};

export default function FavoritesScreen(){
    const [selectedCache, setSelectedCache] = useState<GPXCache | null>(null);
  
  const isFound = useCacheStore((s) => s.isFound);
  const selectedCacheFound = selectedCache ? isFound(selectedCache) : false;
  return(
    <View style={styles.container}>
          <Text style={styles.title}>Favoriter</Text>
          {mockedFavourites.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="heart-off" size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>Inga favoriter än</Text>
            </View>
          ) : (
            <FlatList
              data={mockedFavourites}
              keyExtractor={(item) => item.code}
              contentContainerStyle={{ paddingBottom: 40 }}
              renderItem={({ item }) => (
                <Pressable style={styles.card} onPress={() => setSelectedCache(item as unknown as GPXCache)}>
                  <View style={styles.iconWrapper}>
                    <MaterialCommunityIcons
                      name="heart"
                      size={20}
                      color={"#ce4747"}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.meta}>{item.code} • {item.type}</Text>
                  </View>
                  {/* <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.border}
                  /> */}
                </Pressable>
              )}
            />
          )}
          <CacheDetails
            cache={selectedCache}
            found={selectedCacheFound}
            onClose={() => setSelectedCache(null)}
           />
        </View>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: 60,
        paddingHorizontal: 16,
        width: "100%"
      },
      title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.text,
        marginBottom: 24,
      },
      empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      },
      emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
      },
      card: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: COLORS.card,
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.cardLight,
        alignItems: "center",
        justifyContent: "center",
      },
      name: {
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.text,
      },
      meta: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
      },
    });