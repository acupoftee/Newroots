import React, { Component } from 'react';
import icon from './../graphics/icon.png';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestsLength: props.requestsLength
    };
  }

  componentDidMount() {
    var requestsRef = this.props.firebase.user(this.props.uid).collection("requests");

    requestsRef.get().then(function(doc){
      this.setState({ requestsLength: doc.data().length })
    })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  }

  setAddFriend = (bool) => {
    this.setState({
      addFriend: bool
    });
  }

  render() {
    let networkNotif = null;
    if (this.state.requestsLength > 0) {
      networkNotif = (
        <span className="alert">{this.state.requestsLength}</span>
      );
    }
    return (
      <nav className="main-nav">
        <div className="nav-content">
          <img className="logo-img" src={icon} />
          <span className="logo">my_friends
          <span className="sublogo">give and get support.</span>
          </span>
          <button id="feed-but" onClick={() => this.props.setActiveTab(0)}>
            <span className="jam jam-messages-alt" style={{ color: '#9FC6C1' }}></span></button>
          <button id="network-but" onClick={() => this.props.setActiveTab(1)}>
            <span className="jam jam-users" style={{ color: '#9FC6C1' }}></span>
            {networkNotif}
          </button>
          <button id="user-but" onClick={() => this.props.setActiveTab(2)}><span className="jam jam-user" style={{ color: '#9FC6C1' }}></span></button>
        </div>
      </nav>
    );
  }
}

export default NavBar;