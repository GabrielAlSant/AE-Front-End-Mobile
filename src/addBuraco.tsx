import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

import { recuperarCodigo } from '../lib/TabRouter';
import CurrentLocationPage from '../components/CurrentLocationPage';
import SelectLocationPage from '../components/SelectLocationPage';


export default function ReportarProblema() {
  const [modalEstouNoLugarVisible, setModalEstouNoLugarVisible] = useState(false);
  const [modalSelecionarLugarVisible, setModalSelecionarLugarVisible] = useState(false);
  const [urgencia, setUrgencia] = useState(null);
  const [descricao, setDescricao] = useState('');
  const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [markers, setMarkers] = useState<
    {
      idDispositivo: string;
      latitude: number;
      longitude: number;
      criticidade: number;
      descricao: string;
    }[]
  >([]);

   const handleLocalizacaoLocal = (coords: { latitude: number; longitude: number }) => {
    setLocalizacaoSelecionada(coords);
    setModalEstouNoLugarVisible(false); 
  };

    const handleLocalizacaoSelecionada = (coords: { latitude: number; longitude: number }) => {
    setLocalizacaoSelecionada(coords);
    setModalSelecionarLugarVisible(false); 
  };

  async function adicionarBuraco(event: any) {
  const codigo = await recuperarCodigo();

  if (localizacaoSelecionada && descricao && urgencia) {
    const novoBuraco = {
      idDispositivo: codigo as string,
      latitude: localizacaoSelecionada.latitude,
      longitude: localizacaoSelecionada.longitude,
      criticidade: urgencia,
      descricao: descricao,
    };

    setMarkers([novoBuraco]);

    try {
      const resposta = await fetch('https://projeto-vias-sjrv.vercel.app/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoBuraco),
      });
 
      if(resposta.status == 208){
       Toast.show({
    type: 'info',
    text1: 'Buraco já identificado',
    text2: 'Seu reporte também é importante. Muito obrigado!',
    position: 'bottom',
    visibilityTime: 4000,
  });
      }

      if (!resposta.ok) throw new Error('Erro ao enviar buraco');

      if(resposta.ok) { 
    Toast.show({
    type: 'success',
    text1: 'Registramos seu reporte! Muito Obrigado!',
    position: 'bottom',
    visibilityTime: 4000,
  }); }
      const respostaJson = await resposta.json();
      setMarkers([]);
      setDescricao('');
      setUrgencia(null);
      setLocalizacaoSelecionada(null);
    } catch (error) {
      console.error('Erro ao enviar:', error);
    }
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reportar um buraco</Text>

      <View style={styles.card}>
        <Text style={styles.subTitle}>Localização</Text>

        <TouchableOpacity
          style={styles.buttonSelect}
          onPress={() => setModalEstouNoLugarVisible(true)}
        >
          <Text style={styles.buttonText}>Estou no lugar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSelect}
          onPress={() => setModalSelecionarLugarVisible(true)}
        >
          <Text style={styles.buttonText}>Quero selecionar o lugar</Text>
        </TouchableOpacity>
      </View>


      <Text style={styles.subTitle}>Adicionar descricacao (opcional)</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Ex: O buraco fica logo após uma curva..."
        multiline
        numberOfLines={4}
        value={descricao}
        onChangeText={setDescricao}
      />

      
      <Text style={styles.subTitle}>Qual a urgência?</Text>
      <Picker
        selectedValue={urgencia}
        onValueChange={(itemValue) => setUrgencia(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione..." value="" />
        <Picker.Item label="Baixa" value={1} />
        <Picker.Item label="Média" value={2} />
        <Picker.Item label="Alta" value={3} />
      </Picker>
      
      <Toast />

      <TouchableOpacity style={styles.submitButton} onPress={adicionarBuraco}>
        <Text style={styles.submitButtonText}>Enviar Reporte</Text>
      </TouchableOpacity>


      <Modal
        visible={modalEstouNoLugarVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalEstouNoLugarVisible(false)}
      >
      <CurrentLocationPage onSelecionarLocalizacao={handleLocalizacaoLocal} />
      </Modal>

      <Modal
        visible={modalSelecionarLugarVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalSelecionarLugarVisible(false)}
      >
        <SelectLocationPage onSelecionarLocalizacao={handleLocalizacaoSelecionada} />
      </Modal>
    </View>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f4f6',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
  },
  buttonSelect: {
    backgroundColor: '#e0e7ff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#1d4ed8',
    fontWeight: '600',
    textAlign: 'center',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
});
