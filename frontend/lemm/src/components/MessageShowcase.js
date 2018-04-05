import React, {Component} from "react";
import PropTypes from  "prop-types"
import {connect} from 'react-redux'


const mapStateToProps = state => {
    return {chats: state.chats}
};

class Message extends  Component{
    render(){

        let addPic = "";
        let addInfo = "";

        if(this.props.showAdditional){
            addInfo = (
                <span>
                <strong>{this.props.user.name}</strong> <small>@{this.props.user.nickname}</small> <small>31m</small>
                <br/>
            </span>
            );
            addPic = (
                <figure className="image is-48x48 is-rounded">
                    <img src={this.props.user.picture}/>
                </figure>
            );
        }

        return (

            <div className="msg">
                <article className="media">
                    <div className="media-left profile-pic">
                        {addPic}
                    </div>
                    <div className="media-content">
                        <div className="content">
                            <p>
                                {addInfo}
                                {this.props.text}
                            </p>
                        </div>
                    </div>
                </article>
            </div>

        )
    }
}

Message.propTypes = {
    showAdditional: PropTypes.bool,

};

class MessageShowcase extends Component {

    constructor(props){
        super(props);
    }

    render() {

        let msg = "No messages yet";
        let pos = this.props.chats.chats.map((e)=>{return e.id}).indexOf(this.props.chats.current);

        let messages = null;
        if(pos >= 0){
            messages = this.props.chats.chats[pos].messages
        }

        if (messages !== null){
            if (messages.length > 0){
                msg = messages.map((o, i) => <Message key={o.id}  text={o.message} user={o.user} showAdditional={messages[i-1] !== undefined ? o.user.id !== messages[i-1].user.id : true } /> )
            }
        }


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