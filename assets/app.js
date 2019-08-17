  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDvddeAa3GtZT-IaEPFAwBKgtBiEwPpHHk",
    authDomain: "trainschedular-4a30f.firebaseapp.com",
    databaseURL: "https://trainschedular-4a30f.firebaseio.com",
    projectId: "trainschedular-4a30f",
    storageBucket: "trainschedular-4a30f.appspot.com",
    messagingSenderId: "623307320782",
    appId: "1:623307320782:web:05577d464caecd76"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Create a variable to reference the database
  var database = firebase.database();
  
  // Create an on click function that adds trax to the top table
  $("#add-trax-btn").on("click", function(event) {
    event.preventDefault();

    console.log(event);
  
    // create variables with the user input from form
    var trxName = $("#trax-name-input").val().trim();
    var trxDest = $("#destination-input").val().trim();
    var firstTrxTime = $("#first-trax-input").val().trim();
    var trxFreq = $("#frequency-input").val().trim();
  
    // create a temporary object for holding the new trax data
    var newTrx = {
      name: trxName,
      destination: trxDest,
      firstTime: firstTrxTime,
      frequency: trxFreq
    };
  
    // upload the new trax data to the database
    database.ref().push(newTrx);
  
    // console log the values that were just pushed to the database
    console.log(newTrx.name);
    console.log(newTrx.destination);
    console.log(newTrx.firstTime);
    console.log(newTrx.frequency);
  
    // clear the form values after values have been stored
    $("#trax-name-input").val("");
    $("#destination-input").val("");
    $("#first-trax-input").val("");
    $("#frequency-input").val("");
  });
  
  // create a firebase event for adding the data from the new trax and then populating them in the DOM.
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // store snapshot changes in variables
    var trxName = childSnapshot.val().name;
    var trxDest = childSnapshot.val().destination;
    var firstTrxTime = childSnapshot.val().firstTime;
    var trxFreq = childSnapshot.val().frequency;
  
    // log the values
    console.log(trxName);
    console.log(trxDest);
    console.log(firstTrxTime);
    console.log(trxFreq);
  
    // process for calculating the Next Arrival and Minutes Away fields...
    // make sure the first trax time is after the eventual current time
    var firstTrxTimeConv = moment(firstTrxTime, "hh:mm a").subtract(1, "years");
    // store variable for current time
    var currentTime = moment().format("HH:mm a");
    console.log("Current Time:" + currentTime);
    // store variable for difference of current time and first trax time
    var trxTimeCurrentTimeDiff = moment().diff(moment(firstTrxTimeConv), "minutes");
    // store the time left
    var timeLeft = trxTimeCurrentTimeDiff % trxFreq;
    // calculate and store the minutes until next trax arrives
    var minutesAway = trxFreq - timeLeft;
    // calculate the next arriving trax
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");
  
    // add the data into the DOM/html
    $("#trax-table > tbody").append("<tr><td>" + trxName + "</td><td>" + trxDest + "</td><td>" + trxFreq + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  });