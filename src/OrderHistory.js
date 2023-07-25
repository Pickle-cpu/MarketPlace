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
import { deleteOrder, stripePaymentRefund, updateOrder } from "./graphql/mutations";


function OrderHistory() {

    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState("");
    const [sellernotes, setSellerNotes] = useState([]);
    const [buyernotes, setBuyerNotes] = useState([]);
    const [confirmation, setConfirmation] = useState("");
    const [confirming, setConfirming] = useState(false);
    // const [shipstatus, setShipStatus] = useState(false);
    const stripe = require('stripe')('pk_test_51NCWiuA3JEG5mulpmDfvCJUil9T7U3W2wBFQ6IZuRBK5DoPBAgsiCMSZJpsF0oNmEzNrIHgLMnHF1QpD23Egx6u000Dw4NYNV5');


    // useEffect(() => {
    //     if(userEmail !== "") {
    //       fetchSellerNotes();
    //       fetchBuyerNotes();
    //     }
    // }, [shipstatus]);
    
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

    async function cancelOrder(sellerid, buyerid, OrderCreatedDate) {
        try {
            // Call your API method to cancel the order here
            // This would be a mutation in your GraphQL API
            // For example, using Amplify you might do something like this:
            await API.graphql({
                query: deleteOrder, // This is your GraphQL mutation
                variables: { sellerid: sellerid, buyerid: buyerid, createdDate: OrderCreatedDate}
            });
            // // Now, you should remove this order from your state so it's no longer displayed
            // setSellerNotes(sellernotes.filter(note => note.id !== orderId));
            // setBuyerNotes(buyernotes.filter(note => note.id !== orderId));
            
            // Fetch the updated list of notes for seller and buyer
            await fetchSellerNotes();
            await fetchBuyerNotes();
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    }

    async function initiateCancelOrder(note) {
        setConfirming(note);
    }

    // async function refundPayment(paymentIntentId, amount = null) {
    //     try {
    //       const refund = await stripe.refunds.create({
    //         payment_intent: paymentIntentId,
    //         // amount: amount,  // remove this line if you want to refund the whole amount
    //       });
    //       return refund;
    //     } catch (error) {
    //       console.error('Error refunding the payment:', error);
    //       throw error;
    //     }
    // }
    
    async function confirmCancelOrder() {
        if (confirmation.toLowerCase() === "confirm") {
            // Proceed with Stripe refund and order cancellation
            console.log(confirming.OrderCheckoutSessionPaymentIntent);
            console.log(typeof confirming.OrderCheckoutSessionPaymentIntent);
            try {
                const refundResult = await API.graphql({
                    query: stripePaymentRefund,
                    variables: {
                        paymentIntent : confirming.OrderCheckoutSessionPaymentIntent
                    },
                });
                if (refundResult) {
                    await cancelOrder(confirming.OrderSellerid.substring(2), confirming.OrderBuyerid.substring(2), confirming.OrderCreatedDate);
                } else {
                    console.error('Refund failed:', refundResult);
                }
            } catch (error) {
                console.error('Error cancelling order:', error);
            }
        } else {
            // Confirmation failed
            console.error('Confirmation failed. Please type "confirm" to cancel the order.');
        }
        // Reset confirmation process
        setConfirming(false);
        setConfirmation("");
    }
    

    async function browseOrder(pk,sk) {
        navigate(`/productdetail?pk=${pk}&sk=${sk}`);
    }

    async function shipOrder(sellerid,buyerid,createdDate) {
        await API.graphql({
            query: updateOrder,
            variables: {
              sellerid: sellerid,
              buyerid: buyerid,
              createdDate: createdDate,
              OrderStatus: "shipped"
            },
        });
        alert("Shipped!");
        navigate(`/orderhistory`);
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
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderQuantity}</Text>
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderStatus}</Text>
                        <Button onClick={() => browseOrder(note.OrderSellerid.substring(2),note.OrderOfList.substring(2))}>Browse</Button><br />
                        {note.OrderStatus === "paid" && (<Button onClick={() => shipOrder(note.OrderSellerid.substring(2),note.OrderBuyerid.substring(2),note.OrderCreatedDate)}>Ship</Button>)}
                        <br />
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
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderQuantity}</Text>
                        <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.OrderStatus}</Text>
                        <Button onClick={() => browseOrder(note.OrderSellerid.substring(2),note.OrderOfList.substring(2))}>Browse</Button><br />
                        <Button onClick={() => initiateCancelOrder(note)}>Cancel</Button>
                        {confirming === note && (
                            <>
                                <TextField
                                    value={confirmation}
                                    onChange={e => setConfirmation(e.target.value)}
                                    placeholder="Type 'confirm' to cancel"
                                />
                                <Button onClick={confirmCancelOrder}>Confirm Cancel</Button>
                            </>
                        )}
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