import React, {Component} from "react";

import {connect} from  "react-redux"

const mapStateToProps = state => {
    return {
        user: state.user
    }
};

class Profile extends  Component {
    render() {
        if (this.props.user){
            return (
                <div className="navbar-end">
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                            Profile
                        </a>
                        <div className="navbar-dropdown is-boxed">
                            <span className="navbar-item">
                                <b>{this.props.user.name}</b>
                            </span>
                            <hr className="navbar-divider"/>
                            <a className="navbar-item">
                                Settings
                            </a>

                            <a className="navbar-item" >
                                Themes
                            </a>

                            <a className="navbar-item">
                                Keys
                            </a>

                            <hr className="navbar-divider"/>
                            <a onClick={this.props.logout} className="navbar-item">
                                Log out
                            </a>

                        </div>
                    </div>

                    <div className="navbar-item">
                        <div className="field is-grouped">
                            <p className="control">
                                <a className="button is-primary is-rounded">
                                          <span className="icon">
                                            <i className="fa fa-download" />

                                         </span>
                                    <span>Client</span>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (

                <div className="navbar-end">
                    <div className="navbar-item">
                        <a onClick={this.props.authorize} className="button is-rounded is-success ">
                            Sign in
                        </a>
                    </div>

                    <div className="navbar-item">
                        <a onClick={this.props.authorize} className="button is-rounded  is-info ">
                            Sign up
                        </a>
                    </div>
                </div>
            )
        }
        }
}

export default connect(mapStateToProps)(Profile)