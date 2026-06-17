import { getStorage, ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";
import app from "../../firebaseConfig";

const storage = getStorage(app);

async function uriToBlob(uri) {
  if (!uri) {
    throw new Error("URI da imagem não fornecida");
  }

  if (uri.startsWith("data:")) {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Falha ao converter data URI: ${response.status}`);
    }
    return await response.blob();
  }

  if (uri.startsWith("file://") || uri.startsWith("content://")) {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const response = await fetch(`data:image/jpeg;base64,${base64}`);
    return await response.blob();
  }

  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error(`Falha ao buscar imagem: ${response.status}`);
  }

  return await response.blob();
}

function isDataUri(uri) {
  return typeof uri === "string" && uri.startsWith("data:");
}

export async function uploadImage(userId, imageUri, fileName) {
  try {
    console.log("uploadImage iniciado - userId:", userId, "fileName:", fileName);

    const storagePath = `users/${userId}/memories/${fileName}`;
    const storageRef = ref(storage, storagePath);

    if (isDataUri(imageUri)) {
      console.log("Usando uploadString para data URI");
      await uploadString(storageRef, imageUri, "data_url");
    } else {
      const blob = await uriToBlob(imageUri);
      console.log("Blob criado, tamanho:", blob.size);
      await uploadBytes(storageRef, blob);
    }

    console.log("Upload concluído para:", storagePath);
    const downloadUrl = await getDownloadURL(storageRef);
    console.log("URL de download obtida:", downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.error("Erro em uploadImage:", error);
    throw error;
  }
}
