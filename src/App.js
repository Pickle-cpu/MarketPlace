import React from 'react';
import './App.css';
import Home from './Home';
import SignUp from './SignUp'; 
import SignIn from './SignIn'; 
import Template from './Template'; 
import Todo from './Todo';
import NoteForm from './NoteForm';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ConfirmSignUp from './ConfirmSignUp';
import ProductDetail from './ProductDetail';
<<<<<<< HEAD
import Amplify from 'aws-amplify';
import { AmplifyS3Storage } from '@aws-amplify/storage';
import awsconfig from './aws-exports';
=======
import OrderHistory from './OrderHistory';
>>>>>>> 27efe824a89e6f4943dc0e6d599e2b6f0fb7a178

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/Template" element={<Template />} />
            <Route path="/confirmsignup" element={<ConfirmSignUp />} />
            <Route path="/Todo" element={<Todo />} />
            <Route path="/NoteForm" element={<NoteForm />} />
            <Route path="/productdetail" element={<ProductDetail />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
