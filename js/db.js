var data =  id("obj");
var listid = id("list");

var db = firebase.database().ref().child('Object');
var list = db.child("list");
db.on('value', i => {
  data.innerText = JSON.stringify(i.val() , null,3);
});
list.on('child_added', i => {
  let li = document.createElement('li');
  li.innerText = i.val();
  li.id = i.key;
  listid.appendChild(li);
});
list.on('child_changed', i => {
  let li = id(i.key);
  li.innerText = i.val();
});
list.on('child_removed', i => {
  let li = id(i.key);
  li.remove();
});
