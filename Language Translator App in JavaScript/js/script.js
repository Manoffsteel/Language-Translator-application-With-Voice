// Selecting the from text area
const fromText = document.querySelector(".from-text");
// Selecting the to text area
const toText = document.querySelector(".to-text");
// Selecting the exchange icon
const exchangeIcon = document.querySelector(".exchange");
// Selecting all select elements
const selectTag = document.querySelectorAll("select");
// Selecting all icons within rows
const icons = document.querySelectorAll(".row i");
// Selecting the translate button
const translateBtn = document.querySelector("button");

// Populating select dropdowns with language options
selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        // Set selected attribute for default language options
        let selected = id == 0 ? (country_code == "en-GB" ? "selected" : "") : (country_code == "hi-IN" ? "selected" : "");
        // Creating HTML options for select dropdowns
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        // Appending options to select dropdowns
        tag.insertAdjacentHTML("beforeend", option);
    }
});

// Adding click event listener to exchange icon
exchangeIcon.addEventListener("click", () => {
    // Swapping text between (From and To) text areas
    let tempText = fromText.value;
    fromText.value = toText.value;
    toText.value = tempText;
    // Swapping selected languages
    let tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

// Adding keyup event listener to From text area
fromText.addEventListener("keyup", () => {
    // Clearing To text area if From text area is empty
    if (!fromText.value) {
        toText.value = "";
    }
});

// Adding click event listener to translate button
translateBtn.addEventListener("click", () => {
    // Getting input text source language and target language
    let text = fromText.value.trim();
    let translateFrom = selectTag[0].value;
    let translateTo = selectTag[1].value;
    // Returning if input text is empty
    if (!text) return;
    // Setting placeholder while translating
    toText.setAttribute("placeholder", "Translating...");
    // Constructing API URL for translation
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    // Fetching translation from API
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            // Displaying translated text in To text area
            toText.value = data.responseData.translatedText;
            // Setting translated text as placeholder
            data.matches.forEach(data => {
                if (data.id === 0) {
                    toText.value = data.translation;
                }
            });
            // Resetting placeholder
            toText.setAttribute("placeholder", "Translation");
        });
});

// Adding click event listener to icons
icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        // Checking if (From or To) text areas are empty
        if (!fromText.value || !toText.value) return;
        // Handling copy and speak actions based on clicked icon
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                // Copying text from From text area to clipboard
                navigator.clipboard.writeText(fromText.value);
            } else {
                // Copying text from To text area to clipboard
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                // Speaking text from From text area
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                // Speaking text from To text area
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            // Synthesizing and speaking text
            speechSynthesis.speak(utterance);
        }
    });
});
