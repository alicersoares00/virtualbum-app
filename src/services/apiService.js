import { pickPhotoAsset } from "../assets/photoCatalog";

const API_URL = "https://jsonplaceholder.typicode.com/photos?_limit=30";

export async function fetchPhotos() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Falha ao consultar a API publica.");
  }

  const photos = await response.json();

  return photos.map((photo, index) => {
    const asset = pickPhotoAsset(index);

    return {
      ...photo,
      assetKey: asset.key,
      assetLabel: asset.label,
    };
  });
}
