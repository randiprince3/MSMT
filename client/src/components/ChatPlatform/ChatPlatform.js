import React from "react";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
// import axios from "axios";

const user = localStorage.getItem("username");
console.log("user", user);

class ChatPlatform extends React.Component {
  state = {
    isConnected: false,
    messages: [],
    connection: null
  };

  addUser() {
    let name = localStorage.getItem("username");
    console.log(name);
  }

  componentWillMount() {
    window.removeEventListener("beforeunload", this.onUnload);
  }

  componentDidMount() {
    // toggleWidget();

    let port;
    if (window["location"]["port"] === "") {
      port = ":" + window["location"]["port"];
    } else {
      port = ":3000";
    }
    let wsProtocol = "ws://";
    if (window.location.protocol.substr(0, 5) === "https") {
      wsProtocol = "wss://";
    }
    let webSocketString =
      wsProtocol + window["location"]["hostname"].toString() + port + "/chat";
    console.log(webSocketString);

    let connection = new WebSocket(webSocketString);
    connection.onopen = this.onOpen;
    connection.onerror = this.onError;
    connection.onmessage = this.onMessage;

    this.setState({
      connection: connection
    });

    window.addEventListener("beforeunload", this.onUnload);
  }

  onOpen = () => {
    // connection is opened and ready to use
    console.log("connection.onopen happening");
    this.setState({
      isConnected: true
    });
  };

  onError = error => {
    // an error occurred when sending/receiving data
    console.log("connection.onerror: " + error);
  };

  onMessage = message => {
    addResponseMessage(message.data);
    console.log(`New message incoming! ${message.data}`);
  };

  handleNewUserMessage = newMessage => {
    console.log(`New message outgoing! ${newMessage}`);
    console.log(newMessage);
    if (!this.state.isConnected) {
      return;
    }

    this.state.connection.send(
      localStorage.getItem("username") + ": " + newMessage
    );
  };

  render() {
    return (
      <Widget
        handleNewUserMessage={this.handleNewUserMessage}
        title="Live Chat"
        subtitle={user}
        senderPlaceHolder="What can we help with?"
      />
    );
  }
}
export default ChatPlatform;
