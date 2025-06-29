// db.ts
import { openDB } from "idb";
import type { IDBPDatabase, DBSchema } from "idb";

export interface Note {
  id?: number;
  title: string;
  content: string;
  timestamp: number;
  tags?: string[];
  attachments?: { name: string; blob: Blob }[];
  synced: boolean;
  pendingAction?: "update" | "delete";
}

interface NotesDB extends DBSchema {
  notes: {
    key: number;
    value: Note;
  };
}

const DB_NAME = "notes-db";
const STORE_NAME = "notes";

let dbPromise: Promise<IDBPDatabase<NotesDB>>;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<NotesDB>(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });
  }
  return dbPromise;
};

export const addNote = async (note: Note): Promise<number> => {
  const db = await initDB();
  const { id, ...noteWithoutId } = note;
  return await db.add(STORE_NAME, noteWithoutId);
};

export const getAllNotes = async (): Promise<Note[]> => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};

export const deleteNote = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const updateNote = async (note: Note): Promise<void> => {
  if (!note.id) return;
  const db = await initDB();
  await db.put(STORE_NAME, note);
};

export const markNoteAsPending = async (
  id: number,
  action: "update" | "delete"
) => {
  const db = await initDB();
  const note = await db.get(STORE_NAME, id);
  if (!note) return;
  note.synced = false;
  note.pendingAction = action;
  await db.put(STORE_NAME, note);
};

export const softDeleteNote = async (id: number): Promise<void> => {
  const db = await initDB();
  const note = await db.get(STORE_NAME, id);
  if (note) {
    note.pendingAction = "delete";
    note.synced = false;
    await db.put(STORE_NAME, note);
  }
};
