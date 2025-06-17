import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReportarProblema from './../src/addBuraco';
import VerBuracos from "../src/VerBuracos";



export function MyTabs() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator>
      <Tab.Screen name="Reportar um Buraco" component={ReportarProblema} />
      <Tab.Screen name="Meu mapa" component={VerBuracos} />
    </Tab.Navigator>
  );
}

export const gerarCodigo = () => {
  const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();
  return codigo;
};

export const salvarCodigo = async () => {
  try {
    const codigo = gerarCodigo();
    await AsyncStorage.setItem("idDispositivo", codigo);
    return codigo;
  } catch (error) {
    console.error("Erro ao salvar código:", error);
  }
};

export const recuperarCodigo = async () => {
  try {
    const codigo = await AsyncStorage.getItem("meu_codigo");
    if (codigo !== null) {
      return codigo;
    } else {
      return salvarCodigo();
    }
  } catch (error) {
    console.error("Erro ao recuperar código:", error);
  }
};
