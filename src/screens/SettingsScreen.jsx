import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert 
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { logout, themeColor, atualizarTurnoGlobal } = useAuth(); 
  
  const [nome, setNome] = useState('');
  const [posicao, setPosicao] = useState('');
  const [selectedShift, setSelectedShift] = useState('Manhã');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const nomeSalvo = await AsyncStorage.getItem('@user_name'); 
        const posicaoSalva = await AsyncStorage.getItem('@user_position'); 
        const turnoSalvo = await AsyncStorage.getItem('@user_shift');

        if (nomeSalvo) setNome(nomeSalvo);
        if (posicaoSalva) setPosicao(posicaoSalva);
        if (turnoSalvo) setSelectedShift(turnoSalvo);
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    };
    
    carregarDados();
  }, []);

  const handleShiftChange = (shift) => {
    setSelectedShift(shift);
    atualizarTurnoGlobal(shift);
  };

  const salvarConfiguracoes = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome do operador não pode estar vazio.");
      return;
    }
    try {
      await AsyncStorage.setItem('@user_name', nome);
      await AsyncStorage.setItem('@user_position', posicao);
      await AsyncStorage.setItem('@user_shift', selectedShift);
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar configurações.");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Deseja realmente encerrar a sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível sair.");
            }
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.textAjuste}>Ajustes do Perfil</Text>
        <Text style={styles.title}>Configurações</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Nome do Operador</Text>
          <TextInput 
            style={styles.input} 
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Emmanuel Cordeiro"
            placeholderTextColor="#9CA3AF"
          />
          
          <Text style={styles.label}>Posição / Cargo</Text>
          <TextInput 
            style={styles.input} 
            value={posicao}
            onChangeText={setPosicao}
            placeholder="Ex: Técnico em ADS"
            placeholderTextColor="#9CA3AF"
          />
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: themeColor }]} 
            onPress={salvarConfiguracoes}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Guardar Alterações</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferência de Turno</Text>
          <Text style={styles.description}>Isso muda a cor de identidade do seu aplicativo.</Text>
          
          <View style={styles.shiftContainer}>
            {['Manhã', 'Tarde', 'Noite'].map((shift) => (
              <TouchableOpacity 
                key={shift}
                style={[
                    styles.shiftOption,
                    selectedShift === shift && { borderColor: themeColor, backgroundColor: themeColor + '10' }
                ]}
                onPress={() => handleShiftChange(shift)}
              >
                <Text style={[
                    styles.shiftText,
                    selectedShift === shift && { color: themeColor, fontWeight: 'bold' }
                ]}>
                  {shift}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.aboutCard, { backgroundColor: themeColor + '10', borderColor: themeColor + '30' }]}>
          <Text style={[styles.aboutTitle, { color: themeColor }]}>Sobre o ShiftSync</Text>
          <Text style={styles.aboutText}>
            O ShiftSync permite que operadores registem informações críticas sobre o estado das máquinas, 
            materiais e incidentes durante o seu turno.
          </Text>
          <Text style={styles.aboutText}>
            Todos os dados são guardados localmente no seu dispositivo, garantindo acesso rápido ao histórico de relatórios.
          </Text>
        </View>

        <TouchableOpacity style={styles.exitButton} onPress={handleLogout} activeOpacity={0.7}>
          <Feather name="log-out" size={20} color="#DC2626" />
          <Text style={styles.exitButtonText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
  },
  textAjuste: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 15,
  },
  shiftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shiftOption: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  shiftText: {
    fontWeight: '600',
    color: '#6B7280',
  },
  exitButton: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  exitButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },
  aboutCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 10,
  },
});