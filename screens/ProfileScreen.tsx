import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { parseGPX } from "../services/gpx/parser";
import { GPXCache } from "../models/Cache";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCacheStore } from "../utils/cacheStore";
import { initDB, saveCaches, loadCaches } from "../db/database";

export default function Profile() {
  const { caches, addCaches, username, setUsername, isFound, setCaches } =
    useCacheStore();
  const [tempName, setTempName] = useState(username ?? "");
  const [showCaches, setShowCaches] = useState(false);

  const foundCount = caches.filter(isFound).length;
  const totalCount = caches.length;
  const notFoundCount = totalCount - foundCount;

  const typeCounts = caches.reduce((acc: Record<string, number>, cache) => {
    const type = cache.type ?? "Okänd";
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});

  useEffect(() => {
    initDB();
    loadCaches().then((cached) => {
      if (cached.length > 0) setCaches(cached);
    });
  }, []);

  const importGPX = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      multiple: true,
    });
    if (result.canceled) return;
    const allCaches: GPXCache[] = [];
    for (const file of result.assets) {
      const content = await FileSystem.readAsStringAsync(file.uri);
      const parsed = await parseGPX(content, username);
      allCaches.push(...parsed);
    }
    addCaches(allCaches);
    await saveCaches(allCaches);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="map-marker" size={34} color="#fff" />
        </View>
        <Text style={styles.username}>
          {username?.trim() || "Ange ditt geocaching-nick"}
        </Text>
      </View>

      {/* NICK INPUT */}
      {!username && (
        <View style={styles.section}>
          <Text style={styles.label}>Ditt Geocaching-nick:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="T.ex. pluto2se"
              placeholderTextColor="#aaa"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[styles.saveButton, !tempName.trim() && { opacity: 0.5 }]}
              disabled={!tempName.trim()}
              onPress={() => setUsername(tempName.trim())}
            >
              <Text style={styles.saveText}>Spara</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STATISTIK */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistik</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Totalt</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: "#e8f5e9" }]}>
            <Text style={[styles.statNumber, { color: "#2e7d32" }]}>{foundCount}</Text>
            <Text style={styles.statLabel}>Hittade</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: "#fff3e0" }]}>
            <Text style={[styles.statNumber, { color: "#e65100" }]}>{notFoundCount}</Text>
            <Text style={styles.statLabel}>Kvar</Text>
          </View>
        </View>

        {/* TYPER */}
        {Object.entries(typeCounts).map(([type, count]) => (
          <View key={type} style={styles.typeRow}>
            <Text style={styles.typeLabel}>{type}</Text>
            <Text style={styles.typeCount}>{count} st</Text>
          </View>
        ))}
      </View>

      {/* IMPORT */}
      <TouchableOpacity style={styles.importCard} onPress={importGPX}>
        <MaterialCommunityIcons name="file-import" size={22} color="#2e7d32" />
        <Text style={styles.importText}>Importera GPX filer</Text>
      </TouchableOpacity>

      {/* VISA IMPORTERADE */}
      {totalCount > 0 && (
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowCaches(!showCaches)}
        >
          <Text style={styles.toggleText}>
            {showCaches ? "Dölj importerade cacher" : `Visa ${totalCount} importerade cacher`}
          </Text>
          <MaterialCommunityIcons
            name={showCaches ? "chevron-up" : "chevron-down"}
            size={20}
            color="#2e7d32"
          />
        </TouchableOpacity>
      )}

      {showCaches && (
        <FlatList
          data={caches}
          keyExtractor={(item) => item.code}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.cacheCard}>
              <View style={styles.cacheLeft}>
                <MaterialCommunityIcons
                  name={isFound(item) ? "emoticon-happy" : "map-marker"}
                  size={20}
                  color={isFound(item) ? "#ffd000" : "#2e7d32"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cacheName}>{item.name}</Text>
                <Text style={styles.cacheCode}>{item.code} • {item.type}</Text>
              </View>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
    width: "100%"
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  typeLabel: {
    fontSize: 14,
    color: "#555",
  },
  typeCount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#1a1a1a",
  },
  saveButton: {
    backgroundColor: "#2e7d32",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
  },
  importCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  importText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2e7d32",
  },
  toggleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2e7d32",
  },
  cacheCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cacheLeft: {
    width: 32,
    alignItems: "center",
  },
  cacheName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  cacheCode: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});