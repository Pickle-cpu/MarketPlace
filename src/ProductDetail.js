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
import { getUser, getUserCertainNote } from './graphql/queries';
import { addNewOrder, stripeBuyAndSplit } from "./graphql/mutations";
import { Link } from "react-router-dom";

function ProductDetail() {

    const navigate = useNavigate();

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const pk = searchParams.get('pk');
    const sk = searchParams.get('sk');
    const username = pk.split("@")[0];

    const [note, setNote] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [canbuy, setCanbuy] = useState(true);
    const [quantity, setQuantity] = useState(1);


    useEffect(() => {
        if(userEmail === pk){
            setCanbuy(false);
        }
    }, [userEmail]);

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const userInfo = await Auth.currentAuthenticatedUser();
            setUserEmail(userInfo.attributes.email);
          } catch (error) {
            console.error('error fetching user info:', error);
            // go back to main page
            // navigate('/');
          }
        };
        fetchUser();
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

    const handleAddNewOrder = async () => {
        if (isNaN(quantity) || quantity < 1) {
            alert('Please enter a valid quantity.');
            return;
        }

        const apiDataUser = await API.graphql({
            query: getUser,
            variables: { pkid: pk },
          });
        const notesFromAPIUser = apiDataUser.data.getUser;
        console.log(notesFromAPIUser);

        const apiDataOrder = await API.graphql({
          query: addNewOrder,
          variables: {
            sellerid: pk,
		    buyerid: userEmail,
		    listid: sk,
		    listprice: note.ListPrice,
            quantity : quantity,
            orderstatus : "created"
          },
        });
        const notesFromAPIOrder = apiDataOrder.data.addNewOrder;
        console.log(notesFromAPIOrder);
        console.log(userEmail);


        const apiDataBuyAndSplit = await API.graphql({
            query: stripeBuyAndSplit,
            variables: {
                connectedAccountID: notesFromAPIUser.UserConnectedAccountID,
                buyPrice: note.ListPrice,
                buyQuantity: quantity,
                buyProductName: note.ListTitle,
                sellerid: pk,
                buyerid: userEmail,
                createdDate: notesFromAPIOrder.OrderCreatedDate
            },
          });
        const notesFromAPIBuyAndSplit = apiDataBuyAndSplit.data.stripeBuyAndSplit;
        console.log(notesFromAPIBuyAndSplit);
        window.location.href = notesFromAPIBuyAndSplit.OrderCheckoutSessionURL; // Redirect the user to the payment URL

        // alert('You bought this todo list!');
        // navigate('/');

    };

    async function buyOrder() {
        try {

            if(userEmail === ""){
                alert("Please sign in to purchase the todo list!");
                navigate('/signin');
            }else{
                handleAddNewOrder();
            }
        } catch (error) {
            alert('Please log in before you buy!');
            navigate('/signin');
        }
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
                    <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>${note.ListPrice}</Text>
                }
                {/* <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListStatus}</Text> */}
            </Flex>
        </View>
        {canbuy && 
            <TextField
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="Enter quantity"
            />
        }
        {canbuy && <Button onClick={buyOrder}>Buy it</Button>}
        <br />
        <Link to="/">Back to main page</Link>
    </div>
    );
}

export default ProductDetail;