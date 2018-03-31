import React, {Component} from "react";

import {connect} from 'react-redux'


const mapStateToProps = state => {
    return {
        chats: state.chats
    }
};

class Message extends  Component{
    render(){
        return (

            <div className="msg">
                <article className="media">
                    <div className="media-left">
                        <figure className="image is-48x48 is-rounded">
                            <img src={this.props.user.picture}/>
                        </figure>
                    </div>
                    <div className="media-content">
                        <div className="content">
                            <p>
                                <strong>{this.props.user.name}</strong> <small>@{this.props.user.nickname}</small> <small>31m</small>
                                <br/>
                                    {this.props.text}
                            </p>
                        </div>
                    </div>
                </article>
            </div>

        )
    }
}

class MessageShowcase extends Component {

    constructor(props){
        super(props);
    }

    render() {

        let msg = "No messages yet";

        /*
        if (this.props.chats.chats !== null){
            if (this.props.chats.chats.length > 0){
                msg = this.props.chats.chats.map((o, i) => <Message key={i}  text={o.message} user={o.user} /> )
            }
        }
        */

        return (
            <div id="output-case" className="column is-10">
                <div id="message-case">
                    {msg}
                </div>
            </div>
        );
    }
}

export default  connect(mapStateToProps)(MessageShowcase)