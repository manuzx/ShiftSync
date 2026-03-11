import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';

export default function SettingsScreen() {
  const [selectedShift, setSelectedShift] = useState('Manhã');

  return (
    <SafeAreaView style={styles.container}>
      
      {}
      <View style={styles.headerHome}>
        <Text style={styles.textHome}>Tela Novo Configurações</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Configure o seu turno atual e informações pessoais</Text>

        {/* Card de Informações */}
        <View style={styles.card}>
          <Text style={styles.label}>Nome do Operador</Text>
          <TextInput style={styles.input} placeholder="Digite o seu nome" />
          
          <Text style={styles.label}>Posição do Operador</Text>
          <TextInput style={styles.input} placeholder="Digite a sua posição" />
          
          <Text style={styles.label}>Setor do Operador</Text>
          <TextInput style={styles.input} placeholder="Digite o seu setor" />
          
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Guardar Nome</Text>
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Turno Atual</Text>
          <Text style={styles.description}>Selecione o turno em que está a trabalhar atualmente</Text>
          
          <View style={styles.shiftContainer}>
            {['Manhã', 'Tarde', 'Noite'].map((shift) => (
              <TouchableOpacity 
                key={shift}
                style={[styles.shiftOption, selectedShift === shift && styles.shiftSelected]}
                onPress={() => setSelectedShift(shift)}
              >
                <Text style={styles.shiftText}>{shift}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFCE8' },
  
  
  headerHome: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFCE8', 
  },
  textHome: { fontSize: 18, color: '#333', fontWeight: 'bold' },

  
  scroll: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', padding: 12, borderRadius: 8, marginBottom: 15 },
  saveButton: { backgroundColor: '#000', padding: 15, borderRadius: 8, alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  description: { color: '#666', marginVertical: 10 },
  shiftContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  shiftOption: { flex: 1, padding: 15, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  shiftSelected: { borderColor: '#EAB308', backgroundColor: '#FFFBEB' },
  shiftText: { fontWeight: '600' }
});