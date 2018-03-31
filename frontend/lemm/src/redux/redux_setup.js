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
    fetching: true,
    error: null,
};

const chatReducer = (state=chatsInitial, action)=> {
    switch(action.type){
        case "FETCH_CHAT":
            state.chats = action.payload;
            console.log("FETCH CALLED!!!");
            console.log("pl:", action.payload);

            return {...state, chats: action.payload};
        case "FETCH_CHAT_START":
            return {...state, fetching: true};
        case "FETCH_CHAT_ERR":
            return {...state, err: action.payload};
        case "CHAT_NEW_MSG":
            let newChat = state.chats;

            if (newChat === null){
                newChat = []
            }

            newChat.push(action.payload);
            return {...state, chats: newChat};
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

export const loadChats = ()=> {
    return (dispatch)=>{
        dispatch({type: "FETCH_CHAT_START"});

    }

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