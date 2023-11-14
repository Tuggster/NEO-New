let choices = {};

window.addEventListener('load', function() {
    addFrameListeners();
})

function showModal() {
    document.querySelector(".create-post-modal").classList.remove("hidden");
    document.body.classList.add("noscroll");
}

function hideModal() {
    document.querySelector(".create-post-modal").classList.add("hidden");
    document.body.classList.remove("noscroll");
}

function addFrameListeners() {
    let frames = document.querySelectorAll(".post-modal-list > div.frame");

    frames.forEach(currFrame => {
        let value = currFrame.getAttribute("value");
        let options = currFrame.querySelectorAll("div");
        options.forEach(opt => {

            if (value == 'location') {
                return;
            }

            let thisContent = opt.firstElementChild.innerHTML.toLowerCase();
            let thisVal = opt.firstElementChild.getAttribute("value");
            console.log(opt, thisVal)
            opt.addEventListener("click", function() {

                otherSelected = currFrame.querySelector(".selected");
                console.log(otherSelected)
                if (otherSelected) {
                    otherSelected.classList.remove("selected")
                }

                if (thisVal) {
                    choices[value] = thisVal;
                } else {
                    choices[value] = thisContent;
                }
                nextBtn.style.visibility = "visible";
                nextBtn.style.display = "block";
                opt.classList.add("selected");
            })
        });

        let nextBtn = currFrame.querySelector("button.next");
        console.log(value, nextBtn)
        if (nextBtn) {
            nextBtn.addEventListener("click", function() {
                if (choices[value]) {
                    collapseFrame();
                    revealFrame();
                }

                if (value == "location") {
                    let state = document.getElementById("state-dropdown").value;
                    let location = document.getElementById("region-text").value;;

                    if (state && location) {
                        collapseFrame();
                        revealFrame();    
                    }
                }
            })
        }
    });
}

function collapseFrame() {
    let firstFrame = document.querySelector(".post-modal-list > div:not(.hidden)");
    let header = firstFrame.previousElementSibling;
    if (header.innerHTML.toLowerCase().split(' ')[1] == "location") {
        let location = document.getElementById("region-text").value;
        header.innerHTML += ` - ${location}`;
    } else {
        let choice = firstFrame.querySelector(".selected").firstElementChild.innerHTML;
        header.innerHTML += ` - ${choice}`;
    }
    firstFrame.classList.add("hidden");
    firstFrame.classList.add("completed");
}

function revealFrame() {
    let firstFrame = document.querySelector(".post-modal-list > div:not(.completed)");
    if (firstFrame) {
        firstFrame.classList.remove("hidden");
    }

    if (firstFrame.classList.contains("content")) {
        let username = firstFrame.querySelector(".userid");
        let password = firstFrame.querySelector(".userpw");

        if (choices["privacy"] == 1) {
            username.classList.remove("hidden");
            password.classList.remove("hidden");
        }
    }
}

function sendPost() {
    let privacy = choices.privacy;
    let username = document.querySelector(".userid").value;
    let password = document.querySelector(".userpw").value;

    let title = document.getElementById("title").value;
    let details = document.getElementById("details").value;

    let state = document.getElementById("state-dropdown").value;
    let location = document.getElementById("region-text").value;;


    let postArgs = {
        visibility: choices.privacy,
        direction: choices.direction,
        exchange: choices.exchange,
        category: choices.category,
        title,
        description: details,
        state,
        location
    };

    if (privacy == 1) {
        postArgs.userid = username;
        postArgs.userpw = password;
    }

    var url = `http://${NEOBANCO_ip}/create`;

    console.log(url);
    let request = JSON.stringify(postArgs)
    httpReq('POST', url, request).then(function(res) {
        if (res == "Unauthorized") {
            console.log("Bad login.");
            // let errorEl = document.getElementById("post-failed");
            // errorEl.classList.remove("hidden");
        } else if (res != undefined) {
            console.log("Successful post!");
            hideModal();
            alert("Post submitted successfully!");
        }
    }).catch(err => {
        console.error(err);
    }) 

}