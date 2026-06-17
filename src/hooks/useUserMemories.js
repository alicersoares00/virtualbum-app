import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { uploadImage } from "../services/imageService";
import {
  createMemory,
  getUserMemories,
  savePanelSettings,
} from "../services/firestoreService";

export default function useUserMemories(userId) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function loadMemories() {
    if (!userId) return;

    setLoading(true);
    try {
      const userMemories = await getUserMemories(userId);
      setMemories(userMemories);
    } catch (error) {
      console.warn("Erro ao carregar memórias:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMemories();
  }, [userId]);

  async function pickAndUploadImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];
      if (!asset || !asset.uri) {
        throw new Error("Imagem inválida");
      }

      console.log("Imagem selecionada:", asset.uri);
      if (asset.base64) {
        return `data:image/jpeg;base64,${asset.base64}`;
      }

      return asset.uri;
    } catch (error) {
      console.warn("Erro ao selecionar imagem:", error);
      throw error;
    }
  }

  async function addMemory(title, description, imageUri) {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    if (!title.trim()) {
      throw new Error("Título é obrigatório");
    }

    setUploading(true);
    try {
      let imageUrl = null;

      if (imageUri) {
        console.log("Iniciando upload de imagem:", imageUri);
        const fileName = `${Date.now()}.jpg`;
        imageUrl = await uploadImage(userId, imageUri, fileName);
        console.log("Imagem enviada com sucesso:", imageUrl);
      }

      console.log("Criando memória no Firestore...");
      const newMemory = await createMemory(userId, {
        title: title.trim(),
        description: description.trim(),
        imageUrl,
      });
      console.log("Memória criada com sucesso:", newMemory);

      setMemories((prev) => [newMemory, ...prev]);
      return newMemory;
    } catch (error) {
      console.error("Erro ao criar memória:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  }

  async function savePanelConfig(settings) {
    if (!userId) return;

    try {
      await savePanelSettings(userId, settings);
    } catch (error) {
      console.warn("Erro ao salvar configurações:", error);
      throw error;
    }
  }

  return {
    memories,
    loading,
    uploading,
    loadMemories,
    addMemory,
    pickAndUploadImage,
    savePanelConfig,
  };
}
