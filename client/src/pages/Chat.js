import React from 'react'
import { ChatEngine } from "react-chat-engine";
import LoginForm from  '../components/LoginForm'
import ChatFeed from  '../components/ChatFeed'
import  './chat.css';
const projectID="cc7b3719-baf5-4170-a0c1-ade3f1833304"
const Chat = () => {
    if (!localStorage.getItem('username')) return <LoginForm/>;
    return (
        <ChatEngine
          height="100vh"
          projectID={projectID}
          userName={localStorage.getItem('username')}
          userSecret={localStorage.getItem('password')}
          renderChatFeed={(chatAppProps) => <ChatFeed {...chatAppProps} />}
          onNewMessage={() => new Audio('https://chat-engine-assets.s3.amazonaws.com/click.mp3').play()}
        />
      );
    };


export default Chat
