function clamp(num, min, max) { 
    return Math.max(min, Math.min(max, num));
 }

 function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
}

function httpReq(method, url, extras) {
    const makeRequest = new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        xhr.onload = function() {
            resolve(xhr.responseText);
        }

        xhr.onerror = function() {
            reject(xhr.responseText);
        }
        xhr.send();
    });

    return makeRequest;
}

let parallaxElements;
document.addEventListener('scroll', function() {
    setTimeout(updateParallax, 4);
});

function computeFriendStyle(late) {
    let buddies = document.querySelectorAll(".friends");
    console.log("Refreshing friends.")
    let friends = new Array();

    const ro = new ResizeObserver(friends => {
        console.log("test");
        computeFriendStyle(true);
    });

    buddies.forEach(element => {
        let friendid = window.getComputedStyle(element).getPropertyValue("--friend-id");
        let friend = document.getElementById(friendid);

        if (friend) {
            if ((late && element.classList.contains("live")) || !late) {
                element.style.setProperty("--friend-height", window.getComputedStyle(friend).height);
            }

            if (!late) {
                ro.observe(friend);
            }
        }
    });


}

window.onload = function() {
    // console.log("hi")
    parallaxElements = document.querySelectorAll(".parallax");;
    updateParallax();
    computeFriendStyle(false);
    attatchAutoscrolls();
}

function attatchAutoscrolls() {
    let autos = document.getElementsByClassName("auto-scroll");
    autos = Array.from(autos);
    console.log(autos); 

    autos.forEach(element => {
        setInterval(function() {
            modScroll(element, 1);
        }, 7500);
    });
}

window.onresize = function() {
    computeFriendStyle(true);
    updateParallax();
}

function updateParallax() {

    if (!parallaxElements) {
        return;
    }

    parallaxElements.forEach(element => {
        let pOffset = getComputedStyle(element).getPropertyValue('--parallax-offset');
        let pSpeed = getComputedStyle(element).getPropertyValue('--parallax-speed');
        
        let aspect = element.width / element.naturalWidth;
        pOffset = Number(pOffset.split('px')[0]) / aspect;
        pSpeed *= aspect;
    
        let elementBounds = element.getBoundingClientRect();
        let frameHeight = elementBounds.bottom - elementBounds.top;
        let scrollPos = (pOffset + scrollY) * Number(pSpeed);
        let adjustedHeight = element.naturalHeight * aspect;
        let maxScroll = (adjustedHeight - frameHeight);

        // console.log(`Max scroll: ${maxScroll}`);
        // console.log(`Current scroll: ${scrollPos}`);
        // console.log(`Frame height: ${frameHeight}`);
        // console.log(`Image height: ${adjustedHeight}`);
        // console.log(-scrollPos);
        // console.log(elementBounds.top + elementBounds.bottom);
        
        scrollPos = clamp(scrollPos, 0, maxScroll);
        element.style.objectPosition = `0px ${-scrollPos}px`
    });
}