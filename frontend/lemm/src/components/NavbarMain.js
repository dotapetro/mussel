import React, {Component} from "react"
import Profile from "./Profile"
import {connect} from  "react-redux"

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

class NavbarMain extends  Component{
    render(){
        return(
            <nav className="navbar is-transparent">
                <div className="navbar-brand">
                    <a className="navbar-item" href="https://bulma.io">
                        <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28"/>
                    </a>
                    <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
                        <span>

                        </span>
                        <span>

                        </span>
                        <span>

                        </span>
                    </div>
                </div>

                <div id="navbarExampleTransparentExample" className="navbar-menu">
                    <div className="navbar-start">
                        <a className="navbar-item" >
                            Home
                        </a>
                        <a className="navbar-item" >
                            Groups
                        </a>
                        <a className="navbar-item" >
                            Chat
                        </a>
                        <a className="navbar-item" >
                            Docs
                        </a>
                        <a className="navbar-item" >
                            Api
                        </a>
                    </div>


                    <Profile authorize={this.props.authorize} logout={this.props.logout}/>
                </div>
            </nav>
        )
    }
}

export default connect(mapStateToProps)(NavbarMain)