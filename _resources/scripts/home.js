const animListeners = new AbortController();
const { listeners } = animListeners;

function scrollPage(dist) {
    window.scroll(0, dist * window.innerHeight / 100);
}

let wdElements;
window.addEventListener('load', function() {
    wdElements = document.querySelectorAll('.wrap-detect');
    let downArrow = document.querySelector(".downarrow > embed");
    // console.log(downArrow);
    // console.log("cheese");

    checkWrapDetectElements(true);
});

window.addEventListener('resize', function() {
    console.log("check again!")
    checkWrapDetectElements(false);
})

function checkWrapDetectElements(start) {
    console.log(wdElements)
    wdElements.forEach(el => {
        let isBottom = el.classList.contains('bottom');
        let siblings = Array.from(el.parentElement.children);
        let myIndex = siblings.indexOf(el);
        let sibling = siblings[1 - myIndex];


        let elBounds = el.getBoundingClientRect();
        let siblingBounds = sibling.getBoundingClientRect();
        let elPoint = isBottom ? elBounds.bottom : elBounds.top;
        let siblingPoint = isBottom ? siblingBounds.bottom : siblingBounds.top;

        console.log(`This point: ${elPoint}, sibling point: ${siblingPoint}. Bottom? ${isBottom}`)

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


let currentSlide = 0;

function modHeaderTitle(offset) {
    let newSlide = currentSlide + offset;
    setHeaderTitle(newSlide);
}

function setHeaderTitle(index) {
    let headers = document.querySelectorAll(".scrolling");
    let max = headerTitle.childElementCount;
    if (index >= 0 && index < max) {
        setScrollActive(headerTitle, index);
        currentSlide = index;
    } else if (index < 0) {
        setHeaderTitle(max - 1);
    } else {
        setHeaderTitle(0);
    }
}

function modAllScrolls(offset) {
    let scrollers = document.querySelectorAll(".scrolling");
    scrollers.forEach(el => {
        let curSlide = getSlide(el);
        let max = el.childElementCount;
        let newSlide = curSlide + offset;
        if (newSlide >= 0 && newSlide < max) {
            setScrollActive(el, newSlide);
        } else if (newSlide < 0) {
            setScrollActive(el, max - 1);
        } else {
            setScrollActive(el, 0);
        }
    });
}

function modScroll(el, offset) {
    let curSlide = getSlide(el);
    let max = el.childElementCount;
    let newSlide = curSlide + offset;
    if (newSlide >= 0 && newSlide < max) {
        setScrollActive(el, newSlide);
    } else if (newSlide < 0) {
        setScrollActive(el, max - 1);
    } else {
        setScrollActive(el, 0);
    }

}

function setAllScrolls(index) {
    let scrollers = document.querySelectorAll(".scrolling");
    scrollers.forEach(el => {
        setScrollActive(el, index);
    });
}

function registerSlide(el, value) {
    el.style.setProperty('--currentSlide', `${value}px`);
}

function getSlide(el) {
    let off = getComputedStyle(el).getPropertyValue('--currentSlide');
    // console.log(off);
    off = Number(off.split('px')[0]);

    if (!off) {
        registerSlide(el, 0)
        return 0;
    } else {
        return off;
    }

}

// function registerOffset(el, value) {
//     // console.log(value);
//     el.style.setProperty('--currentOff', `${value}px`);
// }

// function getOffset(el) {
//     let off = getComputedStyle(el).getPropertyValue('--currentOff');
//     // console.log(off);
//     off = Number(off.split('px')[0]);

//     if (!off) {
//         registerOffset(el, 0)
//         return 0;
//     } else {
//         return off;
//     }
// }


function animEnd(el, newWidth, scroll, newActive) {
    scroll.style.width = newWidth;
    console.log(`Assigned width: ${scroll.style.width}`);
}

function setScrollActive(scroll, index) {
    let children = Array.from(scroll.children);

    if (index == -1) {
        children.forEach(element => {
            element.style.transform = `translateX(-1000px)`;
        });
        return;
    }


    let newActive = children[index];
    let oldActive = children[getSlide(scroll)];
    let xLeft = newActive.getBoundingClientRect().left;
    let parentLeft = scroll.getBoundingClientRect().left + scroll.style.paddingLeft;
    let parentPadding = getComputedStyle(scroll).getPropertyValue('padding-left');

    let xDiff = children[0].getBoundingClientRect().left - (xLeft - parentPadding.split("px")[0]);

    if (oldActive) {
        newActive.classList.add("current-slide");
        oldActive.classList.remove("current-slide");
    }

    
    let offset = `translateX(${xDiff}px)`;
    children.forEach(element => {
        element.style.transform = offset;
    });

    let newWidth = 0;
    let newWidthPX = 0;
    let oldWidth = Number(scroll.style.width.split("px")[0]);
    if (scroll.classList.contains("fullwidth")) {
        newWidth = `calc(${scroll.getBoundingClientRect().width}px - 1em)`;
        newWidthPX = scroll.getBoundingClientRect().width;
        scroll.style.height = `${newActive.getBoundingClientRect().height}px`;

    } else {
        newWidth = `${newActive.getBoundingClientRect().width}px`;
        newWidthPX = newActive.getBoundingClientRect().width;
        newActive.style.width = `fit-content`;
    }

    let duration = 1000 * Number(window.getComputedStyle(newActive).transitionDuration.split("s")[0]);
    console.log(newWidthPX, oldWidth);
    if (newWidthPX < oldWidth) {
        setTimeout(function() {
            console.log(`New width: ${newWidth}`)
            scroll.style.width = newWidth;
        }, duration);
    } else {
        scroll.style.width = newWidth;
    }

    registerSlide(scroll, index);

    // console.log(parentPadding.split("px")[0]);
}


// Post Previews

function pullFirst5FromRegion(state) {
    var url = `http://${NEOBANCO_ip}:${NEOBANCO_port}/list/preview`;

    if (state) {
        url += `?state=${state}`;
    }

	httpReq('GET', url).then(res => {
		var responseJson = JSON.parse(res);
		console.log(responseJson);
        // clearPosts();
		for (let i = 0; i < 5; i++) {
            let element = {
                title: "filler",
                category: "filler",
                state: "filler",
                location: "filler",
                render: false
            };
            if (i < responseJson.length) {
                element = responseJson[i];
            }
			addPreviewPost(element, i);
		}

	    let container = document.getElementsByClassName("preview-post-container")[0];
        let template = container.firstElementChild;
        let itemHeight = template.getBoundingClientRect().height;
        console.log(itemHeight);
        container.style.maxHeight = `calc(${itemHeight}px * ${responseJson.length})`;

	}).catch(error => {
		console.error(error);
		alert('Woops, there was an error making the request.');
	})
}

function initPosts() {
    let container = document.querySelector(".preview-post-container");
    let template = document.querySelector(`template[id="preview-post-template"]`);

    for (let i = 0; i < 5; i++) {
        let clone = template.content.cloneNode(true);
        container.appendChild(clone);
        console.log(clone);
    }
}

function addPreviewPost(post, i) {
    let container = document.querySelector(".preview-post-container");
    let template = document.querySelector(`template[id="preview-post-template"]`);
    
    let clone = container.children[0];    
    if (post.render != false) {
        clone.classList.remove("hidden");
        let titleText = clone.querySelector("*[id='title']");
        let categoryText = clone.querySelector("*[id='category']");
        let locationText = clone.querySelector("*[id='location']");

        titleText.innerHTML = post.title;
        categoryText.innerHTML = post.category;
        locationText.innerHTML = `${post.location}, ${post.state}`;
    } else {
        console.log(clone);
        clone.classList.add("hidden");
    }

    container.appendChild(clone);
}

function setState(id, name) {
    let active = document.querySelectorAll("div.active.preview-state");
    let listParent = document.querySelector("div[id='state-container']");

    active.forEach(element => {
        console.log(element);
        element.classList.remove("active");
    });

    listParent.children[id].classList.add('active');
    pullFirst5FromRegion(name);
}

function clearPosts() {
    let container = document.querySelector(".preview-post-container");
    container.innerHTML = '';
}

function populateStates() {

	let container = document.getElementById("state-container");
	let stateTemplate = document.getElementById("state-template");
    let ip = `http://${NEOBANCO_ip}:${NEOBANCO_port}/list/regions`;
	httpReq("GET", ip).then(res => {
		res = JSON.parse(res);
		for (let i = 0; i < res.length; i++) {
			var clone = document.importNode(stateTemplate.content, true);

            
			let name = clone.getElementById("name");
            name.innerHTML = `&bull; ${res[i]}`;
            name.addEventListener('click', function() {
                setState(i, res[i]);
            })
            
			container.appendChild(clone);
		}
        // setState(0, res[0]);
	});
}

function modalVisibility(show) {
    let postModalElement = document.getElementById("modals");
    console.log(postModalElement);
    if (!show) {
        postModalElement.style.display = "none";
        postModalElement.style.visibility = "hidden";
        document.body.style.overflow = 'initial';
    } else {
        postModalElement.style.display = "block";
        postModalElement.style.visibility = "visible";
        document.body.style.overflow = 'hidden';
    }
    return postModalElement;
}