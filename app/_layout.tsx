import { colors } from "@/constants/color";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: "Poppins-Bold",
          fontWeight: "bold",
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.inactive,
          borderTopWidth: 1,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.inactive,
        tabBarLabelStyle: {
          fontFamily: "Poppins-Bold",
          fontWeight: "bold",
        },
        tabBarIconStyle: {
          marginBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="films"
    
        options={{
          title: "All Movies",
          tabBarLabel: "Films",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="people"
        options={{
          title: "All People",
          tabBarLabel: "People",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "My Favorites",
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
