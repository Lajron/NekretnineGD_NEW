// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, query, where, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
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
const auth = getAuth();
const provider = new GoogleAuthProvider();
import Nekretnina from "./js/nekretnina.js";

export const API = {
    init: () => {
        console.log("API initialized");
    },
    
    createNekretnina: async (data) => {
        try {
            const now = new Date();
            const customId = `${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
            const docRef = doc(db, "nekretnina", customId);
            await setDoc(docRef, {
                nekretnina: data.nekretnina,
                vlasnik: data.vlasnik,
                tagovi: data.tagovi,
                opis: data.opis,
                slike: data.slike,
                timestamp: now // Add timestamp
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    },
    readNekretnina: async (id) => {
        const docRef = doc(db, "nekretnina", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return new Nekretnina(data.nekretnina, data.vlasnik, data.tagovi, data.opis, data.slike, docSnap.id);
        } else {
            console.log("No such document!");
            return null;
        }
    },
    updateNekretnina: async (id, data) => {
        const docRef = doc(db, "nekretnina", id);
        try {
            await updateDoc(docRef, {
                nekretnina: data.nekretnina,
                vlasnik: data.vlasnik,
                tagovi: data.tagovi,
                opis: data.opis,
                slike: data.slike,
                timestamp: new Date() // Update timestamp
            });
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
        if (filters['nekretnina.id']) {
            const id = filters['nekretnina.id'].value;
            const nekretnina = await API.readNekretnina(id);
            return nekretnina ? [nekretnina] : [];
        }

        let q = collection(db, "nekretnina");
        for (const [field, filter] of Object.entries(filters)) {
            if (Array.isArray(filter)) {
                filter.forEach(({ operator, value }) => {
                    q = query(q, where(field, operator, value));
                });
            } else {
                const { operator, value } = filter;
                q = query(q, where(field, operator, value));
            }
        }
        const querySnapshot = await getDocs(q);
        let nekretnine = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const nekretnina = new Nekretnina(data.nekretnina, data.vlasnik, data.tagovi, data.opis, data.slike, doc.id);
            nekretnina.timestamp = data.timestamp; // Add timestamp manually
            nekretnine.push(nekretnina);
        });
        return nekretnine;
    },
    getAllNekretnina: async () => {
        const querySnapshot = await getDocs(collection(db, "nekretnina"));
        let nekretnine = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const nekretnina = new Nekretnina(data.nekretnina, data.vlasnik, data.tagovi, data.opis, data.slike, doc.id);
            nekretnina.timestamp = data.timestamp; // Add timestamp manually
            console.log("Nekretnina with timestamp:", nekretnina.timestamp); // Debugging statement
            nekretnine.push(nekretnina);
        });
        return nekretnine;
    },
    signIn: async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("User signed in: ", result.user);
        } catch (error) {
            console.error("Error signing in: ", error);
        }
    },
    signOut: async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    },
    onAuthStateChanged: (callback) => {
        onAuthStateChanged(auth, callback);
    }
};