import { useState , useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useToast
} from "@chakra-ui/react";

import api from "../services/api";

import Header from "../components/Header"

export default function Home( ) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setID] = useState(null);
  const [clients, setClients] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast(); 

  const isValidFormData = () => {
    if(!name) {
      return toast({
        title: "Fill in the name field",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if(!email) {
      return toast({
        title: "Fill in the e-mail field",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if(clients.some((client) => client.email === email && client.id !== id)) {
      return toast({
        title: "E-mail already registered",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleSubmitCreateClient = async (e) => {
    e.preventDefault();

    if(isValidFormData()) return;

    try {
      setIsLoading(true);
      const {data} = await api.post("/clients", { name, email });
      setClients(clientes.concat(data.data));
      setName("");
      setEmail("");
      toast({
        title: "Registered successfully!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(()=> {
    api.get("/clients").then(({ data }) => {
      setClients(data.data);
    });
  },[clients]);

  return (
    <Box>
     <Header/>
     <Flex align="center" justifyContent="center">
      <Box
        width={800}
        border={1}
        borderRadius={8}
        boxShadow="lg"
        p={20}
        mt="25"
      >
        <Flex justifyContent="flex-end">
          <Button colorScheme="green">+</Button>
        </Flex>

        <VStack as="form" onSubmit={handleSubmitCreateClient}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input type= "text" placeholder="Enter the name"
            value={name}
            onChange={(e)=> setName(e.target.value)}
            /> 
          </FormControl>

          <FormControl>
            <FormLabel>E-mail</FormLabel>
            <Input type= "text" placeholder="Enter the e-mail"
             value={email}
             onChange={(e)=> setEmail(e.target.value)}
             /> 
          </FormControl>

          <Button
            colorScheme="green"
            type="submit"
            mt={6}
            isLoading={isLoading}
          >
               Register
         </Button>
       </VStack>

       <Table variant="simple" mt={6}>
         <Thead bg="teal.500">
           <Tr>
             <Th textColor="white">Name</Th>
             <Th textColor="white">E-mail</Th>
             <Th textColor="white">Actions</Th>
           </Tr>
          </Thead>
          <Tbody>
            {
              clients.map((client,index)=>(
                <Tr key={index}>
                <Td>{client.name}</Td>
                <Td>{client.email}</Td>
                <Td justifyContent="space-between">
                  <Flex>
                    <Button 
                    size="sm"
                    fontSize="small"
                    colorScheme="yellow"
                    mr="2"
                    >
                      Edit
                    </Button>
                    <Button
                    size="sm"
                    fontSize="small"
                    colorScheme="red"
                    mr="2"
                    >
                      Remove
                      </Button>
                  </Flex>
              </Td>
            </Tr> 
              ))
            }
        </Tbody>
      </Table>
      </Box>
    </Flex>
  </Box>
 );
}