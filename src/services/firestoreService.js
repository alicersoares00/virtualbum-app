import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "../../firebaseConfig";

function userDocument(userId) {
  return doc(db, "users", userId);
}

export async function createUserProfile(userId, profile) {
  const now = new Date().toISOString();

  await setDoc(
    userDocument(userId),
    {
      name: profile.name || "",
      email: profile.email || "",
      createdAt: now,
      favoriteItems: [],
      lastAccess: now,
    },
    { merge: true }
  );
}

export async function getUserProfile(userId) {
  const snapshot = await getDoc(userDocument(userId));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data();
}

export async function updateUserProfile(userId, updates) {
  await setDoc(userDocument(userId), updates, { merge: true });
}

export async function touchLastAccess(userId) {
  await setDoc(
    userDocument(userId),
    {
      lastAccess: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function toggleFavoriteItem(userId, item) {
  const currentProfile = (await getUserProfile(userId)) || {
    favoriteItems: [],
  };

  const currentFavorites = Array.isArray(currentProfile.favoriteItems)
    ? currentProfile.favoriteItems
    : [];

  const exists = currentFavorites.some((favorite) => favorite.id === item.id);

  const nextFavorites = exists
    ? currentFavorites.filter((favorite) => favorite.id !== item.id)
    : [
        ...currentFavorites,
        {
          id: item.id,
          title: item.title,
          assetKey: item.assetKey || null,
          assetLabel: item.assetLabel || null,
          thumbnailUrl: item.thumbnailUrl,
          url: item.url,
          albumId: item.albumId,
        },
      ];

  await setDoc(
    userDocument(userId),
    {
      favoriteItems: nextFavorites,
      lastAccess: new Date().toISOString(),
    },
    { merge: true }
  );

  return nextFavorites;
}
