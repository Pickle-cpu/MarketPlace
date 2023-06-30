import { API, Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserNotes, getUser } from './graphql/queries';
import { addNewTodo, updateTodo, deleteTodo, updateUser } from "./graphql/mutations";
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
import NoteForm from './NoteForm';
import { Link } from "react-router-dom";
import { Storage } from 'aws-amplify';
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from 'react-router-dom';
import OrderHistory from './OrderHistory';

function Template() {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const stripestatus = searchParams.get('stripestatus');
  // 如果 status 为 null 或 undefined，使用默认值
  const stripestatusValue = stripestatus || 'default';

  const [userEmail, setUserEmail] = useState("");
  const [userSubscriptionStatus,setUserSubscriptionStatus] = useState(false);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);

  const [showFormCreate, setShowFormCreate] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [currentNoteSKId, setCurrentNoteSKId] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [noteToDelete, setNoteToDelete] = useState("");

  const [confirmPublish, setConfirmPublish] = useState(false);
  const [publishConfirmText, setPublishConfirmText] = useState("");
  const [noteToPublish, setNoteToPublish] = useState("");

  // fetch notes when component mounts
  useEffect(() => {
    if(userEmail !== "") {
      fetchImageEnable();
      fetchNotes();
      if(stripestatusValue === 'success'){
        handleSubsciption();
      }
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

  // function to handle button click to update note
  const handleButtonClick = (noteSKId) => {
    const realnoteSKId = noteSKId.substring(2);
    setCurrentNoteSKId(realnoteSKId);

    if(userSubscriptionStatus){
      setShowImage(true);
      setShowForm(true);
    }else{
      setShowImage(false);
      setShowForm(true);
    }
  };

  // function to handle submission of update form
  const handleSubmitForm = async (formData) => {
    const { ListDescription, ListImage, ListStatus, ListTitle } = formData;
    console.log(formData);

    const variables = {
      pkid: userEmail,
      skid: currentNoteSKId
    };
    if(ListDescription){
      variables.ListDescription = ListDescription;
    }
    if(ListImage){
      variables.ListImage = ListImage;
    }
    if(ListStatus){
      variables.ListStatus = ListStatus;
    }
    if(ListTitle){
      variables.ListTitle = ListTitle;
    }

    console.log(variables);

    await API.graphql({
      query: updateTodo,
      variables: variables,
    });

    // refresh notes after update
    fetchNotes();
    // hide form after submission
    setShowForm(false);
    setCurrentNoteSKId('');

  };

  const handleSubmitFormForPublish = async (formData) => {
    const { noteToPublish, ListStatus, ListPrice } = formData;
    console.log(formData);
    
    const variables = {
      pkid: userEmail,
      skid: noteToPublish.substring(2),
      ListStatus: ListStatus,
      ListPrice: ListPrice
    };

    console.log(variables);

    await API.graphql({
      query: updateTodo,
      variables: variables,
    });

    // refresh notes after update
    fetchNotes();

  };

  // function to handle button click to create note
  const handleButtonClickCreate = () => {
    console.log(userSubscriptionStatus);
    if(userSubscriptionStatus){
      setShowImage(true);
      setShowFormCreate(true);
    }else{
      setShowImage(false);
      setShowFormCreate(true);
    }
  };

  // function to handle submission of create form
  const handleSubmitFormCreate = async (formData) => {
    const { ListDescription, ListImage, ListTitle } = formData;
    console.log(formData);
    console.log(ListDescription);
    console.log(ListImage);
    console.log(ListTitle);

    const variables = {
      id: userEmail,
      ListStatus: "open"
    };
    if(ListDescription){
      variables.ListDescription = ListDescription;
    }
    if(ListImage){
      variables.ListImage = ListImage;
    }
    if(ListTitle){
      variables.ListTitle = ListTitle;
    }

    console.log(variables);
    await API.graphql({
      query: addNewTodo,
      variables: variables,
      // variables: {
      //   id: userEmail,
      //   ListDescription: ListDescription,
      ListImage: formData.ListImage,
      //   ListStatus: "open",
      //   ListTitle: ListTitle
      // },
    });
    // refresh notes after creation
    fetchNotes();
    setShowFormCreate(false);
  };

  // function to handle form cancellation
  const handleCancelForm = () => {
    setShowForm(false);
    setShowFormCreate(false);
  };

  // function to fetch notes
  async function fetchNotes() {
    const apiData = await API.graphql({
      query: getUserNotes,
      variables: { id: userEmail },
    });
    console.log("API data: ", apiData);
    const notesFromAPI = apiData.data.getUserNotes.todoList;
    console.log(notesFromAPI);  
    await Promise.all(notesFromAPI.map(async (note) => {
      if (note.ListImage) {
        const url = await Storage.get(note.ListImage);
        note.ListImage = url;
      }
      return note;
    }));
    setNotes(notesFromAPI);
  }

  async function fetchImageEnable() {

    const apiData = await API.graphql({
      query: getUser,
      variables: { pkid: userEmail },
    });
    const notesFromAPI = apiData.data.getUser;
    if(notesFromAPI.UserSubscriptionStatus == "subscribed"){
      setUserSubscriptionStatus(true);
    }else{
      setUserSubscriptionStatus(false);
    }

  }

  const handleDeleteConfirmation = (SK) => {
    setNoteToDelete(SK);
    setConfirmDelete(true);
  }

  const handlePublishConfirmation = (SK) => {
    setNoteToPublish(SK);
    setConfirmPublish(true);
  }

  const handleConfirmDeleteChange = (event) => {
    setDeleteConfirmText(event.target.value);
  }

  const handleConfirmPublishChange = (event) => {
    setPublishConfirmText(event.target.value);
  }

  const confirmDeleteNote = () => {
    if (deleteConfirmText === "Delete") {
      deleteNote(noteToDelete);
      setConfirmDelete(false);
      setDeleteConfirmText("");
      setNoteToDelete("");
    } else {
      alert("Please enter 'Delete' to confirm deletion.");
    }
  }

  const confirmPublishNote = () => {
    if (publishConfirmText === "") {
      alert("Please enter a price.");
    } else {
      const formData = {
        noteToPublish: noteToPublish,
        ListStatus: "published",
        ListPrice: publishConfirmText
      }
      handleSubmitFormForPublish(formData);
      console.log(publishConfirmText);
      setConfirmPublish(false);
      setPublishConfirmText("");
      setNoteToPublish("");
    }
  }

  const cancelDeleteConfirmation = () => {
    setConfirmDelete(false);
    setDeleteConfirmText("");
    setNoteToDelete("");
  }

  const cancelPublishConfirmation = () => {
    setConfirmPublish(false);
    setPublishConfirmText("");
    setNoteToPublish("");
  }

  const deleteNote = async (SK) => {
    const realnoteSKId = SK.substring(2);
    const newNotes = notes.filter((note) => note.SK !== SK);
    setNotes(newNotes);
    await API.graphql({
      query: deleteTodo,
      variables: { 
        pkid: userEmail, 
        skid: realnoteSKId
      },
    });
  }

  async function handleStripe() {

    // API ID price_1NOTmcA3JEG5mulpQKawqf83
    // Publishable Key pk_test_51NCWiuA3JEG5mulpmDfvCJUil9T7U3W2wBFQ6IZuRBK5DoPBAgsiCMSZJpsF0oNmEzNrIHgLMnHF1QpD23Egx6u000Dw4NYNV5
    // Publishable Key是用于身份验证和与Stripe进行安全通信的公钥
    // 而Product的API ID 则是用于标识和操作具体产品的唯一标识符
    const stripe = await loadStripe(
      'pk_test_51NCWiuA3JEG5mulpmDfvCJUil9T7U3W2wBFQ6IZuRBK5DoPBAgsiCMSZJpsF0oNmEzNrIHgLMnHF1QpD23Egx6u000Dw4NYNV5'
    );
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: 'price_1NOTmcA3JEG5mulpQKawqf83', quantity: 1 }],
      mode: "subscription",
      // "http://localhost:3000/Template"
      successUrl: "/Template?stripestatus=success",
      cancelUrl: "/Template?stripestatus=cancel",
    });

    // if (error) {
    //   // Handle error
    //   alert("Subscription with Stripe failed!");
    //   console.log(error);
    // } else {
    //   // Handle success
    //   alert("Subscription with Stripe completed successfully!");
    // }
  }

  async function handleSubsciption () {

    if(userSubscriptionStatus){
      alert("Please do not repeat subscriptions!");
    }else{
      
      await API.graphql({
        query: updateUser,
        variables: {
          pkid: userEmail,
          UserSubscriptionStatus: "subscribed"
        },
      });
      fetchImageEnable();
      alert("Congrats! You are a premium user now!");
      navigate('/Template');
    }
  }

  async function handleCancelSubsciption () {

    if(userSubscriptionStatus){
      alert("Do you really want to cancel your subscription? You won't be able to change your uploaded images again.");
      await API.graphql({
        query: updateUser,
        variables: {
          pkid: userEmail,
          UserSubscriptionStatus: "unsubscribe"
        },
      });
      fetchImageEnable();
      alert("You have already canceled your premium user experience.");
      navigate('/Template');
    }else{
      alert("Please do not repeat cancellation!");
    }
    
  }

  // extract username from email
  const username = userEmail.split("@")[0];

  return (
    <div>
      <h1>Hello, {username}!</h1>
      <View className="App">
        <Heading level={2}>Your Todo List App</Heading>
        <Button onClick={handleButtonClickCreate}>Create</Button>
        {showFormCreate && (
          <NoteForm onSubmit={(formData) => handleSubmitFormCreate(formData)} onCancel={handleCancelForm} showImage = {showImage} />
        )}
        <Heading level={2}>Current Notes</Heading>
        <View margin="3rem 0">
          {notes.map((note) => (
            <Flex
              key={note.SK}
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              {/* <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.GSI1PK}</Text>
              <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.GSI1SK}</Text> */}

              <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListCreatedDate}</Text>
              <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListTitle}</Text>
              <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListDescription}</Text>
              {/* {console.log("hi"+note.ListImage)} */}
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
              <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListStatus}</Text>
              
              
              {!note.ListPrice && (<Button onClick={() => handleButtonClick(note.SK)}>Update</Button>)}
              <Button onClick={() => handleDeleteConfirmation(note.SK)}>Delete</Button>
              {userSubscriptionStatus && (!note.ListPrice) && (<Button onClick={() => handlePublishConfirmation(note.SK)}>Publish</Button>)}
            </Flex>
          ))}
         
          {showForm && (
            <NoteForm onSubmit={(formData) => handleSubmitForm(formData)} onCancel={handleCancelForm} showImage = {showImage} />
          )}
        </View>
        {confirmDelete && (
          <View>
            <Text style={{ color: 'white' }}>Are you sure that you want to delete this to-do list?</Text>
            <Text style={{ color: 'white' }}>If so, please type in "Delete" below.</Text>
            <TextField
              onChange={handleConfirmDeleteChange}
              value={deleteConfirmText}
              placeholder="Type 'Delete' here"
            />
            <Button onClick={confirmDeleteNote}>Confirm Delete</Button>
            <Button onClick={cancelDeleteConfirmation}>Cancel</Button>
          </View>
        )}
        {confirmPublish && (
          <View>
            <Text style={{ color: 'white' }}>Are you sure that you want to publish this to-do list?</Text>
            <Text style={{ color: 'white' }}>Once the list is published to the public product pool, you cannot update or publish it again.</Text>
            <Text style={{ color: 'white' }}>If so, please type in your desired price below.</Text>
            <TextField
              onChange={handleConfirmPublishChange}
              value={publishConfirmText}
              placeholder="Type your price here"
            />
            <Button onClick={confirmPublishNote}>Confirm Publish</Button>
            <Button onClick={cancelPublishConfirmation}>Cancel</Button>
          </View>
        )}
      </View>
      <br />
      {/* <br /> */}
      <div>
          <Heading level={2}>Wanna check your order history?</Heading>
          <Link to="/OrderHistory">Order History</Link>
      </div>
      {/* <br />
      <br /> */}
      {userSubscriptionStatus ? (
        <div>
          <Heading level={2}>Wanna cancel your subscription?</Heading>
          <Button onClick={handleCancelSubsciption}>Cancel</Button>
        </div>
      ) : (
        <div>
          <Heading level={2}>Wanna add images and publish your todo lists?</Heading>
          <Button onClick={handleStripe}>Subscribe now</Button>
        </div>
      )}
      <Link to="/">Back to main page</Link>
    </div>
  );
}

export default Template;
