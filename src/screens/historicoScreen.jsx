import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Importar isso

export default function HistoricoScreen() {
  const [relatorios, setRelatorios] = useState([]); 
  const [busca, setBusca] = useState('');

  const carregarHistorico = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@relatorios_turno');
      if (jsonValue != null) setRelatorios(JSON.parse(jsonValue));
    } catch (e) { console.error(e); }
  };

  useFocusEffect(
    useCallback(() => {
      carregarHistorico();
    }, [])
  );

  const excluirRelatorio = async (index) => {
    Alert.alert("Excluir", "Deseja apagar este registro?", [
      { text: "Não" },
      { text: "Sim", onPress: async () => {
          const novaLista = [...relatorios];
          novaLista.splice(index, 1);
          setRelatorios(novaLista);
          await AsyncStorage.setItem('@relatorios_turno', JSON.stringify(novaLista));
      }}
    ]);
  };

  const relatoriosFiltrados = relatorios.filter(item => 
    item.operador?.toLowerCase().includes(busca.toLowerCase()) ||
    item.maquinas?.toLowerCase().includes(busca.toLowerCase())
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeManha}>
          <Text style={styles.badgeText}>☀️ {item.turno}</Text>
        </View>
        <Text style={styles.dateText}>{item.data}</Text>
        <TouchableOpacity onPress={() => excluirRelatorio(index)}>
          <Feather name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.operatorName}><Feather name="user" size={16} /> {item.operador}</Text>
      <Text style={styles.label}>Máquinas:</Text>
      <Text style={styles.contentText}>{item.maquinas}</Text>
      <Text style={styles.label}>Materiais:</Text>
      <Text style={styles.contentText}>{item.materiais}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Histórico</Text>
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#9CA3AF" />
          <TextInput placeholder="Pesquisar..." style={styles.searchInput} value={busca} onChangeText={setBusca} />
        </View>
        <FlatList 
            data={relatoriosFiltrados} 
            renderItem={renderItem} 
            keyExtractor={(_, i) => i.toString()}
            ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>Nenhum relatório.</Text>}
        />
      </View>
    </View>
  );
}
// ... mantenha os estilos que você já tem