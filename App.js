// Importa a biblioteca principal do React para criar componentes
import React from "react";

// Importa componentes nativos do React Native para estruturar a interface (Estilos, Containers, Texto e Rolagem)
import { StyleSheet, View, Text, ScrollView } from "react-native";

// Importa o NavigationContainer, que é o "GPS" principal que gerencia o estado da navegação do app
import { NavigationContainer } from "@react-navigation/native"; 

// Importa a função para criar a navegação por abas (Bottom Tabs) na parte inferior da tela
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 

// Importa provedores de área segura para que o conteúdo não fique "escondido" sob entalhes (notches) ou câmeras
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; 

// Importa as famílias de ícones do Expo para usar na interface e na barra de navegação
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

// Importa os componentes de tela em arquivos separados na pasta 'screens'
import HomeScreen from "./src/screens/homeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import HistoricoScreen from "./src/screens/historicoScreen";

// Inicializa a navegação por abas e armazena na constante Tab para ser usada como componente
const Tab = createBottomTabNavigator();

// --- COMPONENTE DE HEADER (Cabeçalho personalizado que se repete no app) ---
function Header() {
  return (
    // View principal do cabeçalho com estilo de cor e alinhamento
    <View style={styles.header}>
      {/* Quadrado arredondado que contém o ícone do relógio */}
      <View style={styles.iconBoxHeader}>
        <AntDesign name="clock-circle" size={24} color="white" />
      </View>
      {/* Grupo de textos alinhados à direita do ícone */}
      <View style={styles.textGroup}>
        <Text style={styles.headerTitle}>ShiftSync</Text>
        <Text style={styles.headerSubTitle}>Diário de Troca de Turnos</Text>
      </View>
    </View>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  return (
    // Provedor que gerencia os cálculos de áreas seguras (notch, barras de sistema) em todo o app
    <SafeAreaProvider>
      {/* Container que envolve toda a lógica de rotas; deve haver apenas UM no projeto */}
      <NavigationContainer>
        {/* SafeAreaView impede que o Header "suba" para dentro da barra de status do celular */}
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          
          {/* Renderiza o cabeçalho fixo no topo, acima da navegação de telas */}
          <Header />
          
          {/* Define o navegador de abas e suas configurações visuais globais */}
          <Tab.Navigator
            screenOptions={{
              headerShown: false, // Esconde o título padrão do React Navigation para usarmos o nosso Header
              tabBarStyle: styles.footer, // Aplica o estilo personalizado à barra inferior
              tabBarActiveTintColor: "#D08700", // Cor do ícone/texto quando a aba está selecionada
              tabBarInactiveTintColor: "black", // Cor do ícone/texto quando a aba NÃO está selecionada
              tabBarLabelStyle: { fontSize: 11, fontWeight: 'bold', marginBottom: 5 } // Estilo da legenda
            }}
          > 

          {/*Componente do Footer*/}
            {/* Definição da primeira aba: Novo Relatório */}
            <Tab.Screen 
              name="NovoRelatorio" 
              component={HomeScreen} // Componente que será renderizado nesta tela
              options={{
                tabBarLabel: "Novo", // Texto que aparece abaixo do ícone
                tabBarIcon: ({ color }) => <Feather name="plus-circle" size={24} color={color} />
              }}
            />

            {/* Definição da segunda aba: Histórico */}
            <Tab.Screen 
              name="Historico" 
              component={HistoricoScreen} 
              options={{
                tabBarLabel: "Histórico",
                tabBarIcon: ({ color }) => <Feather name="file-text" size={24} color={color} />
              }}
            />

            {/* Definição da terceira aba: Configurações */}
            <Tab.Screen 
              name="Config" 
              component={SettingsScreen} 
              options={{
                tabBarLabel: "Config",
                tabBarIcon: ({ color }) => <SimpleLineIcons name="settings" size={24} color={color} />
              }}
            />
          </Tab.Navigator>

        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// --- OBJETO DE ESTILIZAÇÃO ---
const styles = StyleSheet.create({
  container: {
    flex: 1, // Faz com que a View ocupe 100% da tela disponível
    backgroundColor: "#F5F5F5", // Cor de fundo cinza clara (padrão do app)
  },

  header: {
    height: 100, // Altura fixa do cabeçalho
    backgroundColor: "#D08700", // Cor laranja característica
    flexDirection: "row", // Alinha ícone e texto lado a lado (horizontal)
    alignItems: "center", // Centraliza os itens verticalmente dentro do header
    paddingHorizontal: 20, // Espaçamento interno nas laterais
    paddingTop: 1, // Pequeno ajuste de respiro no topo
    elevation: 4, // Sombra para Android
  },

  iconBoxHeader: {
    width: 45, // Largura do quadrado do ícone
    height: 45, // Altura do quadrado do ícone
    backgroundColor: "#d59011", // Tom de laranja um pouco mais escuro
    borderRadius: 10, // Arredonda as bordas do quadrado
    alignItems: "center", // Centraliza o ícone horizontalmente dentro do quadrado
    justifyContent: "center", // Centraliza o ícone verticalmente dentro do quadrado
    borderWidth: 1, // Espessura da borda
    borderColor: 'rgba(255,255,255,0.3)' // Borda branca suave com transparência
  },

  textGroup: {
    marginLeft: 15, // Espaço entre o quadrado do ícone e os textos
  },

  headerTitle: {
    fontSize: 24, // Tamanho da fonte do título principal
    fontWeight: "900", // Deixa o texto em negrito
    color: "#3d2800", // Cor marrom escura para contraste
  },

  headerSubTitle: {
    fontSize: 14, // Tamanho da fonte do subtítulo
    color: "#343434", // Cor cinza escura
  },

  footer: {
    height: 70, // Altura da barra de abas inferior
    backgroundColor: "#FFF", // Fundo branco
    borderTopWidth: 2, // Linha no topo da barra
    borderTopColor: "#ffa600", // Cor da linha superior (laranja)
    paddingBottom: 10, // Espaço para não encostar na borda inferior do celular
    paddingTop: 10, // Centralização vertical dos ícones
  },
});