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

function Template() {
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

  // fetch notes when component mounts
  useEffect(() => {
    if(userEmail !== "") {
      fetchImageEnable();
      fetchNotes();
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
    console.log("hihere");
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
    const { ListDescription, ListImage, ListTitle } = formData;
    console.log(formData);
    console.log(ListDescription);
    console.log(ListImage);
    console.log(ListTitle);

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
    if(ListTitle){
      variables.ListTitle = ListTitle;
    }

    console.log(variables);

    // if (
    //   ListDescription === undefined &&
    //   ListImage === undefined &&
    //   ListTitle === undefined
    // ){
    //   alert("You update nothing!");
    // }else{
      // try{
      await API.graphql({
        query: updateTodo,
        variables: variables,
      });
    // }catch(error){
    //   console.log(error);
    // }

    // }

    // refresh notes after update
    fetchNotes();
    // hide form after submission
    setShowForm(false);
    setCurrentNoteSKId('');

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
      //   ListImage: ListImage,
      //   ListStatus: "open",
      //   ListTitle: ListTitle
      // },
    });
    // refresh notes after creation
    fetchNotes();
    // setnotes是异步的 不一定现在能看见
    // console.log(notes);
    // hide form after submission
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
    // 为什么是todoList而不是TodoList 因为是根据lambda的定义来的
    const notesFromAPI = apiData.data.getUserNotes.todoList;
    await Promise.all(notesFromAPI.map(async (note) => note));
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
    }

  }

  const handleDeleteConfirmation = (SK) => {
    setNoteToDelete(SK);
    setConfirmDelete(true);
  }

  const handlePublishConfirmation = () => {
    alert("Do you want to publish this todo list?");
  }

  const handleConfirmDeleteChange = (event) => {
    setDeleteConfirmText(event.target.value);
  }

  const confirmDeleteNote = () => {
    if (deleteConfirmText === "Delete") {
      deleteNote(noteToDelete);
      setConfirmDelete(false);
      setDeleteConfirmText("");
    } else {
      alert("Please enter 'Delete' to confirm deletion.");
    }
  }

  const cancelDeleteConfirmation = () => {
    setConfirmDelete(false);
    setDeleteConfirmText("");
    setNoteToDelete("");
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

  // extract username from email
  const username = userEmail.split("@")[0];

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

    }
  }

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
              {note.ListImage && 
              <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListImage}</Text>
              }
              <Text as="span" fontWeight={700} style={{color: 'skyblue'}}>{note.ListStatus}</Text>
              
              {/* 如果事件处理函数需要接收参数 则应使用匿名函数包裹
              以确保在事件发生时才调用函数并传递正确的参数
              如果事件处理函数不需要接收参数 则可以直接将函数引用传递给事件处理程序 无需使用匿名函数包裹
              当组件进行重新渲染时会检测到事件处理函数的变化
              如果你直接将函数调用放在onClick 属性中 每次组件重新渲染时都会执行该函数 从而导致无限循环的情况 */}
              {/* 当你需要将事件对象如event传递给事件处理函数时 你可以使用匿名函数并在参数位置接收事件对象
              这样做可以让你在事件处理函数中访问事件对象的属性和方法
              (event) => handleButtonClick(event, param) */}
              {/* 比如onCancel(param)实际上是将param传给了onCancel然后onCancel内部再对param进行使用 */}
              <Button onClick={() => handleButtonClick(note.SK)}>Update</Button>
              <Button onClick={() => handleDeleteConfirmation(note.SK)}>Delete</Button>
              <Button onClick={() => handlePublishConfirmation()}>Publish</Button>
            </Flex>
          ))}
          {/* 这里是对回调函数的使用
          回调函数意味着我们在template里面当前状态还不一定想要触发handleSubmitForm
          所以我们传递handleSubmitForm给它的下一任
          也就是noteform 由它决定是否要触发
          理解为 onsubmit是一个包括handleSubmitForm的匿名函数且被传到了noteform里
          使用匿名函数是我们不希望一进入noteform就触发handleSubmitForm
          而是希望等到需要触发的时候才触发
          匿名函数之所以能够阻止立即执行是因为将匿名函数作为回调函数传递给事件处理器时
          实际上只是将函数本身传递给了事件处理器
          而不是立即执行该函数
          如果直接放handleSubmitForm(formData)给onsubmit
          整个函数将在绑定的那一刻马上被执行
          匿名函数的第一个()里面放东西是表示这个匿名函数有一个参数 */}
          {/* 如果直接将handleSubmitForm(formData)作为回调函数传递给onSubmit
          那么在进入NoteForm组件时 会立即执行handleSubmitForm函数
          并尝试寻找当前的formData值
          这可能会导致意外的行为因为formData的值可能在这时还未定义或不正确 */}

          {/* onSubmit对应的匿名函数不会第一时间触发是因为他是被传递给了noteform但是还没有在noteform的某个地方被调用
          noteform页面的setFormData的匿名函数会马上调用是因为它就是在当前页面使用
          一个匿名函数如果在本页面使用就是直接起作用 但是如果发给了另外的页面 就要等那个页面在某个地方调用了这个函数才起作用 */}
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
      </View>
      <br />
      <br />
      <Heading level={2}>Wanna add images for your todo lists?</Heading>
      <Button onClick={handleSubsciption}>Subscribe now</Button>
      <br />
      <br />
      <Link to="/">Back to main page</Link>
    </div>
  );
}

export default Template;
