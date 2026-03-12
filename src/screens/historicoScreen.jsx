import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function HistoricoScreen() {
  const [relatorios, setRelatorios] = useState([]);
  const [busca, setBusca] = useState('');

  const carregarHistorico = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@relatorios_turno');
      if (jsonValue != null) setRelatorios(JSON.parse(jsonValue));
    } catch (e) { console.error(e); }
  };

  useFocusEffect(useCallback(() => { carregarHistorico(); }, []));

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

  const relatoriosFiltrados = relatorios.filter(item => {
    return (
      item.operador?.toLowerCase().includes(busca.toLowerCase()) ||
      item.maquinas?.toLowerCase().includes(busca.toLowerCase()) ||
      item.indMaq?.toLowerCase().includes(busca.toLowerCase())
    );
  });

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeTurno}>
          <Text style={styles.badgeText}>📅 {item.turno}</Text>
        </View>
        <Text style={styles.dateText}>{item.data}</Text>
        <TouchableOpacity onPress={() => excluirRelatorio(index)}>
          <Feather name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.operatorName}>
        <Feather name="user" size={16} /> {item.operador}
      </Text>

      <Text style={styles.label}>Identificação da Máquina:</Text>
      <Text style={styles.machineIdText}>{item.indMaq}</Text>
      
      <Text style={styles.label}>Relato Técnico:</Text>
      <Text style={styles.contentText}>{item.maquinas}</Text>
      
      <Text style={styles.label}>Materiais:</Text>
      <Text style={styles.contentText}>{item.materiais}</Text>

      <Text style={styles.label}>Incidentes:</Text>
      <Text style={styles.contentText}>{item.incidentes}</Text>

      <Text style={styles.label}>Notas:</Text>
      <Text style={styles.contentText}>{item.notas}</Text>
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
            ListEmptyComponent={<Text style={styles.emptyText}>Nenhum relatório encontrado.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Container Principal
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Cabeçalho e Busca
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    elevation: 2,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#374151',
  },

  // Estilização do Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#D08700',
    elevation: 3,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  // Badges e Informações de Topo
  badgeTurno: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D08700',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    marginLeft: 10,
  },
  operatorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    backgroundColor: '#F3F4F6',
    padding: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  // Textos e Labels do Relatório
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  machineIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D08700',
    marginBottom: 5,
  },
  contentText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 20,
  },

  // Estado Vazio
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#9CA3AF',
  },
});