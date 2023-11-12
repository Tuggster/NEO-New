window.addEventListener('load', function() {
    checkAuth();
})

function checkAuth() {
    let authToken = sessionStorage.getItem('sessionToken');

    if (authToken) {
        loadPosts(authToken);

    } else {
        redirSignin("Sesion expired");
    }
}

function redirSignin(reason) {
    location.href = `../signin/?refer=posts&error=${reason}`;
    // console.log(reason)
}

function loadPosts(token) {
    var url = `http://${NEOBANCO_ip}/profile?authmethod=token&token=${token}`;
    httpReq('GET', url).then((response) => {
        if (response == "404" || response == "Unauthorized") {
            console.log("error.");
            redirSignin("Session credentials invalid")
        } else {
            console.log(response)
            if (response != "User has no posts.") {
                let posts = JSON.parse(response);
                populatePosts(posts);
            }
        }
    })
}

function populatePosts(posts) {
    for (let i = 0; i < posts.length; i++) {
        let p = posts[i][0];
        console.log(p);
    }
}