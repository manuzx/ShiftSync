// Importa a biblioteca principal do React
import React from "react";

// Importa componentes nativos do React Native
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

// Importa o NavigationContainer (O GPS do app)
import { NavigationContainer } from "@react-navigation/native";

// Importa a navegação por abas
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Importa provedores de área segura (Safe Area)
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Importa as famílias de ícones
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

// Importa as telas (Corrigido o import duplicado aqui)
import HomeScreen from "./src/screens/homeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HistoricoScreen from './src/screens/historicoScreen'; // Import único
import LoginScreen from "./src/screens/LoginScreen";

// Importa o Contexto de Autenticação
import { AuthProvider, useAuth } from "./src/context/AuthContext";

const Tab = createBottomTabNavigator();

// --- COMPONENTE DE HEADER ---
function Header() {
  return (
    <View style={styles.header}>
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

// --- CONTEÚDO DO APP (Lógica de Login e Navegação) ---
function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#D08700" />
      </View>
    );
  }

  // Se não estiver logado, mostra a tela de Login
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
        <Header />

        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: styles.footer,
            tabBarActiveTintColor: "#D08700",
            tabBarInactiveTintColor: "black",
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: "bold",
              marginBottom: 5,
            },
          }}
        >
          {/* Aba Novo Relatório */}
          <Tab.Screen
            name="NovoRelatorio"
            component={HomeScreen}
            options={{
              tabBarLabel: "Novo",
              tabBarIcon: ({ color }) => (
                <Feather name="plus-circle" size={24} color={color} />
              ),
            }}
          />

          {/* Aba Histórico - NOME IMPORTANTE PARA A NAVEGAÇÃO */}
          <Tab.Screen
            name="Historico"
            component={HistoricoScreen}
            options={{
              tabBarLabel: "Histórico",
              tabBarIcon: ({ color }) => (
                <Feather name="file-text" size={24} color={color} />
              ),
            }}
          />

          {/* Aba Configurações */}
          <Tab.Screen
            name="Config"
            component={SettingsScreen}
            options={{
              tabBarLabel: "Config",
              tabBarIcon: ({ color }) => (
                <SimpleLineIcons name="settings" size={24} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 100,
    backgroundColor: "#D08700",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 4,
  },
  iconBoxHeader: {
    width: 45,
    height: 45,
    backgroundColor: "#d59011",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  textGroup: {
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#3d2800",
  },
  headerSubTitle: {
    fontSize: 14,
    color: "#343434",
  },
  footer: {
    height: 70,
    backgroundColor: "#FFF",
    borderTopWidth: 2,
    borderTopColor: "#ffa600",
    paddingBottom: 10,
    paddingTop: 10,
  },
});