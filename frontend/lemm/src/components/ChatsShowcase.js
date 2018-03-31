import React, { Component } from 'react';
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        chats: state.chats
    }
};

class Chat extends  Component{
    render(){
        return(
            <li>
                <a href="#" className="">
                    <span className="icon"><i className="fa fa-home"/></span>
                    {this.props.name}
                </a>
            </li>
        )
    }
}

class ChatsShowcase extends Component{
    render(){
        let chats = this.props.chats.chats.map((o, i)=>{ return <Chat name={o.name}/> });
        return(
            <aside className="column is-2 is-narrow-mobile is-fullheight section is-hidden-mobile">
                <p className="menu-label is-hidden-touch">Navigation</p>
                <ul className="menu-list">
                    {chats}
                </ul>
            </aside>
        )
    }
}

export default  connect(mapStateToProps)(ChatsShowcase)