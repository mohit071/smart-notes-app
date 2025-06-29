import "./App.css";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import { Box } from "@chakra-ui/react";
import Split from "react-split";
import { useCallback, useEffect, useState } from "react";
import {
  addNote,
  deleteNote,
  getAllNotes,
  softDeleteNote,
  updateNote,
  type Note,
} from "./db";
import {
  deleteNoteFromFirestore,
  fetchNotesFromFirestore,
  syncNoteToFirestore,
} from "./firebaseSync";

const App: React.FC = () => {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const fetchNotes = useCallback(async () => {
    let localNotes = await getAllNotes();

    if (localNotes.length === 0 && navigator.onLine) {
      try {
        const cloudNotes = await fetchNotesFromFirestore();
        for (const note of cloudNotes) {
          await addNote(note);
        }
        localNotes = cloudNotes;
      } catch (error) {
        console.error("Failed to fetch notes from Firestore:", error);
      }
    }
    setNotes(localNotes.filter((n) => n.pendingAction !== "delete"));
  }, []);

  const syncUnsyncedNotes = async () => {
    const localNotes = await getAllNotes();
    for (const note of localNotes) {
      try {
        if (note.pendingAction === "delete") {
          await deleteNoteFromFirestore(note.id!);
          await deleteNote(note.id!);
          continue;
        }

        await syncNoteToFirestore(note);
        await updateNote({ ...note, synced: true, pendingAction: undefined });
      } catch (error) {
        console.error("Sync failed for note:", note, error);
      }
    }

    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
    if (navigator.onLine) syncUnsyncedNotes();
    window.addEventListener("online", syncUnsyncedNotes);
    return () => window.removeEventListener("online", syncUnsyncedNotes);
  }, []);

  const handleEdit = (note: Note) => {
    setContent(note.content);
    setTags(note.tags?.join(", ") || "");
    setTitle(note.title);
    setEditingNoteId(note.id || null);
  };

  const handleDelete = async (id: number) => {
    if (navigator.onLine) {
      await deleteNote(id);
      await deleteNoteFromFirestore(id);
    } else {
      await softDeleteNote(id);
    }
    await fetchNotes();
  };

  const handleAddOrUpdateNote = async () => {
    if (!content.trim()) return;

    const timestamp = Date.now();
    const note: Note = {
      title,
      content,
      timestamp,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      attachments: undefined,
      synced: navigator.onLine,
      id: editingNoteId || undefined,
    };

    if (editingNoteId !== null) {
      if (!navigator.onLine) {
        await updateNote({ ...note, pendingAction: "update", synced: false });
      } else {
        await syncNoteToFirestore(note);
        await updateNote({ ...note, synced: true, pendingAction: undefined });
      }
    } else {
      const id = await addNote(note);
      if (navigator.onLine && id) {
        await syncNoteToFirestore({ ...note, id });
        await updateNote({ ...note, id, synced: true });
      }
    }

    setContent("");
    setTags("");
    setEditingNoteId(null);

    await fetchNotes();
  };

  return (
    <>
      <Split
        className="split"
        sizes={[25, 75]}
        minSize={350}
        maxSize={600}
        gutterSize={6}
        direction="horizontal"
      >
        <Sidebar
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          notes={notes}
        />

        <Content
          handleAddOrUpdateNote={handleAddOrUpdateNote}
          setContent={setContent}
          setTags={setTags}
          setTitle={setTitle}
          tags={tags}
          content={content}
          editingNoteId={editingNoteId}
          title={title}
        />
      </Split>
    </>
  );
};

export default App;
