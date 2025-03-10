// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeK109fFhCBMc9NQLWP-P0KKRd8lUM0AU",
  authDomain: "nekretninegd.firebaseapp.com",
  projectId: "nekretninegd",
  storageBucket: "nekretninegd.firebasestorage.app",
  messagingSenderId: "1012233968906",
  appId: "1:1012233968906:web:a337ee4a7bbe9a07056ef3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const API = {
    init: () => {
        console.log("API initialized");
    },
    
    createNekretnina: async (data) => {
        try {
            const docRef = await addDoc(collection(db, "nekretnina"), data);
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    },
    readNekretnina: async (id) => {
        const docRef = doc(db, "nekretnina", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No such document!");
            return null;
        }
    },
    updateNekretnina: async (id, data) => {
        const docRef = doc(db, "nekretnina", id);
        try {
            await updateDoc(docRef, data);
            console.log("Document updated with ID: ", id);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    },
    deleteNekretnina: async (id) => {
        const docRef = doc(db, "nekretnina", id);
        try {
            await deleteDoc(docRef);
            console.log("Document deleted with ID: ", id);
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    },
    filterNekretnina: async (filters) => {
        let q = collection(db, "nekretnina");
        for (const [field, { operator, value }] of Object.entries(filters)) {
            q = query(q, where(field, operator, value));
        }
        const querySnapshot = await getDocs(q);
        let nekretnine = [];
        querySnapshot.forEach((doc) => {
            nekretnine.push({ id: doc.id, ...doc.data() });
        });
        return nekretnine;
    }
}