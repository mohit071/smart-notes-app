import { Box, Button, HStack, Text, VStack, Badge } from "@chakra-ui/react";
import { type Note } from "@/db";
import { CheckCircle, Pencil, Trash2, XCircle } from "lucide-react";

type SidebarProps = {
  handleDelete: (id: number) => void;
  handleEdit: (note: Note) => void;
  notes: Note[];
};

const Sidebar = ({ handleEdit, handleDelete, notes }: SidebarProps) => {
  return (
    <Box bg="gray.700" color="white" p={4} height="100vh" overflowY="auto">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Notes
      </Text>
      <VStack align="stretch" gap={4}>
        {notes.map((note) => (
          <Box
            key={note.id}
            p={4}
            borderRadius="md"
            bg="gray.600"
            _hover={{ bg: "gray.500" }}
            boxShadow="sm"
          >
            <Text mb={2}>{note.title}</Text>

            {note.tags && note.tags?.length > 0 && (
              <HStack wrap="wrap" gap={2} mb={2}>
                {note.tags.map((tag, i) => (
                  <Badge
                    key={i}
                    colorScheme="teal"
                    fontSize="0.7rem"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {tag}
                  </Badge>
                ))}
              </HStack>
            )}

            <Box borderBottom="1px solid" borderColor="gray.500" my={3} />

            <HStack justify="space-between" fontSize="sm">
              <Text>{new Date(note.timestamp).toLocaleString()}</Text>
              <Text color={note.synced ? "green.300" : "red.300"}>
                <HStack gap={1}>
                  {note.synced ? (
                    <>
                      <CheckCircle size={16} color="limegreen" />
                      <Text fontSize="sm" color="green.300">
                        Synced
                      </Text>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} color="orangered" />
                      <Text fontSize="sm" color="red.300">
                        Not Synced
                      </Text>
                    </>
                  )}
                </HStack>
              </Text>
            </HStack>

            <HStack mt={3} gap={3}>
              <Button
                size="sm"
                variant="outline"
                color="white"
                bg={"gray.800"}
                _hover={{ bg: "blue.600", color: "white" }}
                onClick={() => handleEdit(note)}
              >
                <HStack gap={1}>
                  <Pencil size={16} />
                  <Text>Edit</Text>
                </HStack>
              </Button>

              <Button
                size="sm"
                variant="outline"
                color="white"
                bg={"gray.800"}
                borderColor="red.300"
                _hover={{ bg: "red.500", color: "white" }}
                onClick={() => handleDelete(note.id!)}
              >
                <HStack gap={1}>
                  <Trash2 size={16} />
                  <Text>Delete</Text>
                </HStack>
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
