let uploader = id('uploader');
let file = id('file');

file.addEventListener('change', i => {
  let file = i.target.files[0];
  let storage = firebase.storage().ref('photos/'+file.name);
  let task = storage.put(file);

  task.on('state_changed',
    function progress(i) {
      let value = parseInt((i.bytesTransferred / i.totalBytes) * 100);

      uploader.innerText = value;
      uploader.style.width = value+'%';
    },
    function error(e) {
      uploader.classList.remove('progress-bar-warning');
      uploader.classList.add('progress-bar-danger');
    },
    function success(v) {
      uploader.classList.remove('progress-bar-warning');
      uploader.classList.add('progress-bar-success');
    }
  );
})
