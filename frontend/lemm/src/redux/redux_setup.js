// ______________Redux______________

import {applyMiddleware, combineReducers, createStore} from "redux";
import {default as tnk} from "redux-thunk";
import {createLogger} from "redux-logger";
import {default as axs} from "axios";


const userReducer = (state=false, action)=> {
    switch(action.type){
        case "LOGIN_USER":
            return state = action.payload;
        case "LOGOUT_USER":
            return state = false;
    }
    return state
};


const chatsInitial = {
    chats: [],
    current: null,
    fetching: true,
    error: null,
};

const chatReducer = (state=chatsInitial, action)=> {
    switch(action.type){
        case "FETCH_CHAT":
            return {...state, chats: action.payload, current: action.payload[0].id};
        case "SET_CURRENT":
            return {...state, current: action.payload};
        case "FETCH_CHAT_START":
            return {...state, fetching: true};
        case "FETCH_CHAT_ERR":
            return {...state, err: action.payload};
        case "CHAT_NEW_MSG":
            let newChats = state.chats;
            let pos = state.chats.map(function(e) { return e.id; }).indexOf(action.payload.chat_id);
            if(newChats[pos].messages === null){
                newChats[pos].messages = []
            }
            newChats[pos].messages.push(action.payload.message);
            return {...state, chats: newChats};
        case "FETCH_CHAT_COMPLETE":

            return {...state, fetching: false};
    }
    return state
};

const middleware = applyMiddleware(tnk, createLogger());
//const middleware = applyMiddleware(tnk);

const reducer = combineReducers({
    user: userReducer,
    chats: chatReducer,
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

export const setCurrent = (payload)=> {
        return store.dispatch({type: "SET_CURRENT", payload})

};

export const loadUser = ()=>{
    let profile = localStorage.getItem('profile');
    if(profile){
        if(typeof(profile) === "string"){
            profile = JSON.parse(profile)
        }
        store.dispatch({type: "LOGIN_USER", payload: profile})
    }
};

export const setUser = (profile)=>{
    if(typeof(profile) === "string"){
        profile = JSON.parse(profile)
    }
    store.dispatch({type: "LOGIN_USER", payload: profile})

};


export const logoutUser = ()=>{
    store.dispatch({type: "LOGOUT_USER"})

};