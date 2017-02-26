let email = id("email");
let pass = id("password");
let login = id("logIn");
let signup = id("signUp");
let userSign = id("userSign");
let logout = id("logOut");
let status = id("status");
let msgid = id("msgid");
let smBtn = id("smBtn");
let googleSign = id("googleSign");
let facebookSign = id("facebookSign");
let linkGoogle = id("linkGoogle");
let linkFacebook = id("linkFacebook");
let linkEmail = id("linkEmail");
let messages = {};
login.addEventListener('click', e => {
  let emailTxt = email.value;
  let passTxt = pass.value;
  let auth = firebase.auth();

  auth.signInWithEmailAndPassword(emailTxt,passTxt)
    // .then( i => console.log(i) )
    .catch( e => c(e.message) );
});
signup.addEventListener('click', e => {
  let emailTxt = email.value;
  let passTxt = pass.value;
  let auth = firebase.auth();

  auth.createUserWithEmailAndPassword(emailTxt,passTxt)
    .then( res => {
      createUser(res.uid, res.email);
    })
    .catch( e => c(e.message) );
});
userSign.addEventListener('click', i => {
  let emailTxt = email.value;
  let passTxt = pass.value;

  signInWithUserName(emailTxt, passTxt);
});
smBtn.addEventListener('click', e => {
  let message = id("mMessage").value;
  let sender = id("mUid").value;

  sendMessage(message, sender);
})
googleSign.addEventListener('click', e => {
  signUpWithGoogle();
})
facebookSign.addEventListener('click', e => {
  signUpWithFacebook();
})
linkGoogle.addEventListener('click', e => {
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.addScope('https://www.googleapis.com/auth/plus.login');
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/plus.me');
  firebase.auth().signInWithPopup(provider).then(v => {
    console.log('google signin');
    console.log(v);
  }).catch(err => {
    console.log(err);
  });
});
linkEmail.addEventListener('click', e=> {
  let emailTxt = email.value;
  let passTxt = pass.value;
  let credential =  firebase.auth.EmailAuthProvider.credential(emailTxt, passTxt);
  firebase.auth().currentUser.link(credential).then(v => {
    console.log(v);
  }).catch( e => {
    console.log(e);
  });
})
linkFacebook.addEventListener('click', e => {});
logout.addEventListener('click', e => {
  firebase.auth().signOut();
})
firebase.auth().onAuthStateChanged( i => {
  if(i){
    let user = firebase.auth().currentUser;
    status.innerHTML = "logged In";
    logout.classList.remove('hide');
    getUserRole(i.uid);
    getMessages(i.uid)
    console.log(i);;
    // firebase.database().ref('usersData/users/'+i.uid).once('value').then(res => {
    //   if(Object.keys(res.val()).length < 3) {
    //     createUser(i.uid, i.email);
    //   }
    //   if(res.val().ban) {
    //     console.log('Your\'e account is banned');
    //     firebase.auth().signOut();
    //   }
    // });
    //
  }
  else{
    status.innerHTML = "logged Out";
    logout.classList.add('hide');
  }
});
function sendMessage(message, sender) {
  console.log(firebase.auth().currentUser.uid);
  let key = firebase.database().ref('usersData/messages/'+sender).push().key;
  firebase.database().ref('usersData/messages/'+sender+'/'+key).set({
    message: message,
    sender: firebase.auth().currentUser.uid
  })
  console.log(key);
}
function signUpWithGoogle(){
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  provider.addScope('https://www.googleapis.com/auth/plus.login');
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/plus.me');
  firebase.auth().signInWithPopup(provider);
}
function signUpWithFacebook() {
  let provider = new firebase.auth.FacebookAuthProvider();
  provider.addScope('user_birthday');
  provider.addScope('public_profile');
  provider.addScope('email');
  firebase.auth().signInWithPopup(provider).then(() => {}).catch(err => {
    firebase.auth().currentUser.link(err.credential).then(c => {
      console.log('link succcess');
      console.log(c);
    }).catch(e => {
      console.log('link failed');
      console.log(e);
    })
  })
}
function signInWithUserName(username, pass) {
  firebase.database().ref('usersData/usernames/'+username).once('value').then( response => {
    if(response.val()) {
      firebase.database().ref('usersData/users/'+response.val()).once('value').then( data => {
        firebase.auth().signInWithEmailAndPassword(data.val().email,pass);
      })
    }
  })
}
function writeBlog(blog) {
  let key = firebase.database().ref().child('blogsData/blogs').push().key;
  let src = {};
  let slug = blog.title.replace(/\s+/g,' ').trim().toLowerCase().replace(/\s/g,'_');
  console.log(slug);
  firebase.database().ref('blogsData/blogs_slugs/'+slug).set(key).then(() => {
    firebase.database().ref('blogsData/blogs/'+key).set(blog);
  }).catch(e => {
    console.error(e);
  });
}
function getBlog(title) {
  firebase.database().ref('blogsData/blogs_slugs/'+title).once('value').then( i => {
    if(i.val()) {
      firebase.database().ref('blogsData/blogs/'+i.val()).once('value').then( blog => {
        console.log(blog.val());
      });
    } else {
      console.error('no blog found');
    }
  });
}
function getBlogs(per=3,current) {
  per = per>0?per:3;
  per = per++;
  let db = firebase.database().ref('blogsData/blogs');
  db = db.limitToFirst(per);
  if(current) {
    db = db.orderByKey().startAt(current)
  }
  db.on('value', i => {
    i = i.val();
    console.log(i);
    last = Object.keys(i).pop();
  })
}
function getMessages(uid){
  firebase.database().ref().child('usersData/messages/'+uid).on('value', i => {
    msgid.innerHTML = null;
    messages = i.val();
    console.log(messages);
    for(let key in messages) {
      firebase.database().ref().child('usersData/users/'+messages[key].sender+'/email').once('value').then(v => {
        msgid.innerHTML += '<div class="list-group-item"><h3>'+v.val()+'</h3><br><p>'+messages[key].message+'</p></div>';
      })
    }
  })
}
function deleteBlogs() {
  firebase.database().ref('blogsData/blogs').set({ok: 'ok'});
}
function testRules() {
  let id = 'AN56V8D4GOeadDBqCUAy8t95sBO2';
  let test = firebase.database().ref('usersData/users/'+id).once('value').then( i => {
    console.log(i.val());
    console.log('admin Acees');
  });
}
function testWrite() {
  let id = 'QPX6TZVrQ3gtw7oYh3gzrrhjcve2';
  firebase.database().ref('usersData/users/' + id).set({
    verified: true
  });
}
function getUserRole(uid) {
  firebase.database().ref('usersData/users/'+uid).once('value').then(res => {
    id("role").innerHTML = res.val().role;
  })
}
function createUser(id, email) {
  firebase.database().ref('usersData/users/'+id).set({
    email: email,
    role: 'user',
    verified: false,
    ban: false
  });
}
