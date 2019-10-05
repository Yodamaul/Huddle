let TMP = {
    maximized: false
}
let user = window.store.has("user") ? window.store.get("user") : {};

var loaded = false;

var DATA = new Proxy(user, {
    set: function (target, key, value) {
        loaded = true;
        if (loaded) {
            loaded = false;
            $("#loading").text("This page is done loading!!");
        }
        target[key] = value;
        if (user.hasOwnProperty("ip")) {
            //console.log("USER");
            window.store.set('user', user);
            window.location.href = "chat.html";
        }
        return true;
    }
});

$(document).on("click", "#min-btn", function (e) {
    e.preventDefault();
    window.minpg();
});

$(document).on("click", "#max-btn", function (e) {
    e.preventDefault();
    window.togpg();
});

// document.getElementById("close-btn").addEventListener("click", function (e) {
//     e.preventDefault();
//     window.closepg();
// });


$(document).on("click", "#close-btn", function (e) {

    e.preventDefault();
    window.closepg();

    // window.storeIP("TEST");
});

$(document).on("click", "#join", function (e) {
    let key = $("#code").val(),
        name = $("#username").val();
    if (!key || !name) {
        alert("Fill in all the fields!");
    } else {
        user.name = name;
        $("#loading").text("Please wait while we ask for permission!!");
        window.retrieveData(key);
    }
});

$(document).on("click", "#new", function (e) {
    let name = $("#username").val();
    if (!name) {
        alert("Fill in all the fields!");
    } else {
        user.name = name;

        $("#loading").text("Please wait while we ask for permission!!");
        window.storeIP();
    }
});