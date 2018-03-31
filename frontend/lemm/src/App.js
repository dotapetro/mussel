import React, { Component } from 'react';

import "../node_modules/bulma/css/bulma.css"
import './App.css';

import {Ws} from './lib/ws'

import {store, chatNewMsg, loadInitialPosts, loadUser, setUser, logoutUser} from "./redux/redux_setup"
import {Provider} from "react-redux"
import {WebAuth} from "auth0-js";
import {default as $} from "jquery"
import {default as axs} from "axios";

import Sender from "./components/Sender"
import MessageShowcase from  "./components/MessageShowcase"
import NavbarMain from "./components/NavbarMain"
import ChatsShowcase from "./components/ChatsShowcase"

const AUTH0_CLIENT_ID='3H5g5o08lUSWtJHarZD7RexkSYIWYjOY';
const AUTH0_DOMAIN='mussel.auth0.com';
const AUTH0_CALLBACK_URL='http://localhost:1234/';
const AUTH0_API_AUDIENCE='https://mussel.auth0.com/api/v2/';

// Ws comes from the auto-served '/iris-ws.js'
const socket = new Ws("ws://localhost:8000/echo");

socket.OnConnect(function () {
    console.log("Status: Connected\n");
    let token = localStorage.getItem("id_token");
    console.log("tkn! :", token);
    let req = JSON.stringify({token: token, payload: ""});
    console.log("req!", req);
    socket.Emit("get_chats", req)
});

socket.OnDisconnect(function () {
    console.log("Status: Disconnected\n");
});


// read events from the server
socket.On("chat", function (response) {
    if(localStorage.getItem("onPing") === "true"){

        let remained = parseInt(localStorage.getItem("pingRemained"));
        remained--;
        if(remained === 0){
            localStorage.setItem("onPing", "false");

            let td = Date.now() - Date.parse(localStorage.getItem("pingStarted"));
            console.log("Done! time diff: " + td / 1000 + " s" );


        } else {
            console.log("Remained:", remained, "out of", localStorage.getItem('pingTimes'));
            localStorage.setItem("pingRemained", remained.toString());
        }

    }
    response = JSON.parse(response);
    store.dispatch(chatNewMsg(response));
});

socket.On("get_chats", function (response) {
    response = JSON.parse(response);

    store.dispatch({type: "FETCH_CHAT", payload: response});
    store.dispatch({type: "FETCH_CHAT_COMPLETE"});
    console.log(response);
});


class App extends Component {


    constructor(props){
        super(props);
        this.parseHash = this.parseHash.bind(this);
        this.authorize = this.authorize.bind(this);
        this.setupAjax = this.setupAjax.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentWillMount(){

        loadUser();

        this.setupAjax();
        this.parseHash();
    }

    authorize(){
        this.webAuth = new WebAuth({
            domain:       AUTH0_DOMAIN,
            clientID:     AUTH0_CLIENT_ID,
            scope:        'openid profile',
            audience:     AUTH0_API_AUDIENCE,
            responseType: 'token id_token'
        });

        this.webAuth.authorize();
    }

    logout(){
        console.log("FATAL LOGOUT CALLED!");
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('profile');
        logoutUser();
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
                console.log("Auth completed: succ");
                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                localStorage.setItem('profile', JSON.stringify(authResult.idTokenPayload));
                setUser(authResult.idTokenPayload);

                window.location = window.location.href.substr(0, window.location.href.indexOf('#'))
            } else {
                console.log("Auth completed: fail");
            }
        });
    }

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



    render() {
        return (
            <Provider store={store}>
                <div>
                    <NavbarMain authorize={this.authorize} logout={this.logout}/>

                    <section className="main-content columns is-fullheight">
                        <ChatsShowcase />
                        <MessageShowcase />
                    </section>

                    <Sender authorize={this.authorize} />
                </div>
            </Provider>
        );
    }
}



export default App;
export {socket}