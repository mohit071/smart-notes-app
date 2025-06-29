import { db } from "./firebase";
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import type { Note } from "./db";

const notesRef = collection(db, "notes");

export const syncNoteToFirestore = async (note: Note) => {
  if (note.id === undefined || note.id === null) return;

  const docRef = doc(notesRef, String(note.id));

  if (note.pendingAction === "delete") {
    await deleteDoc(docRef);
    return;
  }

  const { attachments, pendingAction, ...noteToSave } = note;
  await setDoc(docRef, noteToSave);
};

export const deleteNoteFromFirestore = async (id: number) => {
  const docRef = doc(notesRef, String(id));
  await deleteDoc(docRef);
};
// NEW: Fetch notes from Firestore
export const fetchNotesFromFirestore = async (): Promise<Note[]> => {
  const snapshot = await getDocs(notesRef);
  const notes: Note[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const id = parseInt(docSnap.id, 10);
    if (!isNaN(id)) {
      notes.push({
        ...data,
        id,
        synced: true,
      } as Note);
    }
  });

  return notes;
};