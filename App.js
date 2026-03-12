import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

// Telas
import HomeScreen from "./src/screens/homeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HistoricoScreen from './src/screens/historicoScreen'; 
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

// Contexto
import { AuthProvider, useAuth } from "./src/context/AuthContext";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Header reativo à cor do tema
function Header() {
  const { themeColor } = useAuth(); // Puxa a cor global

  return (
    <View style={[styles.header, { backgroundColor: themeColor }]}>
      <View style={styles.iconBoxHeader}>
        <AntDesign name="clock-circle" size={24} color="white" />
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.headerTitle}>ShiftSync</Text>
        <Text style={styles.headerSubTitle}>Diário de Troca de Turnos</Text>
      </View>
    </View>
  );
}

function TabNavigator() {
  const { themeColor } = useAuth(); // Puxa a cor global para a TabBar

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: [styles.footer, { borderTopColor: themeColor }],
          tabBarActiveTintColor: themeColor, // Cor do ícone selecionado muda aqui
          tabBarInactiveTintColor: "#9CA3AF",
        }}
      >
        <Tab.Screen
          name="NovoRelatorio"
          component={HomeScreen}
          options={{
            tabBarLabel: "Novo",
            tabBarIcon: ({ color }) => <Feather name="plus-circle" size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Historico"
          component={HistoricoScreen}
          options={{
            tabBarLabel: "Histórico",
            tabBarIcon: ({ color }) => <Feather name="file-text" size={24} color={color} />,
          }}
        />
        <Tab.Screen
          name="Config"
          component={SettingsScreen}
          options={{
            tabBarLabel: "Config",
            tabBarIcon: ({ color }) => <SimpleLineIcons name="settings" size={24} color={color} />,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

function AppContent() {
  const { user, loading, themeColor } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={themeColor} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F5F5F5" },
  header: { height: 100, flexDirection: "row", alignItems: "center", paddingHorizontal: 20, elevation: 4 },
  iconBoxHeader: { width: 45, height: 45, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  textGroup: { marginLeft: 15 },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "#FFF" }, // Branco para contrastar melhor com as cores
  headerSubTitle: { fontSize: 13, color: "rgba(255,255,255,0.8)" },
  footer: { height: 70, backgroundColor: "#FFF", borderTopWidth: 3, paddingBottom: 10, paddingTop: 10 },
});