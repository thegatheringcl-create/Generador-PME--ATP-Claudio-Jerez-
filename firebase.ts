import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error logging in with Google:", error);
    throw error;
  }
};

export const loginAnonymously = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/admin-restricted-operation') {
      console.error("ERROR DE CONFIGURACIÓN: El inicio de sesión anónimo está deshabilitado en la Consola de Firebase.");
      console.error("Por favor, ve a Authentication > Sign-in method y habilita 'Anonymous'.");
    } else {
      console.error("Error logging in anonymously:", error);
    }
    throw error;
  }
};

export const logout = () => signOut(auth);
