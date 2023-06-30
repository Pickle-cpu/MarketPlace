import { API, Auth, Storage } from 'aws-amplify';
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
    const [userEmail, setUserEmail] = useState("");

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
    
        if(notesFromAPI.ListImage) {
            const imageUrl = await Storage.get(notesFromAPI.ListImage);
            notesFromAPI.ListImage = imageUrl;
        }
        
        console.log(notesFromAPI);
        setNote(notesFromAPI);
    }

    const navigate = useNavigate();

    async function checkUserAuthentication() {
        try {
            const userInfo = await Auth.currentAuthenticatedUser();
            setUserEmail(userInfo.attributes.email);
            if(userInfo.attributes.email === pk){
                alert('You cannot buy your own todo list!');
                navigate('/');
            }
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
                {/* <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.GSI1PK}</Text>
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.GSI1SK}</Text> */}
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListCreatedDate}</Text>
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListTitle}</Text>
                <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListDescription}</Text>
                {note.ListImage && (
                    <Image
                    src={note.ListImage}
                    alt={`visual aid for ${note.ListImage}`}
                    style={{ width: 400 }}
                    />
                )}
                {note.ListPrice &&
                    <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListPrice}</Text>
                }
                {/* <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListStatus}</Text> */}
            </Flex>
        </View>
        <Button onClick={checkUserAuthentication}>Buy it</Button><br />
        <Link to="/">Back to main page</Link>
    </div>
    );
}

export default ProductDetail;
