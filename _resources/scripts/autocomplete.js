function attachAutocompleteListeners() {
    let regionText = document.getElementById("region-text");
    regionText.addEventListener('keyup', autocompleteListener, false);
    regionText.addEventListener('keydown', autocompleteBlocker, false);
    regionText.addEventListener('focusout', function() {
        hideAutocomplete();
    });

    regionText.addEventListener('focusin', function() {
        updateRegionAutocomplete();
    });

    let form = document.querySelector("form");
    form.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
        }
    });
}

window.addEventListener('load', function() {
    attachAutocompleteListeners();
    populateStates();
})

var autocompleteBlocker = function(e) {
    keyCode = e.keyCode;
    if(keyCode=='38' || keyCode=='40'){ //arrow key
        e.preventDefault();
        return false;
    }
}

var autocompleteListener = function (e) {
    // console.log(e.keyCode);

    const keyCode = e.keyCode || e.which;
    const isPrintable = e.key.length === 1;
    const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;


    if(keyCode=='38' || keyCode=='40'){ //arrow key
        scrollAutocomplete(keyCode == 40 ? 1 : -1);
    } else if (keyCode == '13') {
        pickAutocomplete();
    } else if ((isPrintable && !isModifierKey) || keyCode == '8') {
        updateRegionAutocomplete();
    }
}

function scrollAutocomplete(direction) {
    let autocompleteList = document.querySelector(".autocomplete-frame");
    let autocompleteActive = document.querySelector(".autocomplete.selected");

    if (autocompleteList.hasChildNodes()) {
        if (autocompleteActive) {
            let childIndex = Array.from(autocompleteList.children).indexOf(autocompleteActive);
            let newIndex = childIndex + direction;

            if (newIndex >= 0 && newIndex < autocompleteList.children.length) {
                autocompleteActive.classList.remove("selected");
                autocompleteList.children[newIndex].classList.add("selected");
            }
        } else {
            autocompleteList.children[0].classList.add("selected");
        }
    }
}

function hideAutocomplete() {
    let autocompleteList = document.querySelector(".autocomplete-frame")
    autocompleteList.innerHTML = '';
    autocompleteList.style.display = 'none';
}

function pickAutocomplete(text) {
    let autocompleteActive = document.querySelector(".autocomplete.selected");
    let autocompleteList = document.querySelector(".autocomplete-frame");
    let region = document.getElementById("region-text");

    if (text) {
        hideAutocomplete();
        region.value = text.trim();

        if (refreshPosts) {
            refreshPosts();
        }

        return;
    }

    if (autocompleteActive) {
        autocompleteActive.classList.remove("selected");
        region.value = autocompleteActive.querySelector("#autocomplete-value").innerHTML.trim();
    }
    hideAutocomplete();

    if (refreshPosts) {
        refreshPosts();
    }
}

function updateRegionAutocomplete() {
    let autocompleteActive = document.querySelector(".autocomplete.selected");
    let autocompleteList = document.querySelector(".autocomplete-frame")
    const autocompleteTemplate = document.getElementById("autocomplete-template");
    let values = pullRegionAutocomplete().then((results) => {
        autocompleteList.innerHTML = '';
    
        if (autocompleteActive) {
            autocompleteActive.classList.remove("selected");
        }
    
        // console.log(results);
        if (results != null && results.length != 0) {
            autocompleteList.style.display = 'block';

            let max = 0;

            results.forEach(e => {
                if (Number(e.use_count) > max) max = Number(e.use_count);
            });

            for (let i = 0; i < results.length; i++) {
                let newChild = document.importNode(autocompleteTemplate.content, true);
                newChild.querySelector("#autocomplete-value").innerHTML = results[i].sublocation_name;
                newChild.querySelector(".autocomplete-usage").innerHTML = `${results[i].use_count} posts`;
                let width = `${results[i].use_count / max * 100}%`;
                newChild.querySelector(".autocomplete-relevence").style.width = width;
                autocompleteList.appendChild(newChild);
                autocompleteList.children[i].addEventListener("mousedown", function(event) {
                    pickAutocomplete(results[i].sublocation_name);
                    event.preventDefault();
                    return false;
                })
            }
        } else {
            hideAutocomplete();
        }
    });
}

function pullRegionAutocomplete() {
    let state = document.getElementById("state-dropdown").value;
    let fragment = document.getElementById("region-text").value;

    const promise = new Promise((resolve, reject) => {
        httpReq("GET", `http://${NEOBANCO_ip}/list/regions?state=${state}&fragment=${fragment}`).then(res => {
            let regions = JSON.parse(res);
            console.log(regions)
            resolve(regions);
        }).catch(err => {
            console.error(err);
            reject(err);
        })
    });

    return promise;
}

function populateStates() {
	let dropdown = document.getElementById("state-dropdown");
	let optionTemplate = document.getElementById("option-template");
	httpReq("GET", `http://${NEOBANCO_ip}/list/regions`).then(res => {
		res = JSON.parse(res);
		for (let i = 0; i < res.length; i++) {
			var clone = document.importNode(optionTemplate.content, true);
			option = clone.querySelector("option");
			option.value = res[i];
			option.innerHTML = res[i];
			dropdown.appendChild(clone);
		}
	});
}
