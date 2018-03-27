import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Ws} from './ws'
import Sender from "./components/Sender"
import MessageShowcase from  "./components/MessageShowcase"
import {store, chatNewMsg, loadInitialPosts, loadUser} from "./redux/redux_setup"
import {Provider} from "react-redux"
import {default as $} from "jquery"

import WebAuth from "auth0"

store.dispatch(loadInitialPosts());
loadUser();

const AUTH0_CLIENT_ID='3H5g5o08lUSWtJHarZD7RexkSYIWYjOY';
const AUTH0_DOMAIN='mussel.auth0.com';
const AUTH0_CALLBACK_URL='http://localhost:3033/';
const AUTH0_API_AUDIENCE='https://mussel.auth0.com/api/v2/';

// Ws comes from the auto-served '/iris-ws.js'
const socket = new Ws("ws://localhost:8000/echo");

socket.OnConnect(function () {
    console.log("Status: Connected\n");
});

socket.OnDisconnect(function () {
    console.log("Status: Disconnected\n");
});


// read events from the server
socket.On("chat", function (response) {
    response = JSON.parse(response);
    store.dispatch(chatNewMsg(response))
});



function addMessage(msg, user_added) {
    // output.innerHTML += user_added + ":" + msg + "\n";
}

class App extends Component {

    setupAjax(){
        $.ajaxSetup({
            'beforeSend': function(xhr) {
                if (localStorage.getItem('access_token')) {
                    xhr.setRequestHeader('Authorization',
                        'Bearer ' + localStorage.getItem('access_token'));
                }
            }
        });
    }

    parseHash() {
        this.auth0 = new WebAuth({
            domain: AUTH0_DOMAIN,
            clientID: AUTH0_CLIENT_ID
        });
        this.auth0.parseHash(window.location.hash, function (err, authResult) {
            if (err) {
                return console.log(err);
            }
            if (authResult !== null && authResult.accessToken !== null && authResult.idToken !== null) {
                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(authResult.idTokenPayload));
                window.location = window.location.href.substr(0, window.location.href.indexOf('#'))
            }
        });
    }

    autoritorize(){
        this.webAuth = new WebAuth({
            domain:       AUTH0_DOMAIN,
            clientID:     AUTH0_CLIENT_ID,
            scope:        'openid profile',
            audience:     AUTH0_API_AUDIENCE,
            responseType: 'token id_token',
            redirectUri : AUTH0_CALLBACK_URL
        });
        this.webAuth.authorize();
    }

  render() {
    return (
            <Provider store={store}>
                <div>
                    <MessageShowcase />
                    <Sender />
                </div>
            </Provider>
    );
  }
}



export default App;
export {socket}