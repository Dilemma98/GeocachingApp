import React from "react";
import { Pressable, StyleSheet, Dimensions, View } from "react-native";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

const SCREEN_WIDTH = Dimensions.get("window").width;

const TAB_BAR_WIDTH = SCREEN_WIDTH - 40;

function AnimatedTabBar({ state, descriptors, navigation }: any) {
  return (
    <BlurView intensity={35} tint="dark" style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            <View
              style={[
                styles.iconWrapper,
                isFocused && styles.iconWrapperActive,
              ]}
            >
              {options.tabBarIcon?.({
                color: isFocused ? "#b8ffbf" : "#64c16c",
                focused: isFocused,
                size: isFocused ? 26 : 24,
              })}
            </View>
          </Pressable>
        );
      })}
    </BlurView>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <AnimatedTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="favourites"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    position: "absolute",
    bottom: 20,
    left: 20,
    width: TAB_BAR_WIDTH,
    height: 58,
    borderRadius: 28,
    overflow: "hidden",
    alignItems: "center",
    backgroundColor: "rgba(20,40,20,0.7)",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapper: {
    padding: 6,
    borderRadius: 16,
  },

  iconWrapperActive: {
    backgroundColor: "#123a16",
    borderRadius: 20,
    padding: 10
  },
});