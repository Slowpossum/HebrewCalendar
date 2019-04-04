//
//
//  VARIABLES AND DATABASE INITIALIZATION
//
//
var config = {
    apiKey: "AIzaSyDMKN0WOiDGrVDZPF3qsHaYIAZ5ROlNnLo",
    authDomain: "hebrew-calendar-2363d.firebaseapp.com",
    databaseURL: "https://hebrew-calendar-2363d.firebaseio.com",
    projectId: "hebrew-calendar-2363d",
    storageBucket: "hebrew-calendar-2363d.appspot.com",
    messagingSenderId: "205398509699"
};
firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

const signupForm = $("#signupForm");

var currentUser = "";


//
//
//  FUNCTIONS AND BUTTONS
//
//
$("#signupForm").on("submit", function (e) {
    e.preventDefault();

    const email = $("#signupEmail").val();
    const password = $("#signupPassword").val();

    auth.createUserWithEmailAndPassword(email, password).then(function (cred) {
        return db.collection("users").doc(cred.user.uid).set({
            events: ""
        });
    }).then(function () {
        M.Modal.getInstance($("#signupModal")).close();
        $("#signupForm")[0].reset();
    }).catch(function (error) {
        console.log(error);
    });
});

$("#logoutButton").on("click", function (e) {
    e.preventDefault();

    auth.signOut();
});

$("#loginForm").on("submit", function (e) {
    e.preventDefault();

    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();

    auth.signInWithEmailAndPassword(email, password).then(function (cred) {
        M.Modal.getInstance($("#loginModal")).close();
        $("#loginForm")[0].reset();
    });
});

auth.onAuthStateChanged(function (user) {
    if (user) {
        console.log("user logged in: ", user);
        $(".loggedIn").css({ "display": "block" });
        $(".loggedOut").css({ "display": "none" });
    } else {
        console.log("user logged out");
        $(".loggedIn").css({ "display": "none" });
        $(".loggedOut").css({ "display": "block" });
    }
});
