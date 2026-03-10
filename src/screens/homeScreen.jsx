import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function HomeScreen() {
  // 1. Criamos um estado para guardar a string da data/hora
  const [currentDate, setCurrentDate] = useState('');

  // Estado para o texto da máquina
  const [maquinaInfo, setMaquinaInfo] = useState('');

  useEffect(() => {
    // 2. Função que pega o momento exato e formata para o padrão brasileiro
    const updateTime = () => {
      const now = new Date();
      
      // Formata a data (DD/MM/AAAA)
      const formattedDate = now.toLocaleDateString('pt-BR');
      
      setCurrentDate(`${formattedDate}`); // Você pode adicionar a hora aqui se quiser, usando now.toLocaleTimeString('pt-BR') ou similar
    };

    // 3. Chamamos uma vez assim que a tela abre
    updateTime();

    // 4. Criamos um intervalo para rodar a função a cada 1 segundo (1000ms)
    const timer = setInterval(updateTime, 1000);

    // 5. IMPORTANTE: Limpamos o intervalo quando saímos da tela para não gastar bateria à toa
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.containerHomeScreen}>
          {/* BLOCO CABEÇALHO */}
        <View style={styles.headerHome}>
          <Text style={styles.titleHome}>Novo Relatório de Turno</Text>
          <Text style={styles.SubTitleHome}>Registe informações importantes para a próxima equipa</Text>
        </View>

          <View style={styles.divTurno}> 
          {/* Ícone de informação à esquerda */}
          <Feather name="info" size={20} color="#6B7280" style={{ marginRight: 12, marginTop: 4 }} />
          
          <View style={styles.containerTextosTurno}>
            <Text style={styles.TextDivTurno}>Turno atual:</Text>
            
            <Text style={styles.labelTurno}>Manhã</Text>
            
            <View style={styles.containerData}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>
          </View>
        </View>


         {/* BLOCO ESTADO DA MÁQUINA */}
          <View style={styles.containerEstadoMaquina}>
        <Text style={styles.titleEstMaq}>Estado da máquina:</Text>
        <Text style={styles.SubTitleEstMaq}>
          Descreva máquinas com anomalias, manutenções pendentes ou observações
        </Text>

          {/* O CAMPO DE TEXTO DA IMAGEM */}
        <TextInput
          style={styles.inputMultilinha}
          placeholder="Ex: Máquina 3 apresenta ruído anormal no motor. Máquina 7 requer calibração urgente. Todas as outras operando dentro dos parâmetros normais."
          placeholderTextColor="#9CA3AF"
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top" // Faz o texto começar no topo (importante para Android)
          value={maquinaInfo}
          onChangeText={setMaquinaInfo}
        />
      </View>
  
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  // ESTILO DO HOME SCREEN

  containerHomeScreen: {
    paddingBottom: 40, // Espaço extra no final para o scroll
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },

  // ESTILO DO CABEÇALHO
  
  headerHome: {
    width: '100%',
    padding: 20,
    marginTop: 20,
  },
  titleHome: {
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'left', // Alinhado à esquerda conforme a imagem
    color: '#000000',
  },
  SubTitleHome: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },

  // ESTILO DO BLOCO DE TURNO

 divTurno: {
  width: '90%',
  backgroundColor: '#FFF',
  borderRadius: 12,
  padding: 16,
  flexDirection: 'row', // Coloca o ícone ao lado dos textos
  alignItems: 'flex-start', // Alinha o ícone no topo do texto
  marginTop: 20,
  elevation: 2,
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowRadius: 10,
  borderWidth: 1,
  borderColor: '#E5E7EB',
},

containerTextosTurno: {
  flex: 1, // Faz os textos ocuparem o resto do espaço
},

TextDivTurno: {
  fontSize: 14,
  color: '#6B7280', // Cor cinza do "Turno atual"
},

labelTurno: {
  fontSize: 18,
  fontWeight: '900',
  color: '#1F2937', // "Manhã" em negrito forte
  marginVertical: 2,
},

containerData: {
  flexDirection: 'row',
  alignItems: 'center',
},

bullet: {
  fontSize: 18,
  color: '#000000', // Cor azul do pontinho
  marginRight: 5,
},

dateText: {
  fontSize: 14,
  color: '#6B7280',
},

// ESTILO DO BLOCO DE ESTADO DA MÁQUINA

  containerEstadoMaquina: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleEstMaq: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 5,
  },
  SubTitleEstMaq: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 15,
  },
  inputMultilinha: {
    backgroundColor: '#F3F4F6', // Fundo cinza claro da imagem
    borderRadius: 8,
    padding: 12,
    height: 120, // Altura para o campo parecer um card
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});