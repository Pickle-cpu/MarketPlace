// import React from 'react';
// import { Link } from "react-router-dom";
// import ProductPool from './ProductPool';

// function Home() {
//   return (
//     <div>
//       <h1>Welcome to the To-Do List</h1>
//       {/* <h2>Please select an option</h2> */}
//       <Link to="/signin">Sign In</Link>
//       <br/>
//       <Link to="/signup">Create Account</Link>
//       <ProductPool />
//     </div>
//   );
// }

// export default Home;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import ProductPool from './ProductPool';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  async function checkUserAuthentication() {
    try {
      await Auth.currentAuthenticatedUser();
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    }
  }

  // sign out function
  const signOut = () => {
    Auth.signOut()
      .catch((error) => console.log('error signing out:', error));
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>Welcome to the To-Do List</h1>
      {isLoggedIn ? (
        <div>
          <Link to="/Template">Go to your todo lists</Link><br /><br />
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <Link to="/signin">Sign In</Link>
          <br />
          <Link to="/signup">Create Account</Link>
        </div>
      )}
      <ProductPool />
    </div>
  );
}

export default Home;
