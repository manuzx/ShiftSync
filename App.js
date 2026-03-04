import React from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER FIXO */}

      <View style={styles.header}>

        <View style={styles.iconBoxHeader}>
          <AntDesign style={styles.AntDesign} name="clock-circle" size={24} color="white"/>
        </View>


       

        {/* Container para empilhar os textos na direita do ícone */}
        <View style={styles.textGroup}>
          <Text style={styles.headerTitle}> ShiftSync </Text>
          <Text style={styles.headerSubTitle}> Diário de Troca de Turnos </Text>
        </View>
      </View>

      {/* CONTEÚDO QUE ROLA (MIOLO) */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
    
      </ScrollView>
  
      {/* FOOTER FIXO (NAVBAR) */}

      <View style={styles.footer}>
        
        {/* Botão Novo Relatório */}
        <View style={styles.footerItem}>
          <Feather name="file-text" size={24} color="#000000" />
          <Text style={styles.footerTitle}>Novo Relatório</Text>
        </View>

        {/* Botão Histórico */}
        <View style={styles.footerItem}>
          <Feather name="file-text" size={24} color="black" />
          <Text style={styles.footerTitle}>Histórico</Text>
        </View>

        {/* Botão Config */}
        <View style={styles.footerItem}>
          <SimpleLineIcons name="settings" size={24} color="#000000" />
          <Text style={styles.footerTitle}>Config</Text>
        </View>

      </View>
            

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa a tela inteira
    backgroundColor: "#F5F5F5",
  },

  //HEADER FIXO


  iconBoxHeader: {
    width: 45,                // Largura do quadrado
    height: 45,               // Altura do quadrado
    backgroundColor: "#d59011",  // Cor de fundo (ou use a da imagem se preferir)
    borderRadius: 10,         // Pontas arredondadas (quadrado suave)
    borderWidth: 1,           // Espessura da borda
    alignItems: "center",     // Centraliza o ícone horizontalmente
    justifyContent: "center",  // Centraliza o ícone verticalmente
  },

  header: {
    height: 90,
    backgroundColor: "#D08700",
    flexDirection: "row",    // Alinha Ícone e o Grupo de Texto lado a lado
    alignItems: "center",    // Centraliza verticalmente
    paddingHorizontal: 20,
    paddingTop: 30,          // Espaço para a barra de status do celular
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    elevation: 3,
  },
  textGroup: {
    marginLeft: 15,          // Empurra os textos para longe do relógio
    flexDirection: "column", // Garante que o título fique em cima do subtítulo
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3d2800",
  },
  headerSubTitle: {
    fontSize: 16,
    color: "#343434",
  },


  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Espaço extra para o footer não cobrir o final da lista
  },

  //FOOTER FIXO (NAVBAR)

  footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 90,
      backgroundColor: "#FFF",
      flexDirection: "row",          // Alinha os 3 blocos lado a lado
      justifyContent: "space-around", // Distribui o espaço entre eles
      alignItems: "center",
      borderTopWidth: 2,
      borderTopColor: "#ffa600",
      paddingBottom: 10,             // Ajuste para não ficar colado na borda de baixo
    },

    footerItem: {
      alignItems: "center",          // Centraliza o ícone e o texto um em cima do outro
      justifyContent: "center",
    },

    footerTitle: {
      fontSize: 12,                  // Diminuí um pouco para caber melhor
      color: "#000000",
      fontWeight: "bold",
      marginTop: 5,                  // Espaço entre o ícone e o texto
    },

});
