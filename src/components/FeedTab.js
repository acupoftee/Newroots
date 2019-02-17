import React, { Component } from 'react';
import $ from 'jquery';
import autosize from 'autosize';
import CheckinPost from './CheckinPost';
import ThoughtPost from './ThoughtPost';
import moment from 'moment';
import ThoughtInput from './ThoughtInput';

import graphics1 from '../graphics/1.png';
import ErrorMsg from './ErrorMsg';

let feedListen;

class FeedTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thoughts: [],
      checkins: [],

    }
    //this.processTime = this.processTime.bind(this);
  }
  /*
    -PpfURL : string (optional)
    -name : string
    -isMyPost : bool
    -timestamp : string - e.g. a few seconds ago
    -conversation : array

  - example of conversation: 
  [
    {
      uid: 'fdsadsadaad'
      PpfURL: '...'
      poster: true //is message from poster
      message: 'hi i love'
      
    },
   ...
  ]
  */
  componentDidMount() {
    autosize($('textarea'));
    let element = this;
    let tempFeed = [];
    let tempCheckins = this.state.checkins;
    let tempThoughts = this.state.thoughts;
    feedListen = this.props.firebase.user(this.props.uid).collection("feed")
      .onSnapshot((snapshot) => {
        //let tempFeed = [];
        snapshot.docChanges().forEach((change) => {
          console.log("changety[e]: " + change.type);
          if (change.type === "added") {
            console.log("New city: ", change.doc.data());
            tempFeed.push(change.doc.id);
            let dat = change.doc.data();
            if (change.doc.data().checkin) {
              tempCheckins.unshift({
                uid: dat.uid,
                name: dat.name,
                PpfURL: dat.PpfURL,
                timestamp: moment(dat.timestamp).format('lll'),
                postid: change.doc.id,
                checkinData: dat.checkinData
              })
            }
            else {
              tempThoughts.unshift({
                uid: dat.uid,
                name: dat.name,
                PpfURL: dat.PpfURL,
                thought: dat.thought,
                message: dat.message,
                comments: dat.comm_cont,
                conversation: [],
                postid: change.doc.id,
                timestamp: moment(dat.timestamp).format('lll'),
              })
            }
          }

        });
        console.log(JSON.stringify(tempCheckins));
        console.log(JSON.stringify(tempThoughts));
        element.setState({
          checkins: tempCheckins,
          thoughts: tempThoughts
        })
        /*element.setState({
          checkins: tempCheckins,
          thoughts: tempThoughts
        })*/
      });
  }
  componentWillUnmount() {
    feedListen();
  }

  /*feed = this.props.feed;

  for (var i = 0; i< feed.length; i++){
    
  }*/
  /*<ThoughtPost /> 
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  */
  //const checkins = this.state.checkins;
  render() {

    let checkinItems = this.state.checkins.map((checkin, index) =>
      <CheckinPost
        uid={this.props.uid}
        posterUid={checkin.uid}
        
        PpfURL={checkin.PpfURL}
        key={toString(index)}
        name={checkin.name}
        timestamp={checkin.timestamp}

        postid={checkin.postid}
        checkinData={checkin.checkinData}
        firebase={this.props.firebase}
      />
    );
    let thoughtItems = this.state.thoughts.map((thought, index) =>
      <ThoughtPost
        uid={this.props.uid}
        posterUid={thought.uid}

        PpfURL={thought.PpfURL}
        key={toString(index)}
        name={thought.name}
        thought={thought.thought}
        timestamp={thought.timestamp}
        
        message={thought.message}
        postid={thought.postid}
        firebase={this.props.firebase
        } />
    );


    return (

      <section className="feed">
        <ThoughtInput
          PpfURL={this.props.PpfURL}
          name={this.props.name}
          uid={this.props.uid}
          network={this.props.network}
          firebase={this.props.firebase}
        />
        <h1 className="date-marker">February 17</h1>
        {checkinItems}
        {thoughtItems}


        <ErrorMsg
          src={graphics1}
          header='Nothing more.'
          msg='Why not post a thought?'
        />

      </section>
    );
  }
}

export default FeedTab;
