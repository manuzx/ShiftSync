import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    setError("");
    setLoading(true);
    const success = await login(email.trim(), password);
    setLoading(false);
    if (!success) {
      setError("E-mail ou senha inválidos.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <AntDesign name="clock-circle" size={36} color="white" />
        </View>
        
        <Text style={styles.title}>ShiftSync</Text>
        <Text style={styles.subtitle}>Diário de Troca de Turnos</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "88%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    elevation: 4,
  },
  iconBox: {
    width: 70,
    height: 70,
    backgroundColor: "#D08700",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#3d2800",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 28,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#333",
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  error: {
    color: "#c0392b",
    fontSize: 13,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#D08700",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});