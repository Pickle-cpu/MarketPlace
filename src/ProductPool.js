import { API, Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotesByStatus } from './graphql/queries';
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { Link } from "react-router-dom";
import ProductDetail from './ProductDetail';

function ProductPool() {

  const [notes, setNotes] = useState([]);
  useEffect(() => {
    fetchNotes();
  }, []);

  // function to fetch notes
  async function fetchNotes() {
    const apiData = await API.graphql({
      query: getNotesByStatus,
      variables: { status: "published" },
    });
    const notesFromAPI = apiData.data.getNotesByStatus.todoList;
    await Promise.all(notesFromAPI.map(async (note) => note));
    console.log(notesFromAPI);
    setNotes(notesFromAPI);
    console.log(notes);
  }

  return (
    <div>
      <h2>Check Our Newest Product Pool...</h2>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.PK}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom="1rem"
          >
            <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.PK.substring(2)}</Text>
            <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListTitle}</Text>
            <Link to={`/productdetail?pk=${note.PK.substring(2)}&sk=${note.SK.substring(2)}`}>Browse</Link>
            {/* <ProductDetail PK={note.PK.substring(2)} SK={note.SK.substring(2)} /> */}
          </Flex>
        ))}
      </View>
    </div>
  );
}

export default ProductPool;
