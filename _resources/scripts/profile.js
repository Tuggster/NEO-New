function hide(elName) {
    let elements = document.getElementsByName(elName);
    elements.forEach(element => {
        element.classList.add("hidden");
    });
}

function show(elName) {
    let elements = document.getElementsByName(elName);
    elements.forEach(element => {
        element.classList.remove("hidden");
    });
}

function createAccount() {
    let userpw = document.getElementById('createpw').value
    let userpwconfirm = document.getElementById('createpwconfirm').value

    if (userpw == userpwconfirm && userpw.length >= 8) {
        sendAccountCreation(userpw);
    }
}

let userID;
function sendAccountCreation(password) {
    httpReq("POST", `http://${NEOBANCO_ip}/createuser`, JSON.stringify({
        password
    })).then(response => {
        console.log(response);
        show("created");
        hide("create");
        document.getElementById("userid-display").innerHTML = `Your User ID: ${response}`
        userID = response;
    })
}

function startSession() {
    let pledged = document.getElementById('pledge').checked;
    let userpw = document.getElementById('createpw').value

    if (pledged) {
        getAuthToken(userID, userpw);
    }
}

function getAuthToken(id, pw) {
    let userID = document.getElementById('userid').value;
    let userPassword = document.getElementById('userpw').value;

    if (id && pw) {
        userID = id;
        userPassword = pw;
    }

	var url = `http://${NEOBANCO_ip}/auth/register?&userid=${userID}&userpw=${userPassword}`;
    httpReq('GET', url).then(res => {
        console.log(res);
        if (res != 'Unauthorized') {
            sessionStorage.setItem("sessionToken", res);
            document.location = "../posts"
        } else {
            alert("uh oh!")
        }
    });
}