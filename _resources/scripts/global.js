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
    console.log(method, extras);
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
        if (method == 'POST') {
            xhr.setRequestHeader('Content-type', 'application/json');
            console.log(extras);
            xhr.send(extras);
        } else {
            xhr.send();
        }
    });

    return makeRequest;
}

let parallaxElements;
let fadeElements;
document.addEventListener('scroll', function() {
    setTimeout(updateParallax, 4);
    setTimeout(checkScrolls, 4);
});

function computeFriendStyle(late) {
    let buddies = document.querySelectorAll(".friends");
    // console.log("Refreshing friends.")
    let friends = new Array();

    const ro = new ResizeObserver(friends => {
        // console.log("test");
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

let fontSize = 0;

let wdElements;
window.onload = function() {
    // console.log("hi")
    parallaxElements = document.querySelectorAll(".parallax");
    fadeElements = document.querySelectorAll(".scrollpast");;
    fontSize = parseFloat(getComputedStyle(document.getElementsByTagName('p')[0]).fontSize.split('px')[0]);

    fadeElements.forEach(element => {
        let target = getComputedStyle(element).getPropertyValue('--fade-element');
        document.getElementById(target).classList.add('fade');
    });

    // console.log(parallaxElements)
    updateParallax();
    computeFriendStyle(false);
    attatchAutoscrolls();


    const observer = new IntersectionObserver(startAnimation);
    const options = { root: null, rootMargin: '0px', threshold: 1 }; 

    const elements = document.querySelectorAll('.slide');
    console.log(elements);
    elements.forEach(el => {
        observer.observe(el, options);
    });

    wdElements = document.querySelectorAll('.wrap-detect');
    checkWrapDetectElements(true);

}

window.addEventListener('resize', function() {
    // console.log("check again!")
    checkWrapDetectElements(false);
})

function checkWrapDetectElements(start) {
    // console.log(wdElements)
    wdElements.forEach(el => {
        let isBottom = el.classList.contains('bottom');
        let siblings = Array.from(el.parentElement.children);
        let myIndex = siblings.indexOf(el);
        let sibling = siblings[1 - myIndex];


        let elBounds = el.getBoundingClientRect();
        let siblingBounds = sibling.getBoundingClientRect();
        let elPoint = isBottom ? elBounds.bottom : elBounds.top;
        let siblingPoint = isBottom ? siblingBounds.bottom : siblingBounds.top;

        // console.log(`This point: ${elPoint}, sibling point: ${siblingPoint}. Bottom? ${isBottom}`)

        if (elPoint != siblingPoint && !el.classList.contains('wrapped')) {
            el.classList.add('wrapped');
            if (start == false) {
                el.style.setProperty("--wrap-point", innerWidth);
            }
        }

        let wrapPoint = getComputedStyle(el).getPropertyValue("--wrap-point");
        if (wrapPoint != '') {
            if (innerWidth > wrapPoint && el.classList.contains('wrapped')) {
                el.classList.remove('wrapped');
            }
        }
    });
}

function attatchAutoscrolls() {
    let autos = document.getElementsByClassName("auto-scroll");
    autos = Array.from(autos);
    // console.log(autos); 

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

function checkScrolls() {
    fadeElements.forEach(el => {
        let bottomBound = el.getBoundingClientRect().bottom;
        let scrollPosition = scrollY;
        let targetID = getComputedStyle(el).getPropertyValue('--fade-element');
        let targetColor = getComputedStyle(el).getPropertyValue('--fade-color');
        let target = document.getElementById(targetID);
        target.style.setProperty('--fade-color', `var(--color-${targetColor})`);
        
        let isFaded = target.classList.contains("faded");

        if (bottomBound <= 0 && !isFaded) {
            target.classList.add('faded');
        } else if (bottomBound > 0 && isFaded) {
            target.classList.remove('faded');
        }
     })
}

const startAnimation = (entries, observer) => {
    entries.forEach(entry => {
        entry.target.classList.toggle("slide-in", entry.isIntersecting);
        let count = Number(getComputedStyle(entry.target).getPropertyValue('--observe-count')) || 1;
        entry.target.style.setProperty('--observe-count', count + 1);
        // console.log(`New count: ${count}`)

        if (count >= 2)
            observer.unobserve(entry.target);
    });
};
  

function updateParallax() {

    if (!parallaxElements) {
        return;
    }

    parallaxElements.forEach(element => {
        let pOffset = getComputedStyle(element).getPropertyValue('--parallax-offset') || '0px';
        let pSpeed = getComputedStyle(element).getPropertyValue('--parallax-speed') || 1;
        
        let aspect = element.width / element.naturalWidth;
        pOffset = Number(pOffset.split('px')[0]) / aspect;
        pSpeed *= aspect;
        
        let elementBounds = element.getBoundingClientRect();
        let frameHeight = getComputedStyle(element).getPropertyValue('--block-height').split('vh')[0] * innerHeight / 100;
        let scrollPos = (pOffset + scrollY) * Number(pSpeed);
        let adjustedHeight = element.naturalHeight * aspect;
        let maxScroll = (adjustedHeight - frameHeight);

        // console.log(`Max scroll: ${maxScroll}`);
        // console.log(`frameheight: ${frameHeight}`);
        // console.log(`Current scroll: ${scrollPos}`);
        // console.log(`Frame height: ${frameHeight}`);
        // console.log(`Image height: ${adjustedHeight}`);
        // console.log(-scrollPos);
        // console.log(elementBounds.top + elementBounds.bottom);
        
        scrollPos = clamp(scrollPos, 0, maxScroll);
        element.style.objectPosition = `0px ${-scrollPos}px`;
    });
}