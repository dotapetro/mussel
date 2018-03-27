import React, {Component} from "react";


import {connect} from 'react-redux'


const mapStateToProps = state => {
    return {
        chat: state.chat
    }
};

class Message extends  Component{
    render(){
        return (
            <div className="media text-muted pt-3">
                <img data-src="holder.js/32x32?theme=thumb&amp;bg=007bff&amp;fg=007bff&amp;size=1" alt="32x32" className="mr-2 rounded" style={{width: 40, height: 40}} src="https://informatics.mccme.ru/pix/u/f1.png"/>
                <div className="media-body pb-3 mb-0  lh-125 border-bottom border-gray">
                    <div className="d-flex justify-content-between align-items-center w-100">
                        <strong className="text-gray-dark">{this.props.user}</strong>
                    </div>
                    <span className="d-block">
                        {this.props.text}
                    </span>

                </div>
            </div>
        )
    }
}

class MessageShowcase extends Component {

    constructor(props){
        super(props);
        this.state = {chat: {chat: []}}
    }

    render() {

        let msg = "No messages yet";
        if (this.props.chat.chat !== null){
            if (this.props.chat.chat.length > 0){
                msg = this.props.chat.chat.map((o, i) => <Message key={i}  text={o.message} user={o.user} /> )
            }
        }
        return (
            <div id="output-case">
                <div className="my-3 p-3 bg-white rounded box-shadow">
                    <h6 className="border-bottom border-gray pb-2 mb-0">Messages</h6>
                    {msg}
                </div>
            </div>
        );
    }
}

export default  connect(mapStateToProps)(MessageShowcase)