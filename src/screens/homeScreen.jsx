import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  // 1. Criamos um estado para guardar a string da data/hora
  const [currentDate, setCurrentDate] = useState('');

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
    <View style={styles.container}>

      <View style={styles.headerHome}>
        <Text style={styles.titleHome}>Novo Relatório de Turno</Text>
        <Text style={styles.SubTitleHome}>Registe informações importantes para a próxima equipa</Text>
      </View>

      <View style={styles.divTurno}> 
        <Text style={styles.TextDivTurno}>Turno atual:</Text>
        <Text style={styles.dateText}>{currentDate}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  headerHome: {
    width: '100%',
    padding: 20,
    alignItems: 'right',
    marginBottom: 1,
  },
  titleHome: {
    fontSize: 24,
    fontWeight:'900',
    textAlign: 'right',
    color: '#000000',
    marginBottom: 5,
    paddingHorizontal: 50,
  },

  SubTitleHome: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 10,
  },

  text: {
    fontSize: 18,
    color: '#333'
  },

  TextDivTurno: {
    fontSize: 18,
    color: '#333',
  },



  divTurno: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 25,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'right',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

});