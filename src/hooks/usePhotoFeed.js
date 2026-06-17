import { useEffect, useState } from "react";

import { fetchPhotos } from "../services/apiService";

export default function usePhotoFeed() {
  const [photos, setPhotos] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPhotos() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchPhotos();
      setPhotos(data);
    } catch (loadError) {
      setError(loadError.message || "Não foi possível carregar a galeria.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  const filteredPhotos = (() => {
    if (!query.trim()) {
      return photos;
    }

    const normalizedQuery = query.trim().toLowerCase();

    return photos.filter((photo) =>
      photo.title.toLowerCase().includes(normalizedQuery)
    );
  })();

  return {
    photos,
    filteredPhotos,
    query,
    setQuery,
    loading,
    error,
    refetch: loadPhotos,
  };
}
