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
import { getOrdersByBuyer, getOrdersBySeller } from './graphql/queries';


function OrderHistory() {

    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [sellernotes, setSellerNotes] = useState([]);
    const [buyernotes, setBuyerNotes] = useState([]);

    useEffect(() => {
        if(userEmail !== "") {
          fetchSellerNotes();
          fetchBuyerNotes();
        }
    }, [userEmail]);

    useEffect(() => {
        const fetchUser = async () => {
          try {
            const userInfo = await Auth.currentAuthenticatedUser();
            setUserEmail(userInfo.attributes.email);
          } catch (error) {
            console.error('error fetching user info:', error);
            // go back to main page
            navigate('/');
          }
        };
        fetchUser();
    }, []);

    async function fetchSellerNotes() {
        console.log(userEmail);
        const apiData = await API.graphql({
            query: getOrdersBySeller,
            variables: {
              sellerid: userEmail
            },
        });
        const notesFromAPI = apiData.data.getOrdersBySeller.orderList;
        await Promise.all(notesFromAPI.map(async (note) => note));
        setSellerNotes(notesFromAPI);
    }

    async function fetchBuyerNotes() {
        console.log(userEmail);
        const apiData = await API.graphql({
            query: getOrdersByBuyer,
            variables: {
              buyerid: userEmail
            },
        });
        const notesFromAPI = apiData.data.getOrdersByBuyer.orderList;
        await Promise.all(notesFromAPI.map(async (note) => note));
        setBuyerNotes(notesFromAPI);
    }

    async function browseOrder(pk,sk) {
        navigate(`/productdetail?pk=${pk}&sk=${sk}`);
    }

    return (
        <div>
            <div>
            <h2>Order History</h2>
            </div>
            <div>
            <h3>The Orders You Sold As Seller: </h3>
            </div>
            <View className="App">
                <View margin="3rem 0">
                    {sellernotes.map((note) => (
                        <Flex
                        key={note.SK}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        >
                        {/* <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderSellerid}</Text> */}
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderCreatedDate}</Text>
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderBuyerid.substring(2)}</Text>
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderOfList}</Text>
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderPrice}</Text>
                        <Button onClick={() => browseOrder(note.OrderSellerid.substring(2),note.OrderOfList.substring(2))}>Browse</Button><br />
                        </Flex>
                    ))}
                </View>
            </View>
            <div>
            <h3>The Orders You Bought As Buyer: </h3>
            </div>
            <View className="App">
                <View margin="3rem 0">
                    {buyernotes.map((note) => (
                        <Flex
                        key={note.SK}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        >
                        {/* <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderSellerid}</Text> */}
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderCreatedDate}</Text>
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderBuyerid.substring(2)}</Text>
                        {/* <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderOfList}</Text> */}
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderPrice}</Text>
                        <Button onClick={() => browseOrder(note.OrderSellerid.substring(2),note.OrderOfList.substring(2))}>Browse</Button><br />
                        </Flex>
                    ))}
                </View>
            </View>
            <br />
            <Link to="/">Back to main page</Link>
        </div>
    );
}

export default OrderHistory;
