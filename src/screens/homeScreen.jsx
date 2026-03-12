import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('Operador'); 
  
  const [identificacaoMaq, setIdentificacaoMaq] = useState(''); // Estado único para ID
  const [maquinas, setMaquinas] = useState(''); // Relato de estado
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

  useFocusEffect(
    useCallback(() => {
      const carregarNome = async () => {
        const nomeSalvo = await AsyncStorage.getItem('@user_name');
        if (nomeSalvo) setNomeUsuario(nomeSalvo);
      };
      carregarNome();
    }, [])
  );

  const getTurno = () => {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 13) return 'Manhã';
    if (hora >= 13 && hora < 21) return 'Tarde';
    return 'Noite';
  };

  const salvarRelatorio = async () => {
    if (!identificacaoMaq && !maquinas && !materiais && !incidentes) {
      Alert.alert("Aviso", "Por favor, preencha as informações do turno antes de guardar.");
      return;
    }

    try {
      const novoRelatorio = {
        operador: nomeUsuario,
        data: currentDate + " às " + new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
        turno: getTurno(),
        indMaq: identificacaoMaq || 'Não identificada',
        maquinas: maquinas || 'Nenhuma anomalia relatada',
        materiais: materiais || 'Estoque normal',
        incidentes: incidentes || 'Sem incidentes',
        notas: notas || 'Sem observações adicionais',
      };

      const jsonValue = await AsyncStorage.getItem('@relatorios_turno');
      const historicoExistente = jsonValue ? JSON.parse(jsonValue) : [];
      
      const novoHistorico = [novoRelatorio, ...historicoExistente];
      await AsyncStorage.setItem('@relatorios_turno', JSON.stringify(novoHistorico));

      // Reset de todos os campos
      setIdentificacaoMaq(''); setMaquinas(''); setMateriais(''); setIncidentes(''); setNotas('');

      Alert.alert("Sucesso", "Relatório guardado!", [
        { text: "Ver Histórico", onPress: () => navigation.navigate('Historico') },
        { text: "Novo", style: "cancel" }
      ]);
    } catch (e) {
      Alert.alert("Erro", "Falha ao guardar os dados.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.containerHomeScreen} showsVerticalScrollIndicator={false}> 
        <View style={styles.headerHome}> 
          <Text style={styles.titleHome}>Olá, {nomeUsuario}</Text> 
          <Text style={styles.SubTitleHome}>Registe informações para a próxima equipa</Text> 
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

        <View style={styles.containerIndMaq}>
          <Text style={styles.titleIndMaq}>Identificação da Máquina</Text>
          <Text style={styles.subtitleIndMaq}>Qual equipamento você operou?</Text>
          <TextInput 
            style={styles.inputIndMaq} 
            placeholder="Ex: Máquina 3"
            placeholderTextColor="#9CA3AF"
            value={identificacaoMaq}
            onChangeText={setIdentificacaoMaq}
          />
        </View>

        <View style={styles.containerEstadoMaquina}> 
          <Text style={styles.titleEstMaq}>Estado da máquina:</Text> 
          <TextInput
            style={styles.inputMultilinha}
            placeholder="Ex: apresenta ruído anormal no motor requer calibração urgente
Todas as outras operacionais"
            placeholderTextColor="#9CA3AF"
            multiline={true}
            value={maquinas}
            onChangeText={setMaquinas}
          />
        </View>

        <View style={styles.containerEstadoMaterias}>
          <Text style={styles.titleEstMaq}>Estado dos materiais:</Text>
          <TextInput
            style={styles.inputMultilinha}
            placeholder="Ex: Parafusos M8 - stock baixo (20% restante)
Óleo lubrificante - reabastecer amanhã
Matéria-prima A em quantidade suficiente"
            placeholderTextColor="#9CA3AF"
            multiline={true}
            value={materiais}
            onChangeText={setMateriais}
          />
        </View>

        <View style={styles.containerIncidentesAnomalias}>
          <Text style={styles.titleEstMaq}>Incidentes e anomalias:</Text>
          <TextInput
            style={styles.inputMultilinha}
            placeholder="Ex: Paragem de 30min às 14h por falha elétrica
Produto rejeitado lote #1234
Sem incidentes a reportar"
            placeholderTextColor="#9CA3AF"
            multiline={true}
            value={incidentes}
            onChangeText={setIncidentes}
          />
        </View>

        <View style={styles.containerNotasAdicionais}>
          <Text style={styles.titleEstMaq}>Notas adicionais:</Text>
          <TextInput
            style={styles.inputMultilinha}
            placeholder="Ex: Técnico de manutenção virá amanhã às 10h
Pedido urgente #5678 deve ser priorizado
Limpar área de trabalho 2 antes de iniciar turno"
            placeholderTextColor="#9CA3AF"
            multiline={true}
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
  // Layout Principal
  containerHomeScreen: {
    paddingBottom: 60,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  headerHome: {
    width: '100%',
    padding: 20,
    marginTop: 10,
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

  // Cards de Informação (Turno e Identificação)
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
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  containerIndMaq: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
  },

  // Conteúdo Interno do Turno
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
    color: '#D08700',
    marginRight: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
  },

  // Textos de Identificação
  titleIndMaq: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitleIndMaq: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 10,
  },
  inputIndMaq: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Containers dos Formulários (Padronizados)
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
  containerNotasAdicionais: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 18,
    marginTop: 20,
    elevation: 3,
  },

  // Títulos e Inputs do Formulário
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
    height: 100, // Aumentei um pouco para facilitar a escrita
    textAlignVertical: 'top',
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  // Botão Salvar
  btnGuardar: {
    backgroundColor: '#D08700',
    width: '90%',
    padding: 18,
    borderRadius: 12,
    marginTop: 35,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#D08700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnTexto: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase', // Deixa o botão mais imponente
  },
});