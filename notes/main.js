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

  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var cross = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on <span> (x), close the modal
  cross.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
        $('#modal').modal('toggle');
      }
  }

// Reference notities collection
var notitiesRef = database.ref('notities');

// Listen for form submit
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
    e.preventDefault();

    // Get values
    var voor = getInputVal('inputVoor');
    var organisatie = getInputVal('inputOrganisatie');
    var notitie = getInputVal('inputNotitie');

    saveNotitie(voor, organisatie, notitie);

    // Show alert
    $("#alertThanks").removeClass('d-none');

    // Hide alert after 3 secs
    setTimeout(function(){
      $('#myModal').modal('toggle');
      $("#myBtn").addClass('d-none');
      $("#alertThanks").addClass('d-none');
    }, 1500);

    // Clear form
    document.getElementById('contactForm').reset();
    }

// function to get form values
function getInputVal(id){
  return document.getElementById(id).value;
}

// Save notities to Firebase
function saveNotitie(voor, organisatie, notitie) {
  var newNotitiesRef = notitiesRef.push();
  newNotitiesRef.set({
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    voor: voor,
    organisatie: organisatie,
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
  var organisatie = snapshot.val().organisatie;
  var notitie = snapshot.val().notitie;
  var time = timeStampToDate(snapshot.val().timestamp);

  $notities.prepend(
    '<div class="card w-50">' +
      '<div class="card-block">' +
          '<h3 class="card-header card-inverse card-warning p-2 text-center">' + voor + '</h3>' +
          '<h5 class="card-title text-center card-inverse" style="background-color: #AAB7B8;">' + organisatie + '</h5>' +
          '<p class="card-text card-outline-secondary">' + notitie + '</p>' +
          '<p class="card-footer"><small class="text-muted">' + time + '</small></p>' +
      '</div>' +
    '</div>'
  );
});
