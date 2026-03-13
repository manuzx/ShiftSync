import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  Keyboard, 
  TouchableWithoutFeedback 
} from 'react-native'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  
  const { themeColor } = useAuth();
  const isMorning = themeColor === '#D08700';
  const contrastColor = isMorning ? '#1F2937' : '#FFFFFF';

  const [currentDate, setCurrentDate] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('Operador');
  const [turnoAtual, setTurnoAtual] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  const [identificacaoMaq, setIdentificacaoMaq] = useState('');
  const [maquinas, setMaquinas] = useState('');
  const [materiais, setMateriais] = useState('');
  const [incidentes, setIncidentes] = useState('');
  const [notas, setNotas] = useState('');

  const calcularTurno = useCallback(() => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 13) return 'Manhã';
    if (hora >= 13 && hora < 19) return 'Tarde';
    return 'Noite';
  }, []);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => setKeyboardOffset(50));
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => setKeyboardOffset(0));

    const updateAppInfo = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('pt-BR'));
      setTurnoAtual(calcularTurno());
    };

    updateAppInfo();
    const timer = setInterval(updateAppInfo, 30000);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      clearInterval(timer);
    };
  }, [calcularTurno]);

  useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        const nomeSalvo = await AsyncStorage.getItem('@user_name');
        if (nomeSalvo) setNomeUsuario(nomeSalvo);
      };
      carregarDados();
      setTurnoAtual(calcularTurno());
    }, [calcularTurno])
  );

  const scrollToField = (y) => {
    scrollRef.current?.scrollTo({ y: y, animated: true });
  };

  const salvarRelatorio = async () => {
    if (!identificacaoMaq && !maquinas && !materiais && !incidentes) {
      Alert.alert("Aviso", "Preencha as informações antes de guardar.");
      return;
    }
    try {
      const novoRelatorio = {
        operador: nomeUsuario,
        data: currentDate + " às " + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        turno: turnoAtual,
        indMaq: identificacaoMaq || 'Não identificada',
        maquinas: maquinas || 'Nenhuma anomalia',
        materiais: materiais || 'Estoque normal',
        incidentes: incidentes || 'Sem incidentes',
        notas: notas || 'Sem observações',
      };

      const jsonValue = await AsyncStorage.getItem('@relatorios_turno');
      const historicoExistente = jsonValue ? JSON.parse(jsonValue) : [];
      await AsyncStorage.setItem('@relatorios_turno', JSON.stringify([novoRelatorio, ...historicoExistente]));
      
      setIdentificacaoMaq(''); setMaquinas(''); setMateriais(''); setIncidentes(''); setNotas('');
      
      Alert.alert("Sucesso", `Relatório da ${turnoAtual} guardado!`, [
        { text: "Ver Histórico", onPress: () => navigation.navigate('Historico') },
        { text: "Novo", style: "cancel" }
      ]);
    } catch (e) { 
      Alert.alert("Erro", "Falha ao guardar dados.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            ref={scrollRef} 
            contentContainerStyle={[styles.containerHomeScreen, { paddingBottom: keyboardOffset + 20 }]} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerHome}> 
              <Text style={styles.titleHome}>Olá, {nomeUsuario}</Text> 
              <Text style={styles.SubTitleHome}>Registe informações para a próxima equipe</Text> 
            </View>

            <View style={styles.divTurno}> 
              <Feather name="clock" size={20} color={themeColor} style={{ marginRight: 12, marginTop: 4 }} /> 
              <View style={styles.containerTextosTurno}> 
                <Text style={styles.TextDivTurno}>Turno Automático:</Text> 
                <Text style={styles.labelTurno}>{turnoAtual}</Text> 
                <View style={styles.containerData}> 
                  <Text style={[styles.bullet, { color: themeColor }]}>•</Text> 
                  <Text style={styles.dateText}>{currentDate}</Text> 
                </View>
              </View>
            </View>

            <View style={styles.containerIndMaq}>
              <Text style={styles.titleIndMaq}>Identificação da Máquina</Text>
              <TextInput 
                style={styles.inputIndMaq} 
                placeholder="Ex: Máquina 3"
                value={identificacaoMaq}
                onChangeText={setIdentificacaoMaq}
                onFocus={() => scrollToField(100)} 
              />
            </View>

            <View style={styles.containerEstadoMaquina}> 
              <Text style={styles.titleEstMaq}>Estado da máquina:</Text> 
              <TextInput
                style={styles.inputMultilinha}
                placeholder="Ex: apresenta ruído anormal no motor..."
                multiline={true}
                value={maquinas}
                onChangeText={setMaquinas}
                onFocus={() => scrollToField(280)}
              />
            </View>

            <View style={styles.containerEstadoMaterias}>
              <Text style={styles.titleEstMaq}>Estado dos materiais:</Text>
              <TextInput
                style={styles.inputMultilinha}
                placeholder="Ex: Parafusos M8 - stock baixo..."
                multiline={true}
                value={materiais}
                onChangeText={setMateriais}
                onFocus={() => scrollToField(450)}
              />
            </View>

            <View style={styles.containerIncidentesAnomalias}>
              <Text style={styles.titleEstMaq}>Incidentes e anomalias:</Text>
              <TextInput
                style={styles.inputMultilinha}
                placeholder="Ex: Paragem de 30min às 14h..."
                multiline={true}
                value={incidentes}
                onChangeText={setIncidentes}
                onFocus={() => scrollToField(620)}
              />
            </View>

            <View style={styles.containerNotasAdicionais}>
              <Text style={styles.titleEstMaq}>Notas adicionais:</Text>
              <TextInput
                style={styles.inputMultilinha}
                placeholder="Ex: Técnico de manutenção virá amanhã..."
                placeholderTextColor="#9CA3AF"
                multiline={true}
                value={notas}
                onChangeText={setNotas}
                onFocus={() => scrollToField(800)}
              />
            </View>

            <TouchableOpacity 
              style={[styles.btnGuardar, { backgroundColor: themeColor }]} 
              onPress={salvarRelatorio} 
              activeOpacity={0.7}
            >
              <Text style={[styles.btnTexto, { color: contrastColor }]}>Guardar Relatório</Text> 
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerHomeScreen: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  headerHome: {
    width: '100%',
    padding: 20,
  },
  titleHome: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
  },
  SubTitleHome: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
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
    elevation: 2,
  },
  containerIndMaq: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  containerTextosTurno: {
    flex: 1,
  },
  TextDivTurno: {
    fontSize: 14,
    color: '#6B7280',
  },
  labelTurno: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1F2937',
  },
  containerData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bullet: {
    fontSize: 18,
    marginRight: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  titleIndMaq: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  inputIndMaq: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
  },
  containerEstadoMaquina: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 18,
    marginTop: 20,
    elevation: 3,
  },
  containerEstadoMaterias: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 18,
    marginTop: 20,
    elevation: 3,
  },
  containerIncidentesAnomalias: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 18,
    marginTop: 20,
    elevation: 3,
  },
  titleEstMaq: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  inputMultilinha: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  containerNotasAdicionais: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 18,
    marginTop: 20,
    elevation: 3,
  },
  btnGuardar: {
    width: '90%',
    paddingVertical: 18,
    borderRadius: 15,
    marginTop: 40,
    marginBottom: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  btnTexto: {
    fontWeight: '900',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});