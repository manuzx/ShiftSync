import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AuthContext } from "./src/context/AuthContext";
import HistoricoScreen from "./src/screens/historicoScreen";
import HomeScreen from "./src/screens/homeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

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

// --- TELA PRINCIPAL (após login) ---
function MainApp() {
  return (
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
  );
}

// --- SPLASH DE CARREGAMENTO ---
function LoadingSplash() {
  return (
    <View style={styles.splashContainer}>
      <View style={styles.splashIconBox}>
        <AntDesign name="clock-circle" size={48} color="white" />
      </View>
      <Text style={styles.splashTitle}>ShiftSync</Text>
      <Text style={styles.splashSubtitle}>Diário de Troca de Turnos</Text>
      <ActivityIndicator
        color="#D08700"
        size="large"
        style={{ marginTop: 32 }}
      />
    </View>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null);

  // Verifica se já existe uma sessão guardada no AsyncStorage
  useEffect(() => {
    const checkSession = async () => {
      try {
        const raw = await AsyncStorage.getItem("@shiftsync_session");
        if (raw) {
          const session = JSON.parse(raw);
          setLoggedUser(session.username);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Erro ao verificar sessão:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Chamado pelo LoginScreen após autenticação bem-sucedida
  const handleLoginSuccess = (username) => {
    setLoggedUser(username);
    setIsLoggedIn(true);
  };

  // Chamado pelo SettingsScreen para terminar a sessão
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@shiftsync_session");
      setLoggedUser(null);
      setIsLoggedIn(false);
    } catch (e) {
      console.error("Erro ao terminar sessão:", e);
    }
  };

  if (isLoading) {
    return <LoadingSplash />;
  }

  return (
    <AuthContext.Provider value={{ loggedUser, logout: handleLogout }}>
      <SafeAreaProvider>
        {!isLoggedIn ? (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        ) : (
          <NavigationContainer>
            <MainApp />
          </NavigationContainer>
        )}
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  // Ecrã principal (após login)
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  // Splash de carregamento
  splashContainer: {
    flex: 1,
    backgroundColor: "#FFF8E7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  splashIconBox: {
    width: 90,
    height: 90,
    backgroundColor: "#D08700",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 8,
    shadowColor: "#D08700",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
  },
  splashTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#3d2800",
    letterSpacing: 1,
  },
  splashSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },

  // Header fixo (dentro do MainApp)
  header: {
    height: 100,
    backgroundColor: "#D08700",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 1,
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

  // Tab bar inferior
  footer: {
    height: 70,
    backgroundColor: "#FFF",
    borderTopWidth: 2,
    borderTopColor: "#ffa600",
    paddingBottom: 10,
    paddingTop: 10,
  },
});
