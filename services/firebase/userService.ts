// services/firebase/userService.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// =====================
// Registro de usuário
// =====================
export async function registerUser(name: string, email: string, password: string): Promise<UserProfile> {
  // 1️⃣ Criar usuário no Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // 2️⃣ Criar documento do perfil no Firestore
  const profileRef = doc(db, "users", uid);
  await setDoc(profileRef, {
    name,
    email,
    role: "user",
    createdAt: new Date().toISOString(),
  });

  return { id: uid, name, email, role: "user" };
}

// =====================
// Login de usuário
// =====================
export async function loginUser(email: string, password: string): Promise<UserProfile | null> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  const profileSnap = await getDoc(doc(db, "users", uid));
  if (!profileSnap.exists()) return null;

  const data = profileSnap.data();
  return {
    id: uid,
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: data.avatar,
  };
}

// =====================
// Logout
// =====================
export async function logoutUser() {
  await signOut(auth);
}

// =====================
// Pegar perfil do usuário
// =====================
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: uid,
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: data.avatar,
  };
}
