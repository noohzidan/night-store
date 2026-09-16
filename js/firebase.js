// ---------------------------------------------------------------------------
// FIREBASE — this is what makes admin changes appear live for every visitor.
// Follow the "Firebase setup" section in README.md, then paste your project's
// config object below (Project settings -> General -> Your apps -> SDK setup).
// ---------------------------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { SEED_PRODUCTS } from "./seed-data.js";

// Note: product image uploads go through Cloudinary (see js/cloudinary.js),
// not Firebase Storage — Storage now requires a billing account (Blaze plan)
// even for free-tier usage, so Cloudinary's no-card free tier is used instead.

const firebaseConfig = {
  apiKey: "AIzaSyDpFzc07_H_3Qsmqz2PSnxb03AO_EB-6rU",
  authDomain: "night-f829f.firebaseapp.com",
  projectId: "night-f829f",
  storageBucket: "night-f829f.firebasestorage.app",
  messagingSenderId: "580773769479",
  appId: "1:580773769479:web:42002ba76d6fc5195ed5a2",
};

export const FIREBASE_NOT_CONFIGURED = firebaseConfig.apiKey === "YOUR_API_KEY";

let app, db, auth;
if (!FIREBASE_NOT_CONFIGURED) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

const PRODUCTS_COL = "products";

// Until a real Firebase project is connected, the storefront shows this
// static demo catalogue instead of an empty site. It's read-only (no
// Firestore behind it) — purely so the design/layout can be reviewed in a
// browser before setup. Swap in real data by following README.md step 2.
const DEMO_PRODUCTS = SEED_PRODUCTS.map((p, i) => ({ id: `demo-${i}`, ...p }));

/** Subscribe to the live product list. Calls cb(products) immediately and on every change. */
export function subscribeProducts(cb, onError) {
  if (FIREBASE_NOT_CONFIGURED) {
    cb(DEMO_PRODUCTS);
    return () => {};
  }
  const q = query(collection(db, PRODUCTS_COL), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("Firestore subscribe error:", err);
      if (onError) onError(err);
    }
  );
}

export async function createProduct(product) {
  return addDoc(collection(db, PRODUCTS_COL), {
    ...product,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, product) {
  return updateDoc(doc(db, PRODUCTS_COL, id), product);
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, PRODUCTS_COL, id));
}

// --- Admin auth -------------------------------------------------------------

export function subscribeAuth(cb) {
  if (FIREBASE_NOT_CONFIGURED) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

export async function adminLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function adminLogout() {
  return signOut(auth);
}
