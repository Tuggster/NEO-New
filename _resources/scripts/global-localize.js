function langIndex(list) {
    this.list = list;
}

langIndex.prototype.getLocale = function(locale) {
    let result;

    this.list.forEach(element => {
        if (element.locale == locale) {
            result = element;
        }
    });

    return result;
}

function languageTable(elements) {
    this.elements = elements;
}

let languageIndex;
let languageFile;


let language = localStorage.getItem("language") || navigator.language;
let languageData;
window.addEventListener('load', function() {
    console.log("Loaded language script.");
    console.log(`Local language: ${language}`);

    var userPickedLang = !(this.localStorage.getItem("language") == "undefined" || !this.localStorage.getItem("language"));

    if (!userPickedLang) {
        console.log("No language prefrence chosen yet.")
        language = navigator.language;
    }

    fetch('/_resources/locale.json')
    .then((response) => response.json())
    .then((json) => {
        languageIndex = new langIndex(json);
        languageData = languageIndex.getLocale(language);

        if (!userPickedLang) {
            showPickerDropdown(languageData.friendlyname);
        }
        
        if (languageData) {
            console.warn(`Loaded language profile: ${languageData.friendlyname}`);
            loadLanguageFile(languageData.filename)
        } else {
            console.error('No language profile avaliable for this locale. No localization will be applied.')
            showPage();
        }
    });

})

function revealLanguagePicker() {
    let pickerElement = document.getElementsByClassName("languagepicker")[0];

    if (pickerElement) {
        pickerElement.remove();
    }

    showPickerDropdown(languageData.friendlyname);
}

function showPickerDropdown(friendlyname) {
    let pickerElement = document.createElement("p");
    pickerElement.classList.add("languagepicker");
    pickerElement.innerHTML = `Current Language: ${friendlyname}<br>Click to Change`;
    document.body.appendChild(pickerElement);

    pickerElement.onclick = function() {
        pickerElement.onclick = {};
        pickerElement.classList.add("override");

        pickerElement.innerHTML = "";

        let selectEl = document.createElement("select");
        let confirmBtn = document.createElement("button");
        confirmBtn.innerHTML = "Confirm";

        confirmBtn.onclick = function() {
            language = selectEl.value;
            pickerElement.classList.remove("override");

            languageData = languageIndex.getLocale(language);
            loadLanguageFile(languageData.filename);
            localStorage.setItem("language", languageData.locale);
        }

        pickerElement.appendChild(selectEl);
        pickerElement.appendChild(confirmBtn);

        languageIndex.list.forEach(thisLang => {
            let pickerOption = document.createElement("option");
            pickerOption.innerHTML = thisLang.friendlyname;
            pickerOption.value = thisLang.locale;

            selectEl.options.add(pickerOption);
        })
    }

    setTimeout(function() {
        pickerElement.classList.add("hidden");
        localStorage.setItem("language", languageData.locale);
    }, 6000)
}

function hidePage() {
    document.body.style.visibility = 'hidden';
}

function showPage() {
    document.body.style.visibility = 'visible';
}

function loadLanguageFile(filename) {
    fetch(`./lang/${filename}`)
    .then((response) => response.json())
    .then((json) => {
        languageFile = new languageTable(json);

        languageFile.elements.forEach(element => {
            fillElement(element);
        });
    
        showPage();
        console.warn(`Page successfully localized for ${languageData.friendlyname}`);

    }).catch(e => {
        console.error(`JSON formatting error with ${filename} localization file.`);
        console.warn(`No language change applied.`);
        showPage();
    });

}

function fillElement(element) {
    let targetElement = document.getElementById(element.elementname);

    if (targetElement) {
        targetElement.innerHTML = element.content;
    } else {
        console.warn(`Localization failed to find element: ${element.elementname}`)
    }
}