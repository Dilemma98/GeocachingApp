import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

type CacheStyle = {
  icon: string;
  color: string;
};

const CACHE_STYLE: Record<string, CacheStyle> = {
  Traditional: { icon: "map-marker", color: "#2e7d32" },
  "Multi-cache": { icon: "map-marker-path", color: "#e65100" },
  Unknown: { icon: "help-circle", color: "#1565c0" },
  Virtual: { icon: "eye", color: "#6a1b9a" },
  "Letterbox Hybrid": { icon: "mailbox", color: "#4e342e" },
  Wherigo: { icon: "compass", color: "#00838f" },
  Event: { icon: "calendar-star", color: "#ff6f00" },
  EarthCache: { icon: "earth", color: "#558b2f" },
};

function getCacheIcon(type?: string): CacheStyle {
  return (
    CACHE_STYLE[type ?? ""] ?? {
      icon: "package-variant",
      color: "#757575",
    }
  );
}

interface Props {
  type?: string;
  found?: boolean;
}

export default function CacheMarker({ type, found }: Props) {
  const { icon, color } = getCacheIcon(type);

  const markerColor = found ? "#ffd000" : color;

  const iconName = found ? "emoticon-happy" : icon;

return (
  <View
    style={[
      styles.container,
      {
        borderColor: markerColor,

        // shadowColor: "#000",
        // shadowOffset: {
        //   width: 0,
        //   height: 2,
        // },
        // shadowOpacity: 0.9,
        // shadowRadius: 6,

        // elevation: 6,
      },
    ]}
  >
    <MaterialCommunityIcons
      name={iconName as any}
      size={20}
      color={markerColor}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 1,
    borderWidth: 2,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.9,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
});