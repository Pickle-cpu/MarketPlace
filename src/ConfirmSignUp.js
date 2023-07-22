import React, { useState } from 'react';
import { API, Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
// import { addNewUser, stripeAddNewConnnectedUser } from "./graphql/mutations";
import { stripeAddNewConnnectedUser } from "./graphql/mutations";

function ConfirmSignUp() {
    const [username, setUsername] = useState("");
    const [authCode, setAuthCode] = useState("");
    const navigate = useNavigate();

    const confirmSignUp = async () => {
        try {
            await Auth.confirmSignUp(username, authCode);
            console.log('Code confirmed successfully');
            console.log(username);
            // create connected account

            const apiData = await API.graphql({
                query: stripeAddNewConnnectedUser,
                variables: {
                  pkid: username,
                  UserEmail: username,
                  UserSubscriptionStatus: "unsubscribe"
                },
            });
            console.log("hi "+apiData.data.stripeAddNewConnnectedUser.connectedid);
            console.log("hi "+apiData.data.stripeAddNewConnnectedUser.onboardinglink);
            window.location.href = apiData.data.stripeAddNewConnnectedUser.onboardinglink; // Redirect the user to the onboarding URL
            // add user infor to own db
            // await API.graphql({
            //     query: addNewUser,
            //     variables: {
            //       pkid: username,
            //       UserEmail: username,
            //       UserSubscriptionStatus: "unsubscribe"
            //     },
            // });
            // navigate('/SignIn'); // Navigate to Template page after successful confirmation
        } catch (error) {
            console.log('error confirming sign up', error);
        }
    }

    return (
        <div>
            <input placeholder="Username" onChange={event => setUsername(event.target.value)} />
            <input placeholder="Authentication Code" onChange={event => setAuthCode(event.target.value)} />
            <button onClick={confirmSignUp}>Confirm Sign Up</button>
        </div>
    );
}

export default ConfirmSignUp;
