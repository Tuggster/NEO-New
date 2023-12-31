let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

let NEOBANCO_ip;
let NEOBANCO_port;

getServerDetails();
function getServerDetails() {
    fetch(`/_resources/scripts/connections.json`)
    .then((response) => response.json())
    .then((json) => {
        console.log(json.ip, json.port)
        NEOBANCO_ip = json.ip;
        NEOBANCO_port = json.port;

    }).catch(e => {
        console.error(`JSON formatting error with ${filename} localization file.`);
        console.warn(`No language change applied.`);
        showPage();
    });
}

function forceLeadingZeros(digits) {
	if (digits <= 9) {
		return "0" + String(digits);
	}
	return digits;
}

function formatDate(date) {
	date = new Date(date);
	let day = date.getDay();
	let dayOM = date.getDate();
	let daySuffix = "";
	let dateFormatted = "";
	if ((dayOM > 10 && dayOM <= 20) || (dayOM % 10 >= 4 || dayOM % 10 == 0)) {
		daySuffix = "th";
	} else if (dayOM % 10 == 1) {
		daySuffix = "st";
	} else if (dayOM % 10 == 2) {
		daySuffix = "nd";
	} else if (dayOM % 10 == 3) {
		daySuffix == "rd";
	}
	dateFormatted += `${days[day]}, ${months[date.getMonth()]} ${date.getDate()}${daySuffix}, ${date.getFullYear()}<br> at ${forceLeadingZeros(date.getHours())}:${forceLeadingZeros(date.getMinutes())}`;
	return dateFormatted;
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

