import React, { Component } from 'react';
import {socket} from "../App";
import {default as $} from "jquery"
import WebAuth from "auth0"

import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

class Sender extends Component {

    constructor(props){
        super(props);
        this.send = this.send.bind(this);
        this.input = null;
    }

    send() {
        //this.props.addMessage();

        let request = {user: this.props.user.username, message: this.input.value};
        console.log(request);
        this.input.value = "";
        socket.Emit("chat", JSON.stringify(request));// send chat event data to the websocket server
        console.log("request sent")
    }



    render() {


        return (
            <div className="input-group input-group-lg" id="input-form">
                <input id="input" type="text" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm" ref={(input)=>this.input=input} />
                <div className="input-group-append">
                    <button onClick={this.send} className="btn btn-outline-primary" type="button">Send</button>
                </div>
            </div>
        );


    }
}



export default connect(mapStateToProps)(Sender);