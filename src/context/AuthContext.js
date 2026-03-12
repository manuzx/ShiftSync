import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega os dados salvos assim que o App abre
  useEffect(() => {
    async function loadStorageData() {
      try {
        const stored = await AsyncStorage.getItem("@user_data");
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do storage", error);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  /**
   * Função de Login
   * Agora ela verifica tanto o Admin fixo quanto o usuário 
   * que você cadastrou na RegisterScreen.
   */
  async function login(email, password) {
    if (!email || !password) {
      throw new Error("Por favor, preencha todos os campos.");
    }

    try {
      // Buscamos os dados que foram gravados no AsyncStorage pela RegisterScreen
      const registeredEmail = await AsyncStorage.getItem("@user_email");
      const registeredName = await AsyncStorage.getItem("@user_name");

      // Verificação 1: É o Administrador padrão?
      const isAdmin = email.toLowerCase() === "admin@gmail.com" && password === "12345";

      // Verificação 2: É o usuário que se registrou no celular?
      // (Aqui comparamos o e-mail digitado com o e-mail salvo no registro)
      const isUserMatch = registeredEmail && email.toLowerCase() === registeredEmail.toLowerCase();

      if (isAdmin || isUserMatch) {
        // Montamos o objeto do usuário com os dados corretos
        const userData = {
          email: email.toLowerCase(),
          nome: isUserMatch ? registeredName : "Administrador",
        };

        // Salvamos o objeto completo para o useEffect ler na próxima vez que abrir o app
        await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
        
        // Atualizamos o estado global para liberar o acesso às abas (Tabs)
        setUser(userData);
      } else {
        throw new Error("E-mail ou senha incorretos.");
      }
    } catch (error) {
      throw new Error(error.message || "Erro ao tentar fazer login.");
    }
  }

  /**
   * Função de Logout
   * Limpa os dados de sessão, mas mantém os dados de registro 
   * no celular para o próximo login.
   */
  async function logout() {
    try {
      await AsyncStorage.removeItem("@user_data");
      setUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto de forma fácil
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}