import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  Firestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PortfolioItem, InvestorProfile, WatchlistItem, RegisteredAccount } from '../types';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

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
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

export { app, db };

// Helper to normalize email for Firestore document IDs
export const normalizeEmailDocId = (email: string): string => {
  return email.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
};

/**
 * Save user portfolio to Firestore Cloud Database
 */
export async function savePortfolioToFirestore(email: string, portfolio: PortfolioItem[]): Promise<boolean> {
  if (!db || !email) return false;
  try {
    const docId = normalizeEmailDocId(email);
    const userRef = doc(db, 'users', docId);
    await setDoc(userRef, {
      email: email.trim().toLowerCase(),
      portfolio,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving portfolio to Firestore:', error);
    return false;
  }
}

/**
 * Load user portfolio from Firestore Cloud Database
 */
export async function loadPortfolioFromFirestore(email: string): Promise<PortfolioItem[] | null> {
  if (!db || !email) return null;
  try {
    const docId = normalizeEmailDocId(email);
    const userRef = doc(db, 'users', docId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.portfolio)) {
        return data.portfolio as PortfolioItem[];
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading portfolio from Firestore:', error);
    return null;
  }
}

/**
 * Save user investor profile to Firestore Cloud Database
 */
export async function saveProfileToFirestore(email: string, profile: InvestorProfile): Promise<boolean> {
  if (!db || !email) return false;
  try {
    const docId = normalizeEmailDocId(email);
    const userRef = doc(db, 'users', docId);
    await setDoc(userRef, {
      profile,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving profile to Firestore:', error);
    return false;
  }
}

/**
 * Load user investor profile from Firestore Cloud Database
 */
export async function loadProfileFromFirestore(email: string): Promise<InvestorProfile | null> {
  if (!db || !email) return null;
  try {
    const docId = normalizeEmailDocId(email);
    const userRef = doc(db, 'users', docId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.profile) {
        return data.profile as InvestorProfile;
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading profile from Firestore:', error);
    return null;
  }
}

/**
 * Save user watchlist to Firestore Cloud Database
 */
export async function saveWatchlistToFirestore(email: string, watchlist: WatchlistItem[]): Promise<boolean> {
  if (!db || !email) return false;
  try {
    const docId = normalizeEmailDocId(email);
    const userRef = doc(db, 'users', docId);
    await setDoc(userRef, {
      watchlist,
      lastSyncedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving watchlist to Firestore:', error);
    return false;
  }
}

/**
 * Load user watchlist from Firestore Cloud Database
 */
export async function loadWatchlistFromFirestore(email: string): Promise<WatchlistItem[] | null> {
  if (!db || !email) return null;
  try {
    const docId = normalizeEmailDocId(email);
    const userRef = doc(db, 'users', docId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.watchlist)) {
        return data.watchlist as WatchlistItem[];
      }
    }
    return null;
  } catch (error) {
    console.error('Error loading watchlist from Firestore:', error);
    return null;
  }
}

/**
 * Save registered account to Firestore
 */
export async function saveAccountToFirestore(account: RegisteredAccount): Promise<boolean> {
  if (!db) return false;
  try {
    const docId = normalizeEmailDocId(account.email);
    const accountRef = doc(db, 'accounts', docId);
    await setDoc(accountRef, {
      ...account,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving account to Firestore:', error);
    return false;
  }
}

/**
 * Load all registered accounts from Firestore
 */
export async function loadAccountsFromFirestore(): Promise<RegisteredAccount[] | null> {
  if (!db) return null;
  try {
    const colRef = collection(db, 'accounts');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: RegisteredAccount[] = [];
      snap.forEach((d) => {
        list.push(d.data() as RegisteredAccount);
      });
      return list;
    }
    return null;
  } catch (error) {
    console.error('Error loading accounts from Firestore:', error);
    return null;
  }
}
