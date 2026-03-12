import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [nome, setNome] = useState('');
  const [posicao, setPosicao] = useState('');
  const [selectedShift, setSelectedShift] = useState('Manhã');

  useEffect(() => {
    const carregarDados = async () => {
      const nomeSalvo = await AsyncStorage.getItem('@user_name');
      if (nomeSalvo) setNome(nomeSalvo);
    };
    carregarDados();
  }, []);

  const salvarConfiguracoes = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome do operador não pode estar vazio.");
      return;
    }

    try {
      await AsyncStorage.setItem('@user_name', nome);
      Alert.alert("Sucesso", "Configurações guardadas com sucesso!");
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar configurações.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerHome}>
        <Text style={styles.textHome}>Ajustes do Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Mantenha seus dados de turno atualizados</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nome do Operador</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Emmanuel Cordeiro" 
            placeholderTextColor="#9CA3AF"
            value={nome}
            onChangeText={setNome}
          />
          
          <Text style={styles.label}>Posição / Cargo</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Ex: Técnico de Sistemas" 
            placeholderTextColor="#9CA3AF"
            value={posicao}
            onChangeText={setPosicao}
          />
          
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={salvarConfiguracoes}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>Guardar Alterações</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Selecione seu Turno</Text>
          <View style={styles.shiftContainer}>
            {['Manhã', 'Tarde', 'Noite'].map((shift) => {
              const isSelected = selectedShift === shift;
              return (
                <TouchableOpacity 
                  key={shift}
                  style={[
                    styles.shiftOption, 
                    isSelected && styles.shiftSelected
                  ]}
                  onPress={() => setSelectedShift(shift)}
                >
                  <Text style={[
                    styles.shiftText, 
                    isSelected && styles.shiftTextSelected
                  ]}>
                    {shift}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerHome: {
    padding: 20,
    marginTop: 10,
  },
  textHome: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: 'bold',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    borderWidth: 1,
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#D08700',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
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
    marginBottom: 15,
  },
  shiftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shiftOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  shiftSelected: {
    borderColor: '#D08700',
    backgroundColor: '#FFFBEB',
  },
  shiftText: {
    fontWeight: '600',
    color: '#6B7280',
  },
  shiftTextSelected: {
    color: '#D08700',
  },
});