import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const VALID_USERNAME = "admin";
const VALID_PASSWORD = "shiftsync";

export default function LoginScreen({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setIsLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (username.trim() === VALID_USERNAME && password === VALID_PASSWORD) {
      try {
        await AsyncStorage.setItem(
          "@shiftsync_session",
          JSON.stringify({
            username: username.trim(),
            loggedAt: new Date().toISOString(),
          }),
        );
        onLoginSuccess(username.trim());
      } catch {
        setError("Erro ao permanecer sessão. Tente novamente.");
      }
    } else {
      setError("Usuário ou senha incorretos.");
    }

    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.appName}>ShiftSync</Text>
      <Text style={styles.appSubtitle}>Diário de Troca de Turnos</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Login"
          placeholderTextColor="#9CA3AF"
          value={username}
          onChangeText={(t) => {
            setUsername(t);
            setError("");
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        <View style={styles.passwordRow}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              setError("");
            }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((p) => !p)}
            style={styles.eyeButton}
            activeOpacity={0.6}
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8E7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },

  appName: {
    fontSize: 40,
    fontWeight: "900",
    color: "#3d2800",
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
    marginBottom: 48,
  },

  form: {
    width: "100%",
  },

  input: {
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#1F2937",
    marginBottom: 14,
  },

  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  eyeButton: {
    padding: 4,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 13,
    marginBottom: 12,
    marginLeft: 2,
  },

  button: {
    height: 52,
    backgroundColor: "#D08700",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
