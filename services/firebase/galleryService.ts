import {
    addDoc,
    collection,
    doc,
    getDocs,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export interface Gallery {
  name: string;
  latitude: number;
  longitude: number;
  createdAt: any;
}

export interface Photo {
  uri: string;          // caminho local
  date: string;         // data da foto
  latitude: number;
  longitude: number;
}

export const createGallery = async (
  uid: string,
  galleryName: string,
  latitude: number,
  longitude: number,
  firstPhoto: Photo
) => {
  try {
    const galleryRef = doc(collection(db, `users/${uid}/galleries`));

    await setDoc(galleryRef, {
      name: galleryName,
      latitude,
      longitude,
      createdAt: serverTimestamp(),
    });

    if (!firstPhoto?.uri) throw new Error("URI da foto inválida");

    await addDoc(collection(galleryRef, "photos"), {
      ...firstPhoto,
      createdAt: serverTimestamp(),
    });

    return galleryRef.id;
  } catch (err) {
    console.error("Erro ao criar galeria:", err);
    throw err; // <- propaga para o frontend
  }
};

export const addPhotoToGallery = async (
  uid: string,
  galleryId: string,
  photo: Photo
) => {
  try {
    const photosRef = collection(db, `users/${uid}/galleries/${galleryId}/photos`);
    await addDoc(photosRef, {
      ...photo,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Erro ao adicionar foto:", err);
  }
};

export const listGalleries = async (uid: string) => {
  const galleriesRef = collection(db, `users/${uid}/galleries`);
  const snap = await getDocs(galleriesRef);

  const list: any[] = [];
  snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));

  return list;
};
