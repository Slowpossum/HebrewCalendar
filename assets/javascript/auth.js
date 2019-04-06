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
    const zip = $("#zipCode").val();


    auth.createUserWithEmailAndPassword(email, password).then(function (cred) {
        uid = cred.user.uid;
        return db.collection("users").doc(cred.user.uid).set({
            events: {},
            zipCode: zip
        });
    }).then(function () {
        M.Modal.getInstance($("#signupModal")).close();
        $("#signupForm")[0].reset();
    }).catch(function (error) {
        $("#signupError").text(error);

        setTimeout(function () {
            $("#signupError").animate({ opacity: 0 }, 2000);
            setTimeout(function () {
                $("#signupError").empty();
                $("#signupError").css({ opacity: 1 });
            }, 2100);
        }, 2500);
    });
});

$("#loginForm").on("submit", function (e) {
    e.preventDefault();

    const email = $("#loginEmail").val();
    const password = $("#loginPassword").val();

    auth.signInWithEmailAndPassword(email, password).then(function (cred) {
        M.Modal.getInstance($("#loginModal")).close();
        $("#loginForm")[0].reset();
        uid = cred.user.uid;
    }).catch(function (error) {
        $("#loginError").text(error);

        setTimeout(function () {
            $("#loginError").animate({ opacity: 0 }, 2000);
            setTimeout(function () {
                $("#loginError").empty();
                $("#loginError").css({ opacity: 1 });
            }, 2100);
        }, 2500);
    });
});

$("#logoutButton").on("click", function (e) {
    e.preventDefault();

    auth.signOut();
});

$("#deleteAccount").on("click", function () {
    db.collection('users').doc(uid).delete();
    firebase.auth().currentUser.delete().then(function () {
        M.Modal.getInstance($("#accountModal")).close();
        console.log("user deleted");
    });
});

auth.onAuthStateChanged(function (user) {
    if (user) {
        $(".loggedIn").css({ "display": "block" });
        $(".loggedOut").css({ "display": "none" });
        uid = user.uid;

        db.collection("users").doc(uid).get().then(function (snap) {
            userEvents = snap.data().events;
            zipCode = snap.data().zipCode;
        }).then(function () {
            getCalendarData();
            setTimeout(createMonth, 250);
            updateEventPanel();
        });
    } else {
        $(".loggedIn").css({ "display": "none" });
        $(".loggedOut").css({ "display": "block" });
        uid = null;
        zipCode = null;
        monthHolidaysEtc = {
            allHolidays: {}
        };
        userEvents = {
        };
        $("#dailyInfo").empty();
        $("#userEvents").empty();
        $("#month").empty();
        $(".calendarContainer").css({ display: "none" });
    }
});