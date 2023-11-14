window.addEventListener('load', function() {
    fetchTrades();
    attatchCategortListeners();
})

let filters = new Object();

function attatchCategortListeners() {
    let categories = document.querySelectorAll('.category');

    categories.forEach(cat => {
        let options = Array.from(cat.getElementsByTagName('p'));
        console.log(options)
        options.forEach(option => {
            option.addEventListener('click', function() {
                selectCategoryOption(cat, option);
            })
        })

        let clear = cat.querySelector('.clear');
        clear.addEventListener('click', function() {
            clearCategory(cat);
        })
    });
}

function clearCategory(category) {
    let selected = category.querySelectorAll(".active");
    selected.forEach(element => {
        element.classList.remove('active');
    });

    clearFilter(category);
}

function clearFilter(category) {
    let filterName = category.id;
    filters[filterName] = null;
    refreshPosts();
}

function selectCategoryOption(category, option) {
    if (category.classList.contains("check")) {
        if (option.classList.contains("active")) {
            option.classList.remove("active");
        } else {
            option.classList.add("active");
        }
    } else {
        let selected = category.querySelector(".active");
    
        if (selected) {
            selected.classList.remove("active");
        }

        option.classList.add("active");
    }

    console.log(category, option)

    setFilter(category, option);
}

function setFilter(category, option) {
    let filterName = category.id;
    let filterValue = option.getAttribute('value');
    console.log(filterName, filterValue)

    if (filterValue == Number(filterValue)) {
        filterValue = Number(filterValue);
    }

    filters[filterName] = filterValue;

    refreshPosts();
}

function refreshPosts() {
	fetchedTrades = Array();
	fetchTrades(filters);
}

let fetchedTrades = new Array();
function fetchTrades(filters) {
	let queryString = new URLSearchParams();
	if (filters != null && filters != undefined) {
		for (const [key, value] of Object.entries(filters)) {
			if (value == null) {
				continue;
			}
			queryString.append(key, value);
		}
	}

	// console.log(queryString)
    console.log(NEOBANCO_ip);
	var url = `http://${NEOBANCO_ip}/list?${queryString.toString()}`;
	let rowContainer = document.querySelector(".page-content");

	httpReq('GET', url).then(res => {
		var responseJson = JSON.parse(res);
		console.log(responseJson);
	    rowContainer.innerHTML = "";

		for (let i = 0; i < responseJson.length; i++) {
			let element = responseJson[i];
			fetchedTrades.push(element);
			addTrade(element)
		}
	}).catch(error => {
		console.error(error);
		alert('Woops, there was an error making the request.');
	})
}

function addTrade(trade) {
    let rowContainer = document.querySelector(".page-content");
    let rowTemplate = document.getElementById("listing-template");

    const clone = rowTemplate.content.cloneNode(true);
    let title = clone.querySelector("h2");
    let date = clone.querySelector("h4");
    let icon = clone.querySelector("img");
    let content = clone.querySelector("p");
    let dateFormatted = formatDate(trade.datetime);

    title.innerHTML = trade.title;
    date.innerHTML = dateFormatted;
    // icon.innerHTML = "beans";
    content.innerHTML = trade.description;
    
    rowContainer.appendChild(clone);
    
    return clone;
}