import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { PortfolioItem, InvestorProfile, WatchlistItem } from '../types';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  const dbId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

  db = dbId ? getFirestore(app, dbId) : getFirestore(app);
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

export { app, db, auth };

/* -------------------------------------------------------------------------- */
/* Authentication                                                              */
/*                                                                            */
/* All auth goes through Firebase Authentication. Firebase securely hashes    */
/* passwords server-side; we NEVER store or compare passwords ourselves.      */
/* -------------------------------------------------------------------------- */

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

// Map Firebase auth error codes to friendly messages.
function friendlyAuthError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in popup. Please allow popups and retry.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export async function signUpWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  if (!auth) return { success: false, error: 'Authentication is not available right now.' };
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (name.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
    }
    return { success: true, user: cred.user };
  } catch (err: any) {
    return { success: false, error: friendlyAuthError(err?.code || '') };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  if (!auth) return { success: false, error: 'Authentication is not available right now.' };
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { success: true, user: cred.user };
  } catch (err: any) {
    return { success: false, error: friendlyAuthError(err?.code || '') };
  }
}

export async function signInWithGoogle(): Promise<AuthResult> {
  if (!auth) return { success: false, error: 'Authentication is not available right now.' };
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    return { success: true, user: cred.user };
  } catch (err: any) {
    return { success: false, error: friendlyAuthError(err?.code || '') };
  }
}

export async function resetPassword(email: string): Promise<AuthResult> {
  if (!auth) return { success: false, error: 'Authentication is not available right now.' };
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (err: any) {
    return { success: false, error: friendlyAuthError(err?.code || '') };
  }
}

export async function signOutUser(): Promise<void> {
  if (!auth) return;
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Sign out notice:', err);
  }
}

export function subscribeToAuth(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/* -------------------------------------------------------------------------- */
/* Per-user cloud data (keyed by Firebase uid, protected by Firestore rules)   */
/* -------------------------------------------------------------------------- */

export async function savePortfolioToFirestore(uid: string, portfolio: PortfolioItem[]): Promise<boolean> {
  if (!db || !uid) return false;
  try {
    await setDoc(doc(db, 'users', uid), {
      portfolio,
      lastSyncedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving portfolio to Firestore:', error);
    return false;
  }
}

export async function loadPortfolioFromFirestore(uid: string): Promise<PortfolioItem[] | null> {
  if (!db || !uid) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.portfolio)) return data.portfolio as PortfolioItem[];
    }
    return null;
  } catch (error) {
    console.error('Error loading portfolio from Firestore:', error);
    return null;
  }
}

export async function saveProfileToFirestore(uid: string, profile: InvestorProfile): Promise<boolean> {
  if (!db || !uid) return false;
  try {
    await setDoc(doc(db, 'users', uid), {
      profile,
      lastSyncedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving profile to Firestore:', error);
    return false;
  }
}

export async function loadProfileFromFirestore(uid: string): Promise<InvestorProfile | null> {
  if (!db || !uid) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      if (data.profile) return data.profile as InvestorProfile;
    }
    return null;
  } catch (error) {
    console.error('Error loading profile from Firestore:', error);
    return null;
  }
}

export async function saveWatchlistToFirestore(uid: string, watchlist: WatchlistItem[]): Promise<boolean> {
  if (!db || !uid) return false;
  try {
    await setDoc(doc(db, 'users', uid), {
      watchlist,
      lastSyncedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving watchlist to Firestore:', error);
    return false;
  }
}

export async function loadWatchlistFromFirestore(uid: string): Promise<WatchlistItem[] | null> {
  if (!db || !uid) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.watchlist)) return data.watchlist as WatchlistItem[];
    }
    return null;
  } catch (error) {
    console.error('Error loading watchlist from Firestore:', error);
    return null;
  }
}
