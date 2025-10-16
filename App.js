import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NotasApp() {
  const [nota, setNota] = useState("");
  const [notas, setNotas] = useState([]);

  // Carrega notas ao abrir o app
  useEffect(() => {
    carregarNotas();
  }, []);

  async function carregarNotas() {
    try {
      const dados = await AsyncStorage.getItem("@notas");
      if (dados !== null) {
        setNotas(JSON.parse(dados));
      }
    } catch (e) {
      console.error("Erro ao carregar notas:", e);
    }
  }

  async function salvarNotas(novasNotas) {
    try {
      await AsyncStorage.setItem("@notas", JSON.stringify(novasNotas));
    } catch (e) {
      console.error("Erro ao salvar notas:", e);
    }
  }

  function adicionarNota() {
    if (nota.trim() === "") return;

    const novaNota = {
      id: Date.now().toString(),
      texto: nota,
      data: new Date().toLocaleString("pt-BR"),
    };

    const novasNotas = [...notas, novaNota];
    setNotas(novasNotas);
    salvarNotas(novasNotas);
    setNota("");
  }

  function removerNota(id) {
    Alert.alert("Remover nota", "Deseja realmente excluir esta nota?", [
      { text: "Cancelar" },
      {
        text: "Remover",
        onPress: () => {
          const novasNotas = notas.filter((n) => n.id !== id);
          setNotas(novasNotas);
          salvarNotas(novasNotas);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🗒️ Minhas Notas</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua nota..."
        placeholderTextColor="#aaa"
        multiline
        numberOfLines={3}
        value={nota}
        onChangeText={setNota}
      />

      <TouchableOpacity style={styles.btnAdd} onPress={adicionarNota}>
        <Text style={styles.btnAddText}>Salvar</Text>
      </TouchableOpacity>

      <FlatList
        data={notas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTexto}>{item.texto}</Text>
              <Text style={styles.cardData}>{item.data}</Text>
            </View>
            <TouchableOpacity onPress={() => removerNota(item.id)}>
              <Text style={styles.btnRemover}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.listaVazia}>Nenhuma nota salva ainda</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  btnAdd: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  btnAddText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  cardTexto: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardData: {
    fontSize: 12,
    color: "#999",
  },
  btnRemover: {
    fontSize: 20,
    color: "red",
    marginLeft: 10,
  },
  listaVazia: {
    textAlign: "center",
    color: "#777",
    marginTop: 30,
  },
});
