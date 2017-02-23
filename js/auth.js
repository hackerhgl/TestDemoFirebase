let email = id("email");
let pass = id("password");
let login = id("logIn");
let signup = id("signUp");
let logout = id("logOut");
let status = id("status");

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


logout.addEventListener('click', e => {
  firebase.auth().signOut();
})

firebase.auth().onAuthStateChanged( i => {
  if(i){
    let user = firebase.auth().currentUser;
    status.innerHTML = "logged In";
    logout.classList.remove('hide');
    getUserRole(i.uid);
    firebase.database().ref('users/'+i.uid).once('value').then(res => {
      if(Object.keys(res.val()).length < 3) {
        createUser(i.uid, i.email);
      }
      if(res.val().ban) {
        console.log('Your\'e account is banned');
        firebase.auth().signOut();
      }
    });
  }
  else{
    status.innerHTML = "logged Out";
    logout.classList.add('hide');
  }
});
function writeBlog(blog) {
  let key = firebase.database().ref().child('blogs').push().key;
  let src = {};
  let slug = blog.title.replace(/\s+/g,' ').trim().toLowerCase().replace(/\s/g,'_');
  console.log(slug);
  firebase.database().ref('blogs_slugs/'+slug).set(key).then(() => {
    firebase.database().ref('blogs/'+key).set(blog);
  }).catch(e => {
    console.error(e);
  });
}
function getBlog(title) {
  firebase.database().ref('blogs_slugs/'+title).once('value').then( i => {
    if(i.val()) {
      firebase.database().ref('blogs/'+i.val()).once('value').then( blog => {
        console.log(blog.val());
      });
    } else {
      console.error('no blog found');
    }
  });
}
getBlog('this_is_testing');
function getBlogs(per=3,current) {
  per = per>0?per:3;
  per = per++;
  let db = firebase.database().ref('blogs');
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
// function writeBlog(blog) {
//   let url = blog.title.replace(/\s+/g,' ').trim().toLowerCase().replace(/\s/g,'_');
//   console.log(url);
//   firebase.database().ref('blogs/'+url).set(blog);
// }
//
function deleteBlogs() {
  firebase.database().ref('blogs').set({ok: 'ok'});
}
function testRules() {
  let id = 'AN56V8D4GOeadDBqCUAy8t95sBO2';
  let test = firebase.database().ref('users/'+id).once('value').then( i => {
    console.log(i.val());
    console.log('admin Acees');
  });
}
function testWrite() {
  let id = 'QPX6TZVrQ3gtw7oYh3gzrrhjcve2';
  firebase.database().ref('users/' + id).set({
    verified: true
  });
}
function getUserRole(uid) {
  firebase.database().ref('users/'+uid).once('value').then(res => {
    console.log(res.val().role);
  })
}

function createUser(id, email) {
  firebase.database().ref('users/'+id).set({
    email: email,
    role: 'user',
    verified: false,
    ban: false
  });
}
