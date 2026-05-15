import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
// import { DUMMY_CACHES } from "../utils/dummyCaches";
import { useCacheStore } from "../utils/cacheStore";

import CacheMarker from "../components/CacheMarker";
import CacheDetails from "../components/CacheDetails";
import { GPXCache } from "../models/Cache";
import { initDB, loadCaches } from '../db/database';

const FALLBACK_REGION: Region = {
  latitude: 57.6969,
  longitude: 11.979,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCache, setSelectedCache] = useState<GPXCache | null>(null); 
  // const { caches, isFound } = useCacheStore();
const setCaches = useCacheStore((s) => s.setCaches);
  const caches = useCacheStore((s) => s.caches);
const isFound = useCacheStore((s) => s.isFound);
const username = useCacheStore((s) => s.username);

useEffect(() => {
  initDB();
  loadCaches().then((cached) => {
    if (cached.length > 0) setCaches(cached);
  });
}, [username]);

  useEffect(() => {
    let subscriber: Location.LocationSubscription | null = null;
    if(caches){
      console.log("Caches from store", caches)
      console.log("cachetype",caches.map(c => c.type));
    }
  

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      subscriber = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10 },
        (location) => {
          setUserLocation(location);

          // Flytta kartan till användaren första gången
          if (!region) {
            mapRef.current?.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            });
          }
        },
      );
    })();

    return () => {
      subscriber?.remove();
    };
  }, []);

  const centerOnUser = () => {
    if (!userLocation) return;
    mapRef.current?.animateToRegion({
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
  };
  const selectedCacheFound =
  selectedCache ? isFound(selectedCache) : false;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={FALLBACK_REGION}
        showsUserLocation
        showsMyLocationButton={false}
        removeClippedSubviews
  maxZoomLevel={18}
  minZoomLevel={5}
  loadingEnabled
  loadingIndicatorColor="#2e7d32"
      >
        {caches.map((cache: any) => (
          <Marker
            key={cache.code}
            coordinate={{ latitude: cache.lat, longitude: cache.lng }}
            onPress={() => setSelectedCache(cache)}
          >
            <CacheMarker type={cache.type} found={isFound(cache)} />
          </Marker>
        ))}
      </MapView>
      {!region && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2e7d32" />
          <Text>Hämtar position...</Text>
        </View>
      )}
      <TouchableOpacity style={styles.locationButton} onPress={centerOnUser}>
        <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#fff" />
      </TouchableOpacity>
      <CacheDetails
        cache={selectedCache}
        found={selectedCacheFound}
        onClose={() => setSelectedCache(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  locationButton: {
    position: "absolute",
    bottom: 92,
    right: 16,
    backgroundColor: "#2e7d32",
    borderRadius: 50,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
