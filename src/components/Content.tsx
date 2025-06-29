import {
  Box,
  Button,
  Heading,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import RichTextEditor from "./RichTextEditor";

type ContentProps = {
  handleAddOrUpdateNote: () => void;
  setContent: (val: string) => void;
  setTags: (val: string) => void;
  tags: string;
  editingNoteId: number | null;
  content: string;
  title: string;
  setTitle: (val: string) => void;
};

const Content = ({
  handleAddOrUpdateNote,
  setContent,
  setTags,
  tags,
  title,
  editingNoteId,
  content,
  setTitle,
}: ContentProps) => {
  return (
    <Box p={6} height="100vh" overflowY="auto" bg="gray.50">
      <VStack align="stretch" gap={4}>
        <Heading size="lg" color="gray.700">
          Smart Notes App
        </Heading>

        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          bg="white"
        />

        {/* <Tiptap /> */}

        <Textarea
          placeholder="Write your note here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          resize="vertical"
          bg="white"
        />
        {/* <RichTextEditor onChange={(val) => setContent(val)} /> */}

        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          bg="white"
        />

        <Button
          onClick={handleAddOrUpdateNote}
          alignSelf="flex-end"
          variant="solid"
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.600" }}
        >
          {editingNoteId !== null ? "Update Note" : "Save Note"}
        </Button>
      </VStack>
    </Box>
  );
};

export default Content;
