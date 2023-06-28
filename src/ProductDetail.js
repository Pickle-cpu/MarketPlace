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
import { useLocation } from 'react-router-dom';
import { getUserCertainNote } from './graphql/queries';
import { Link } from "react-router-dom";

function ProductDetail() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pk = searchParams.get('pk');
    const sk = searchParams.get('sk');
    const username = pk.split("@")[0];

    const [note, setNote] = useState([]);
    useEffect(() => {
        fetchNotes();
    }, []);

    // function to fetch notes
    async function fetchNotes() {
        const apiData = await API.graphql({
        query: getUserCertainNote,
        variables: { 
            pkid: pk,
            skid: sk
        },
        });

        const notesFromAPI = apiData.data.getUserCertainNote;
        setNote(notesFromAPI);
    }

    const navigate = useNavigate();

    async function checkUserAuthentication() {
        try {
            await Auth.currentAuthenticatedUser();
            alert('You are logged in!');
        } catch (error) {
            alert('Please log in before you buy!');
            navigate('/signin');
        }
    }

    const handleBuy = async () => {

    }

    return (
    <div>
        <h2>{username}'s published to-do list!</h2>
        <View margin="3rem 0">
            <Flex
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.GSI1PK}</Text>
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.GSI1SK}</Text>
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListCreatedDate}</Text>
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListDescription}</Text>
                {note.ListImage && 
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListImage}</Text>
                }
                {/* <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListStatus}</Text> */}
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListTitle}</Text>
            </Flex>
        </View>
        <Button onClick={checkUserAuthentication}>Buy it</Button><br />
        <Link to="/">Back to main page</Link>
    </div>
    );
}

export default ProductDetail;
