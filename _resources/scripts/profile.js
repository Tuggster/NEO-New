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

function getAuthToken() {
    let userID = document.getElementById('userid').value;
    let userPassword = document.getElementById('userpw').value;

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