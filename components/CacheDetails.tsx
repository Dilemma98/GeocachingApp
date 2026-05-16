import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Cache } from "../models/Cache";
import RenderHTML, { defaultSystemFonts } from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { useCacheStore } from "../utils/cacheStore";

interface Props {
  cache: Cache | null;
  found: boolean;
  onClose: () => void;
}

export default function CacheDetails({ cache, found, onClose }: Props) {
  const bottomRef = useRef<BottomSheet>(null);
  const { width } = useWindowDimensions();
  const [renderHTML, setRenderHTML] = useState(false);
  const { logCache } = useCacheStore();

  useEffect(() => {
    setRenderHTML(false);

    if (!cache) return;

    const t = setTimeout(() => {
      setRenderHTML(true);
    }, 80);

    return () => clearTimeout(t);
  }, [cache]);

  if (!cache) return null;

  const cleanedHtml = cache.description?.replace(/<img[^>]*>/g, "");

  return (
    <BottomSheet
      ref={bottomRef}
      snapPoints={["40%", "90%"]}
      index={0}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{
        backgroundColor: "#1e1e1eed",
      }}
    >
      <BottomSheetScrollView
        style={styles.container}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{cache.name}</Text>
          <View style={{ display: "flex", flexDirection: "row", gap: 10}}>
            <View style={{ marginTop: 5}}>
              <MaterialCommunityIcons name="heart-outline" size={28} color={"red"} />
            </View>
          {found ? (
            <MaterialCommunityIcons
              name="emoticon-happy"
              size={28}
              color="#ffd000"
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                logCache(cache.code);
                bottomRef.current?.close();
              }}
              style={styles.quickLogButton}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={28}
                color="#2e7d32"
              />
            </TouchableOpacity>
          )}
          </View>
        </View>
        <Text style={styles.code}># {cache.code}</Text>
        <Text style={styles.type}>{cache.type}</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="star" size={18} color="#f9a825" />
            <Text style={styles.statLabel}>Svårighet</Text>
            <Text style={styles.statValue}>{cache.difficulty}/5</Text>
          </View>
          <View style={styles.stat}>
            <MaterialCommunityIcons name="terrain" size={18} color="#2e7d32" />
            <Text style={styles.statLabel}>Terräng</Text>
            <Text style={styles.statValue}>{cache.terrain}/5</Text>
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.infoTitle}>Beskrivning</Text>

          {renderHTML && (
            <RenderHTML
              contentWidth={width}
              // source={{ html: cleanedHtml  ?? "" }}
              source={{ html: cache.description ?? "" }}
              baseStyle={styles.infoText}
              renderersProps={{
                img: {
                  enableExperimentalPercentWidth: true,
                },
              }}
              tagsStyles={{
                img: {
                  alignSelf: "center",
                  maxWidth: width * 0.8,
                  height: "auto",
                  borderRadius: 12,
                },
              }}
            />
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
const TEXT_PRIMARY = "#fff";
const TEXT_SECONDARY = "#b0b0b0";
const ACCENT = "#ffd000";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  code: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_SECONDARY,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: TEXT_PRIMARY,
    marginBottom: 4,
  },

  type: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    marginBottom: 16,
  },

  stats: {
    flexDirection: "row",
    gap: 24,
  },

  stat: {
    alignItems: "center",
    gap: 4,
  },

  statLabel: {
    fontSize: 12,
    color: TEXT_SECONDARY,
  },

  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: TEXT_PRIMARY,
  },
  info: {
    marginTop: 24,
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 120,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_SECONDARY,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: TEXT_PRIMARY,
  },
  quickLogButton: {
    padding: 6,
    borderRadius: 20,
  },
});
