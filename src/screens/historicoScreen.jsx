import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoricoScreen() {
  const [relatorios, setRelatorios] = useState([]); 
  const [busca, setBusca] = useState('');

  
  useEffect(() => {
    const carregarHistorico = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@relatorios_turno');
        if (jsonValue != null) {
          setRelatorios(JSON.parse(jsonValue));
        }
      } catch (e) {
        console.error("Erro ao carregar histórico", e);
      }
    };
    carregarHistorico();
  }, []);


  const relatoriosFiltrados = relatorios.filter(item => 
    item.operador?.toLowerCase().includes(busca.toLowerCase()) ||
    item.maquinas?.toLowerCase().includes(busca.toLowerCase())
  );


  const renderListaVazia = () => (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyText}>
        Ainda não existem relatórios registados. Crie o primeiro relatório!
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.badgeManha}>
          <Text style={styles.badgeText}>☀️ {item.turno || 'Manhã'}</Text>
        </View>
        <Text style={styles.dateText}>{item.data || '04 de março de 2026 às 11:27'}</Text>
        <View style={styles.actionIcons}>
          <TouchableOpacity><Feather name="check-circle" size={20} color="#28a745" /></TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 12 }}><Feather name="edit" size={20} color="#3B82F6" /></TouchableOpacity>
          <TouchableOpacity><Feather name="trash-2" size={20} color="#EF4444" /></TouchableOpacity>
        </View>
      </View>

      <Text style={styles.operatorName}>
        <Feather name="user" size={16} color="#374151" /> {item.operador || 'Matheus'} 
        <Text style={styles.subText}> • info~extra • info~extra</Text>
      </Text>

      <Text style={styles.label}>Estado das Máquinas</Text>
      <View style={[styles.infoBox, { backgroundColor: '#F8F9FA' }]}>
        <Text style={styles.contentText}>{item.maquinas || 'Nenhuma anomalia relatada'}</Text>
      </View>

      <Text style={styles.label}>Estado dos Materiais</Text>
      <View style={[styles.infoBox, { backgroundColor: '#F8F9FA' }]}>
        <Text style={styles.contentText}>{item.materiais || 'Estoque normal'}</Text>
      </View>

      <Text style={styles.label}>Incidentes e Anomalias</Text>
      <View style={[styles.infoBox, { backgroundColor: '#FFF5F5', borderColor: '#FEE2E2' }]}>
        <Text style={styles.contentText}>{item.incidentes || 'Sem incidentes'}</Text>
      </View>

      <Text style={styles.label}>Notas Adicionais</Text>
      <View style={[styles.infoBox, { backgroundColor: '#F0F7FF', borderColor: '#E0F2FE' }]}>
        <Text style={styles.contentText}>{item.notas || '...'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Histórico de Relatórios</Text>
        <Text style={styles.subtitle}>Consulte os relatórios anteriores de todos os turnos</Text>

        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Pesquisar por operador, data ou conteúdo..."
            style={styles.searchInput}
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        <FlatList
          data={relatoriosFiltrados}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          ListEmptyComponent={renderListaVazia}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDEB' }, 
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#001F3F' },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  emptyCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginTop: 10
  },
  emptyText: { color: '#9CA3AF', textAlign: 'center', fontSize: 14 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  badgeManha: { backgroundColor: '#FEF9C3', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#FDE68A' },
  badgeText: { color: '#854D0E', fontWeight: 'bold', fontSize: 12 },
  dateText: { flex: 1, fontSize: 12, color: '#6B7280', marginLeft: 12 },
  actionIcons: { flexDirection: 'row', alignItems: 'center' },
  operatorName: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginBottom: 15 },
  subText: { fontWeight: 'normal', color: '#9CA3AF', fontSize: 12 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#4B5563', marginBottom: 6 },
  infoBox: { padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#F1F3F5' },
  contentText: { color: '#374151', fontSize: 14 },
});