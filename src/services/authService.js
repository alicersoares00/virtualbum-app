import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "../../firebaseConfig";
import { createUserProfile, touchLastAccess } from "./firestoreService";

export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function loginWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await touchLastAccess(credential.user.uid);
  return credential;
}

export async function registerWithEmail({ name, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (name) {
    await updateProfile(credential.user, {
      displayName: name,
    });
  }

  await createUserProfile(credential.user.uid, {
    name: name || credential.user.displayName || "",
    email: credential.user.email || email,
  });

  return credential;
}

export async function logoutUser() {
  return signOut(auth);
}
