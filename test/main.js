// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAehAyrs62Vpdjr8fdNa8qappI821bqu-A",
    authDomain: "smart-start-10a9a.firebaseapp.com",
    databaseURL: "https://smart-start-10a9a.firebaseio.com",
    projectId: "smart-start-10a9a",
    storageBucket: "smart-start-10a9a.appspot.com",
    messagingSenderId: "397921623434"
  };
  firebase.initializeApp(config);
  database = firebase.database();

// Reference notities collection
var notitiesRef = database.ref('notities');

// Listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
    e.preventDefault();

    // Get values
    var voor = getInputVal('inputVoor');
    var tussen = getInputVal('inputTussen');
    var achter = getInputVal('inputAchter');
    var email = getInputVal('inputEmail');
    var notitie = getInputVal('inputNotitie');

    saveNotitie(voor, tussen, achter, email, notitie);

    // Show alert
    $("#alertThanks").removeClass('d-none');

    // Hide alert after 3 secs
    setTimeout(function(){
      $("#alertThanks").addClass('d-none');
    }, 3000);

    // Clear form
    document.getElementById('contactForm').reset();
    }


// function to get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save notities to Firebase
function saveNotitie(voor, tussen, achter, email, notitie) {
  var newNotitiesRef = notitiesRef.push();
  newNotitiesRef.set({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    voor: voor,
    tussen: tussen,
    achter: achter,
    email: email,
    notitie: notitie
  });
}

notitiesRef.on('value', gotData, errData);

function gotData(data){
  console.log(data.val());
}

function errData(err){
  console.log('Error');
  console.log(err);
}

function timeStampToDate(timestamp){
var dateTime = new Date(timestamp);
var dateTime = new Date(dateTime + ' UTC');
return dateTime.toISOString().slice(0, 10) + ' ' + dateTime.toISOString().slice(11, 16);
}

// Add cards
var $notities = $('#notities');
notitiesRef.on('child_added', function (snapshot) {
  var voor = snapshot.val().voor;
  var tussen = snapshot.val().tussen;
  var achter = snapshot.val().achter;
  var notitie = snapshot.val().notitie;
  var time = timeStampToDate(snapshot.val().timestamp);

  $notities.prepend(
    '<div class="card">' +
      '<div class="card-block">' +
          '<h3 class="card-header card-inverse card-warning p-2 text-center">' + voor + '</h3>' +
          '<h5 class="card-title text-center card-inverse" style="background-color: #AAB7B8;">' + tussen + ' ' + achter + '</h5>' +
          '<p class="card-text card-outline-secondary">' + notitie + '</p>' +
          '<p class="card-footer"><small class="text-muted">Geplaatst op: ' + time + '</small></p>' +
      '</div>' +
    '</div>'
  );
});
