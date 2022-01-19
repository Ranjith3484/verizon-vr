// Initialize Firebase (ADD YOUR OWN DATA)
const firebaseConfig = {
 databaseURL: "https://verizon-vr-default-rtdb.firebaseio.com/",
};

var app = firebase.initializeApp(firebaseConfig);

// Reference users collection
var usersRef = firebase.database().ref("users");

// Listen for form submit
document.getElementById("contactForm").addEventListener("submit", submitForm);

// Submit form
function submitForm(e) {
  //enable loading overlay
  document.getElementById("overlay").style.display = "block";
  e.preventDefault();
  // Get values
  var name = getInputVal("name");
  var email = getInputVal("email");
  var phone = getInputVal("phone");

  // validate user
  validateUser(name, email, phone);
}

// Function to get get form values
function getInputVal(id) {
  return document.getElementById(id).value;
}

//block texts in phone input
function onlyNumberKey(evt) {
  // Only ASCII character in that range allowed
  var ASCIICode = evt.which ? evt.which : evt.keyCode;
  if (ASCIICode === 43) {
    //allow + operator
    return true;
  } else if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false; //dont allow lettersor symbols
  return true;
}

// Validate user to firebase
function validateUser(name, email, phone) {
  //get user data
  usersRef.once("value").then((snap) => {
    if (snap.numChildren() === 0) {
      // add user if no record exists
      pushData();
    } else {
      //if user exists check for duplicate entry
      usersRef
        .orderByChild("phone")
        .equalTo(phone)
        .once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            //if phone already exists
            showAlert({
              text:"Contact Number already exists!",
              bgColor:"#f75f54"
            })
            //disable loading overlay
            document.getElementById("overlay").style.display = "none";
          } else {
            //if phone doesn't exist
            usersRef
              .orderByChild("email")
              .equalTo(email)
              .once("value")
              .then((snapshot) => {
                if (snapshot.exists()) {
                  //if email already exists
                  showAlert({
                    text:"Email already exists!",
                    bgColor:"#f75f54"
                  })
                  //disable loading overlay
                  document.getElementById("overlay").style.display = "none";
                } else {
                  //if email doesnt exist, push data to db
                  pushData();
                }
              })
              .catch((error) => console.log(error));
          }
        })
        .catch((error) => console.log(error));
    }
  });
  function pushData() {
    //add data to firebase
    var newUserRef = usersRef.push();
    newUserRef.set({
      name: name,
      email: email,
      phone: phone,
      score: "0"
    });
    // Clear form
    document.getElementById("contactForm").reset();
    // show success message
    showSuccessPopup()
    //disable loading overlay
    document.getElementById("overlay").style.display = "none";
  }
}

//alert snackbar
function showAlert(item){
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerHTML = item.text;
  x.style.backgroundColor = item.bgColor;
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

//success popup
function showSuccessPopup(){
  var form = document.getElementById('formContainer')
  form.style.visibility = "hidden"
  var x = document.getElementById("successPopup");
  x.className = "show";
  setTimeout(function(){
     x.className = x.className.replace("show", ""); 
     form.style.visibility = "visible";
    }, 5000);
}
