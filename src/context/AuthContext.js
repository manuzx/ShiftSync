import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Estado para armazenar a cor do tema globalmente
  const [themeColor, setThemeColor] = useState('#D08700'); 

  // 2. Função auxiliar para mapear turnos em cores
  const getCorPorTurno = (turno) => {
    switch (turno) {
      case 'Manhã': return '#ffaa00';

      case 'Tarde': return '#ff6200';

      case 'Noite': return '#4F46E5';
      default: return '#D08700';
    }
  };

  useEffect(() => {
    async function loadStorageData() {
      try {
        const stored = await AsyncStorage.getItem("@user_data");
        const storedTurno = await AsyncStorage.getItem("@user_shift");

        if (stored) {
          setUser(JSON.parse(stored));
        }
        
        // 3. Ao abrir o app, recupera a cor do último turno salvo
        if (storedTurno) {
          setThemeColor(getCorPorTurno(storedTurno));
        }
      } catch (error) {
        console.error("Erro ao carregar dados do storage", error);
      } finally {
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  // 4. ESSA É A FUNÇÃO QUE ESTAVA FALTANDO NO SEU ARQUIVO
  async function atualizarTurnoGlobal(novoTurno) {
    try {
      const novaCor = getCorPorTurno(novoTurno);
      setThemeColor(novaCor);
      await AsyncStorage.setItem("@user_shift", novoTurno);
    } catch (e) {
      console.error("Erro ao atualizar tema", e);
    }
  }

  async function login(email, password) {
    if (!email || !password) {
      throw new Error("Por favor, preencha todos os campos.");
    }

    try {
      const registeredEmail = await AsyncStorage.getItem("@user_email");
      const registeredName = await AsyncStorage.getItem("@user_name");
      const isAdmin = email.toLowerCase() === "admin@gmail.com" && password === "12345";
      const isUserMatch = registeredEmail && email.toLowerCase() === registeredEmail.toLowerCase();

      if (isAdmin || isUserMatch) {
        const userData = {
          email: email.toLowerCase(),
          nome: isUserMatch ? registeredName : "Administrador",
        };
        await AsyncStorage.setItem("@user_data", JSON.stringify(userData));
        setUser(userData);
      } else {
        throw new Error("E-mail ou senha incorretos.");
      }
    } catch (error) {
      throw new Error(error.message || "Erro ao tentar fazer login.");
    }
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem("@user_data");
      setUser(null);
      setThemeColor('#D08700'); // Reseta a cor ao deslogar
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  }

  return (
    // 5. IMPORTANTE: themeColor e atualizarTurnoGlobal precisam estar aqui no value
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      themeColor, 
      atualizarTurnoGlobal 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}