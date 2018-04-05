import React, { Component } from 'react';
import {socket} from "../App";
import {connect} from 'react-redux';

const mapStateToProps = state => {
    return {
        user: state.user,
        current: state.chats.current,
    }
};

class Sender extends Component {

    constructor(props){
        super(props);
        this.send = this.send.bind(this);
        this.checkEnterThenSend = this.checkEnterThenSend.bind(this);
        this.ping = this.ping.bind(this);
        this.input = null;
    }

    send() {

        if(this.input.value === ""){
            return
        }

        let token = localStorage.getItem("id_token");
        let request = {user: {name: "", nickname:"", gender:"", picture: ""}, message: this.input.value};
        this.input.value = "";

        socket.emit("chat", JSON.stringify({token: token, chat: this.props.current, payload: JSON.stringify(request)}));// send chat event data to the websocket server
    }

    checkEnterThenSend(e){
        if(e.key === 'Enter'){
            this.send()
        }
    }

    ping(times){
        let a = new Date();
        localStorage.setItem("onPing", "true");
        localStorage.setItem("pingStarted", a.toString());
        localStorage.setItem("pingTimes", times.toString());
        localStorage.setItem("pingRemained", times.toString());

        for(let i = 0; i < times; i++){
            console.log("ping");

            let token = localStorage.getItem("id_token");
            let request = {user: {name: "", nickname:"", gender:"", picture: ""}, message: "payload"};

            socket.emit("chat", JSON.stringify({token: token, chat: this.props.current, payload: JSON.stringify(request)}));// send chat event data to the websocket server
        }
    }


    componentWillMount(){
        setTimeout(()=>this.ping(0), 1000)
    }



    render() {
        if (this.props.user  !== false){
            return (
                <div className="field has-addons " id="input-form">
                    <div className="control  is-expanded">
                        <input onKeyPress={this.checkEnterThenSend} ref={(input)=>this.input=input} className="input is-medium is-rounded" type="text" placeholder="Type message..."/>
                    </div>
                    <div className="control">
                        <a className="button is-info is-medium is-outlined is-rounded" onClick={this.send}>
                            Send
                        </a>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="field  " id="input-form">
                    <div className="control is-expanded">
                        <div className="button is-info is-outlined is-medium is-rounded is-block" onClick={this.props.authorize}>
                            Start messaging
                        </div>
                    </div>
                </div>
            );
        }


    }
}



export default connect(mapStateToProps)(Sender);