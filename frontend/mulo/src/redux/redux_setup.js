// ______________Redux______________

import {applyMiddleware, combineReducers, createStore} from "redux";
import {default as tnk} from "redux-thunk";
import {createLogger} from "redux-logger";
import {default as axs} from "axios";


const userReducer = (state={user: false}, action)=> {
    switch(action.type){
        case "LOGIN_USER":
            return state = action.payload;
        case "LOGOUT_USER":
            return state = false;
    }
    return state
};


const chatInitial = {
    chat: [],
    fetching: true,
    error: null,
};

const chatReducer = (state=chatInitial, action)=> {
    switch(action.type){
        case "FETCH_CHAT":
            state.chat = action.payload;
            return {...state, chat: action.payload};
        case "FETCH_CHAT_START":
            return {...state, fetching: true};
        case "FETCH_CHAT_ERR":
            return {...state, err: action.payload};
        case "CHAT_NEW_MSG":
            let newChat = state.chat;

            if (newChat === null){
                newChat = []
            }

            newChat.push(action.payload);
            return {...state, chat: newChat};
        case "FETCH_CHAT_COMPLETE":
            return {...state, fetching: false};
    }
    return state
};

const middleware = applyMiddleware(tnk, createLogger());

const reducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
});



export const store = createStore(reducer, middleware);




export const chatNewMsg = (msg)=>{
    return {
        type: "CHAT_NEW_MSG",
        payload: msg
    }
};

export const loadInitialPosts = ()=> {
    return (dispatch)=>{
            dispatch({type: "FETCH_CHAT_START"});

        axs.get("http://localhost:8000/messages").then((response) => {
            dispatch({type: "FETCH_CHAT", payload: response.data});
        }).catch((err) => {
            dispatch({type: "FETCH_CHAT_ERR", payload: err})
        }).then(() => {
            dispatch({type: "FETCH_CHAT_COMPLETE"})
        })
    }

};

export const loadUser = ()=>{
    let idToken = localStorage.getItem('profile');
    if(idToken){
        store.dispatch({type: "LOGIN_USER", payload: idToken})
    }
};