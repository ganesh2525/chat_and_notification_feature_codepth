import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  addDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import "../styles/Chat.css";

export const Chat = ({ group }) => {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");

  useEffect(() => {

    const queryMessages = query(
      messagesRef,
      where("group", "==", group),
      orderBy("time")
    );

    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      console.log(messages);
      setMessages(messages);
    });

    return () => unsuscribe();
  },[]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      time: serverTimestamp(),
      user: auth.currentUser.displayName,
      group
    });

    setNewMessage("");
  };

  return (
    <div className="chat-app">

      <div className="header">
        <h1>{group}</h1>
      </div>

      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className="content-container">
            <span className="user"> {message.user}: <span className="content">{message.text}</span></span> 
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="new-message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="new-message-input"
          placeholder="Type your message here..."
        />
        <button type="submit" className="send-button">
          &gt;
        </button>
      </form>
    </div>
  );
};
