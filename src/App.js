import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { API } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Image,
  Text,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import { getUserNotes } from "./graphql/queries";
import { updateTodo } from "./graphql/mutations";
import NoteForm from './NoteForm';

const App = ({}) => {
  const [notes, setNotes] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [currentNoteSKId, setCurrentNoteSKId] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []); 

  const handleButtonClick = (noteSKId) => {
    const realnoteSKId = noteSKId.substring(2);
    setShowForm(true);
    setCurrentNoteSKId(realnoteSKId);
  };

  const handleSubmitForm = (formData) => {

    console.log(formData);
    console.log(currentNoteSKId);

    // 根据表单数据和当前笔记的 ID 执行更新数据库的操作
    updateNotes(formData);

    // 更新完成后，重置表单状态
    setShowForm(false);
    setCurrentNoteSKId('');
  };

  // // promise.all 等待所有的异步处理完
  // // 一般情况使用map足够 这里使用promiseall是因为
  // // 需要等待所有异步处理完才能继续后面的操作
  async function fetchNotes() {

    const apiData = await API.graphql({
      query: getUserNotes,
      variables: { id: "dd67@rice.edu" },
    });
    const notesFromAPI = apiData.data.getUserNotes.todoList;
    console.log(apiData.data.getUserNotes.todoList);
    await Promise.all(
      notesFromAPI.map(async (note) => {
        // 确保map()方法返回一个经过修改的笔记项对象
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function updateNotes(formData) {

    const { ListDescription, 
    ListImage, 
    ListStatus, 
    ListTitle, 
    } = formData;

    const apiData = await API.graphql({
      query: updateTodo,
      variables: { 
        pkid: "dd67@rice.edu", 
        skid: currentNoteSKId,
        ListDescription: ListDescription, 
        ListImage: ListImage, 
        ListStatus: ListStatus, 
        ListTitle: ListTitle
      },
    });
    const notesFromAPI = apiData.data.updateTodo;
    console.log(notesFromAPI);
    fetchNotes();
  }

  return (
    <View className="App">
      <Heading level={1}>My Notes App</Heading>
      <Heading level={2}>Current Notes</Heading>
      <View margin="3rem 0">
        {notes.map((note) => (
          <Flex
            key={note.SK}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Text as="span" fontWeight={700}>
              {note.GSI1PK}
            </Text>
            <Text as="span" fontWeight={700}>
              {note.GSI1SK}
            </Text>
            <Text as="span" fontWeight={700}>
              {note.ListCreatedDate}
            </Text>
            <Text as="span" fontWeight={700}>
              {note.ListDescription}
            </Text>
            <Text as="span" fontWeight={700}>
              {note.ListImage}
            </Text>
            <Text as="span" fontWeight={700}>
              {note.ListStatus}
            </Text>
            <Text as="span" fontWeight={700}>
              {note.ListTitle}
            </Text>
            <Button onClick={() => handleButtonClick(note.SK)}>Submit</Button>
          </Flex>
        ))}

        {showForm && (
        <NoteForm onSubmit={(formData) => handleSubmitForm(formData)} />
        )}
      </View>
    </View>
  );
};

// export default withAuthenticator(App);
export default App;