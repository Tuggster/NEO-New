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
fetch('./_resources/locale.json')
    .then((response) => response.json())
    .then((json) => {
        languageIndex = new langIndex(json);
    });

const language = navigator.language;
let languageData;
window.addEventListener('load', function() {
    console.log("Loaded language script.");
    console.log(`Local language: ${language}`);

    languageData = languageIndex.getLocale(language);

    if (languageData) {
        console.warn(`Loaded language profile: ${languageData.friendlyname}`);
        loadLanguageFile(languageData.filename)
    } else {
        console.error('No language profile avaliable for this locale. No localization will be applied.')
        showPage();
    }
})

function hidePage() {
    document.body.style.visibility = 'hidden';
}

function showPage() {
    document.body.style.visibility = 'visible';
}

function loadLanguageFile(filename) {
    fetch(`/lang/${filename}`)
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