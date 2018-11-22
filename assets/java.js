$(document).ready(function() {
  // Initialize Firebase

  var config = {
    apiKey: "AIzaSyB7sxWyC96lgk9DINe0-eKGsihqKEfjAjk",
    authDomain: "traintime-21f65.firebaseapp.com",
    databaseURL: "https://traintime-21f65.firebaseio.com",
    projectId: "traintime-21f65",
    storageBucket: "traintime-21f65.appspot.com",
    messagingSenderId: "52533829924"
  };
  firebase.initializeApp(config);

  // Declaro mis variables
  var database      = firebase.database();
  var name          = "";
  var destination   = "";
  var firstTrain    = "";
  var frequency     = 0;

  // Captura de datos de la forma y envio a BD on click

  $("#submitId").on("click", function(event) {
    event.preventDefault();

    name = $("#name-input")
      .val()
      .trim();
    destination = $("#destination-input")
      .val()
      .trim();
    firstTrain = $("#firstTrain-input")
      .val()
      .trim();
    frequency = $("#frequency-input")
      .val()
      .trim();

    database.ref().push({
      nameTrain: name,
      destinationTrain: destination,
      firstTrainTime: firstTrain,
      frequencyTrain: frequency
    });
    
    // Borrar los campos
    $(".form-control").val("");
  });

  // Nos comunicamos a la BD para traernos los datos de los trenes y ponerlos en la tabla

  database.ref().on(
    "child_added",
    function(snapshotChild) {

      // Ponemos los valores en variables para darle mas claridad al codigo
      var nameOfTrain        = snapshotChild.val().nameTrain;
      var destinationOfTrain = snapshotChild.val().destinationTrain;
      var firstTrainTime     = snapshotChild.val().firstTrainTime;
      var frequencyOfTrain   = snapshotChild.val().frequencyTrain;

      // Calculos con Moment
      var tFrequency = frequencyOfTrain;
      var firstTime = firstTrainTime;
      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      // Time apart (remainder)
      var tRemainder = diffTime % tFrequency;
      // Minute Until Train
      var tMinutesTillTrain = tFrequency - tRemainder;
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");

      // Creamos el nuevo renglon

      var newRow = $("<tr>").append(
        $("<td>").text(nameOfTrain),
        $("<td>").text(destinationOfTrain),
        $("<td>").text(frequencyOfTrain),
        $("<td>").text(nextTrain.format("LT")),
        $("<td>").text(tMinutesTillTrain)
      );

      // Agregamos en nuevo renglon a la tabla

      $("#train-table > tbody").append(newRow);

      // if any errors are experienced, log them to console
    },
    function(errorObject) {
      console.log("Errors Handled: " + errorObject.code);
    }
  );
});
