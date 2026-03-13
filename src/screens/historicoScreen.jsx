import React, { useState, useCallback } from 'react'; 
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native'; 
import { Feather } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useFocusEffect } from '@react-navigation/native'; 
import { useAuth } from '../context/AuthContext'; 

export default function HistoricoScreen() {
  const [relatorios, setRelatorios] = useState([]); 
  const [busca, setBusca] = useState(''); 
  const { themeColor } = useAuth(); 

  const carregarHistorico = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@relatorios_turno');
      if (jsonValue != null) setRelatorios(JSON.parse(jsonValue));
    } catch (e) { 
      console.error("Erro ao carregar histórico:", e); 
    }
  };

  useFocusEffect(
    useCallback(() => { 
      carregarHistorico();
    }, [])
  );

  const getCorPorTurno = (turno) => {
    switch (turno) {
      case 'Manhã': return '#D08700';
      case 'Tarde': return '#0284C7';
      case 'Noite': return '#4F46E5';
      default: return '#D08700';
    }
  };

  const excluirRelatorio = async (index) => {
    Alert.alert("Excluir", "Deseja apagar este registro?", [
      { text: "Não" },
      { 
        text: "Sim", 
        onPress: async () => {
          const novaLista = [...relatorios];
          novaLista.splice(index, 1);
          setRelatorios(novaLista);
          await AsyncStorage.setItem('@relatorios_turno', JSON.stringify(novaLista));
        } 
      }
    ]);
  };

  const relatoriosFiltrados = relatorios.filter(item => {
    const termo = busca.toLowerCase();
    return (
      item.operador?.toLowerCase().includes(termo) ||
      item.maquinas?.toLowerCase().includes(termo) || 
      item.indMaq?.toLowerCase().includes(termo)   || 
      item.turno?.toLowerCase().includes(termo)
    );
  });

  const renderItem = ({ item, index }) => {
    const corCard = getCorPorTurno(item.turno);

    return (
      <View style={[styles.card, { borderLeftColor: corCard }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.badgeTurno, { backgroundColor: corCard + '25' }]}>
            <Text style={[styles.badgeText, { color: corCard }]}>📅 {item.turno}</Text>
          </View>
          <Text style={styles.dateText}>{item.data}</Text>
          <TouchableOpacity onPress={() => excluirRelatorio(index)}>
            <Feather name="trash-2" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>

        <View style={styles.operatorContainer}>
          <Feather name="user" size={14} color="#6B7280" />
          <Text style={styles.operatorName}>{item.operador}</Text>
        </View>

        {item.cargo && (

        <View style={[styles.operatorContainer, { backgroundColor: '#E0E7FF' }]}>
            <Feather name="briefcase" size={12} color="#4F46E5" />
            <Text style={[styles.cargoName, { color: '#4F46E5' }]}>{item.cargo}</Text>
        </View>
        )}
        </View>

        <Text style={styles.label}>Identificação da Máquina:</Text>
        <Text style={[styles.machineIdText, { color: corCard }]}>{item.indMaq}</Text>
        
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Histórico</Text>
        
        <View style={[styles.searchContainer, { borderColor: themeColor + '40' }]}>
          <Feather name="search" size={18} color={themeColor} />
          <TextInput 
            placeholder="Pesquisar por máquina ou operador..." 
            style={styles.searchInput} 
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <FlatList
          data={relatoriosFiltrados}
          renderItem={renderItem}
          keyExtractor={(_, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="file-text" size={50} color="#D1D5DB" />
              <Text style={styles.emptyText}>Nenhum relatório encontrado.</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20, 
    paddingTop: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1F2937', 
    marginBottom: 15 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 10, 
    fontSize: 16, 
    color: '#374151' 
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
    borderLeftWidth: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  badgeTurno: { 
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeText: { 
    fontSize: 12,
    fontWeight: 'bold'
  },
  dateText: { 
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    marginLeft: 10
  },
  operatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10, // Aumentei um pouco o preenchimento
    paddingVertical: 5,
    borderRadius: 8, // Bordas um pouco mais arredondadas
    alignSelf: 'flex-start',
  },
  operatorName: { 
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginLeft: 5
  },

  cargoName: {
    fontSize: 12, // Um pouco menor que o nome para dar hierarquia
    fontWeight: '700',
    marginLeft: 5,
    textTransform: 'uppercase', // Deixa o cargo em caixa alta para destacar
  },


  label: { 
    fontSize: 10,
    fontWeight: 'bold',
    color: '#9CA3AF',
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  machineIdText: { 
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5
  },
  contentText: { 
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
    lineHeight: 20
  },
  emptyContainer: { 
    alignItems: 'center',
    marginTop: 60
  },
  emptyText: { 
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#9CA3AF'
  },
});