import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
  
  const [maquinas, setMaquinas] = useState('');
  const [materiais, setMateriais] = useState('');
  const [incidentes, setIncidentes] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('pt-BR'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const getTurno = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 13) return 'Manhã';
    if (hora >= 13 && hora < 21) return 'Tarde';
    return 'Noite';
  };

  const salvarRelatorio = async () => {
    if (!maquinas && !materiais && !incidentes) {
      Alert.alert("Aviso", "Por favor, preencha as informações do turno antes de guardar.");
      return;
    }

    try {
      const novoRelatorio = {
        operador: "Emmanuel Cordeiro",
        data: currentDate + " às " + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        turno: getTurno(),
        maquinas: maquinas || 'Nenhuma anomalia relatada',
        materiais: materiais || 'Estoque normal',
        incidentes: incidentes || 'Sem incidentes',
        notas: notas || 'Sem observações adicionais',
      };

      const jsonValue = await AsyncStorage.getItem('@relatorios_turno');
      const historicoExistente = jsonValue ? JSON.parse(jsonValue) : [];
      
      const novoHistorico = [novoRelatorio, ...historicoExistente];

      await AsyncStorage.setItem('@relatorios_turno', JSON.stringify(novoHistorico));

      setMaquinas(''); setMateriais(''); setIncidentes(''); setNotas('');

      Alert.alert("Sucesso", "Relatório guardado com sucesso!", [
        { text: "Ver Histórico", onPress: () => navigation.navigate('Historico') },
        { text: "Novo", style: "cancel" }
      ]);
    } catch (e) {
      Alert.alert("Erro", "Falha ao guardar os dados no dispositivo.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerHomeScreen} showsVerticalScrollIndicator={false}> 
        <View style={styles.headerHome}> 
          <Text style={styles.titleHome}>Novo Relatório de Turno</Text> 
          <Text style={styles.SubTitleHome}>Registe informações importantes para a próxima equipa</Text> 
        </View>

        <View style={styles.divTurno}> 
          <Feather name="info" size={20} color="#6B7280" style={{ marginRight: 12, marginTop: 4 }} /> 
          <View style={styles.containerTextosTurno}> 
            <Text style={styles.TextDivTurno}>Turno atual:</Text> 
            <Text style={styles.labelTurno}>{getTurno()}</Text> 
            <View style={styles.containerData}> 
              <Text style={styles.bullet}>•</Text> 
              <Text style={styles.dateText}>{currentDate}</Text> 
            </View>
          </View>
        </View>

        <View style={styles.containerEstadoMaquina}> 
          <Text style={styles.titleEstMaq}>Estado da máquina:</Text> 
          <TextInput
            style={styles.inputMultilinha}
            placeholder="Ex: Máquina 3 apresenta ruído..."
            placeholderTextColor="#9CA3AF"
            multiline={true}
            numberOfLines={4}
            value={maquinas}
            onChangeText={setMaquinas}
          />
        </View>

        <View style={styles.containerEstadoMaterias}>
          <Text style={styles.titleEstMaq}>Estado dos materiais:</Text>
          <TextInput
            style={styles.inputMultilinha}
            placeholder="Ex: Parafusos M8 - stock baixo..."
            placeholderTextColor="#9CA3AF"
            multiline={true}
            numberOfLines={4}
            value={materiais}
            onChangeText={setMateriais}
          />
        </View>

        <View style={styles.containerIncidentesAnomalias}>
          <Text style={styles.titleEstMaq}>Incidentes e anomalias:</Text>
          <TextInput
            style={styles.inputMultilinha}
            placeholder="Ex: Paragem de 30min às 14h..."
            placeholderTextColor="#9CA3AF"
            multiline={true}
            numberOfLines={4}
            value={incidentes}
            onChangeText={setIncidentes}
          />
        </View>

        <View style={styles.containerNotasAdicionais}>
          <Text style={styles.titleEstMaq}>Notas adicionais:</Text>
          <TextInput
            style={styles.inputMultilinha}
            placeholder="Ex: Técnico de manutenção virá amanhã..."
            placeholderTextColor="#9CA3AF"
            multiline={true}
            numberOfLines={4}
            value={notas}
            onChangeText={setNotas}
          />
        </View>

        <TouchableOpacity style={styles.btnGuardar} onPress={salvarRelatorio} activeOpacity={0.7}>
          <Text style={styles.btnTexto}>Guardar Relatório</Text> 
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerHomeScreen: {
    paddingBottom: 60,
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  headerHome: {
    width: '100%',
    padding: 20,
    marginTop: 10
  },
  titleHome: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000'
  },
  SubTitleHome: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4
  },
  divTurno: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2
  },
  containerTextosTurno: {
    flex: 1 
  },
  TextDivTurno: {
    fontSize: 14,
    color: '#6B7280' 
  },
  labelTurno: {
    fontSize: 18, 
    fontWeight: '900', 
    color: '#1F2937'
  },
  containerData: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  bullet: {
    fontSize: 18, 
    color: '#D08700',
    marginRight: 5
  },
  dateText: { 
    fontSize: 14,
    color: '#6B7280' 
  },

  containerEstadoMaquina: { 
     width: '90%',
     backgroundColor: '#FFF', 
     borderRadius: 10, 
     padding: 18, 
     marginTop: 20, 
     elevation: 3 
  },
  containerEstadoMaterias: { 
    width: '90%',
    backgroundColor: '#FFF', 
    borderRadius: 10, 
    padding: 18, 
    marginTop: 20, 
    elevation: 3 
  },
  containerIncidentesAnomalias: {
    width: '90%', 
    backgroundColor: '#FFF', 
    borderRadius: 10, 
    padding: 18, 
    marginTop: 20, 
    elevation: 3 
  },
  containerNotasAdicionais: { 
    width: '90%', 
    backgroundColor: '#FFF',
    borderRadius: 10, 
    padding: 18, 
    marginTop: 20, 
    elevation: 3 
  },

  titleEstMaq: {
    fontSize: 16, 
    fontWeight: '700',
    color: '#1F2937', 
    marginBottom: 12
  },
  inputMultilinha: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },

  btnGuardar: {
    backgroundColor: '#D08700',
    width: '90%',
    padding: 18,
    borderRadius: 12,
    marginTop: 35,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  btnTexto: {
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});