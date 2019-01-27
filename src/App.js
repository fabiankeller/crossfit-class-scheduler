import React, { Component } from 'react';
import firebase from 'firebase';
import Header from './components/header/Header';
import Main from './components/main/Main';
import Administration from './components/administration/Administration';
import { Route } from 'react-router-dom';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    var config = {
      apiKey: "AIzaSyBtDHDpsuv4biDsCnT9r3vsw3KKjSPtoxQ",
      authDomain: "patriafit-class-scheduler.firebaseapp.com",
      databaseURL: "https://patriafit-class-scheduler.firebaseio.com",
      projectId: "patriafit-class-scheduler",
      storageBucket: "patriafit-class-scheduler.appspot.com",
      messagingSenderId: "636060870403"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
  }
  
  render() {
    return (
      <div>
        <Header/>
        <Route exact path='/' component={Main}/>
        <Route exact path='/admin' component={Administration}/>
      </div>
    );
  }
}

export default App;
