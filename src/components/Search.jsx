import React, { useContext, useState } from 'react';

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

import { db } from '../firebase';
import { AuthContext } from "../context/AuthContext";

const Search = () => {

  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {

    //  searching users by their display names in a Firestore database 
    const q = query(collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc contains all the documents that matches the username
        // and updating the user state with the retrieved data.
        setUser(doc.data());

      });
    }
    catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {

    // check if the group (chats in firestore) exists, if not create one
    const combinedId = currentUser.uid > user.uid
      ? currentUser.uid + user.uid
      : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      // if res doesn't exist means if there is not chats between user and currentUser inside chats collection, we will create new one

      if (!res.exists()) {        // firebase method

        // create chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // create user chats

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

      }
    }
    catch (err) { }

    // By calling these two state-setting functions, the component re-renders with the updated state, causing the UI to reflect the changes made in the handleSelect function.
    setUser(null);
    setUsername("")

  }

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={e => setUsername(e.target.value)}
          value={username}
        />
      </div>

      {err && <span>User not found!</span>}
      {/* if there is a user show me the div  */}
      {user && <div className="userChat" onClick={handleSelect} >
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}

    </div>
  )
}

export default Search

