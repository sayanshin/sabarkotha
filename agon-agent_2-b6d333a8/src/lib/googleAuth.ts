import { GoogleAuthProvider, signInWithPopup, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';

const isMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error('[google-auth] Firebase Google sign in failed:', error.message);
    return null;
  }
}

export async function handleGoogleRedirect() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('google_id_token');
  if (!token) return;
  
  window.history.replaceState({}, '', window.location.pathname);
  
  try {
    const credential = GoogleAuthProvider.credential(token);
    await signInWithCredential(auth, credential);
    try {
      window.close();
    } catch {
      /* noop */
    }
  } catch (error: any) {
    console.error('[google-auth] signInWithCredential failed:', error.message);
  }
}
