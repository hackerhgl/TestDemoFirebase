let id = i => document.getElementById(i);
let c = i => console.log(i);
let config = {
  apiKey: "AIzaSyAJgCY3svUjH_GRFg8bUhcjDchH07RQAGE",
  authDomain: "helloworld-9b220.firebaseapp.com",
  databaseURL: "https://helloworld-9b220.firebaseio.com",
  storageBucket: "helloworld-9b220.appspot.com",
  messagingSenderId: "633179015285"
};
firebase.initializeApp(config);
