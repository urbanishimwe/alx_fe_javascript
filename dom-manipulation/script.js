var quotes = [];
var quotesLoaded = false;
var quotesIndex = 0;

var personalQuotes = [];
var personalQuotesIndex = 0;

var displayedQuotes = [];

async function showRandomQuote() {
    if (quotesLoaded) {
        quotesIndex = (quotesIndex + 1) % quotes.length;
        return quotes[quotesIndex];
    }
    try {
        const resp = await fetch("https://raw.githubusercontent.com/well300/quotes-api/refs/heads/main/quotes.json", { mode: 'cors' });
        (await resp.json()).forEach(element => {
            quotes.push({ q: element.quote, c: element.author });
        });
        quotesLoaded = true;
        quotesIndex = 0;
    } catch (e) {
        quotes.push({ q: e.toString(), c: 'error' });
    }
}

function newQuote() {
    const quote = nextQuote();
    if (!quote) {
        alert('Try to add your own quote');
        return;
    }
    const quoteDisplay = document.getElementById('quoteDisplay');
    const quoteHolder = document.createElement('blockquote');
    const quoteText = document.createElement('p');
    quoteText.textContent = quote.q;
    const quoteCategory = document.createElement('span');
    quoteCategory.textContent = quote.c;
    quoteHolder.appendChild(quoteText);
    quoteHolder.appendChild(document.createElement('br'));
    quoteHolder.appendChild(quoteCategory);
    quoteDisplay.prepend(quoteHolder);
    displayedQuotes.push(quote);
}

function createAddQuoteForm() {
    const quote = {
        q: document.getElementById('newQuoteText').value,
        c: document.getElementById('newQuoteCategory').value
    };
    personalQuotes.push(quote);
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    newQuote();
}

document.addEventListener('DOMContentLoaded', async() => {
    personalQuotes = JSON.parse(window.localStorage.getItem('quotes') || '[]');
    await showRandomQuote();
});

document.getElementById('newQuote').addEventListener('click', newQuote);

document.getElementById('addQuoteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    createAddQuoteForm();
});

function nextQuote() {
    if (personalQuotesIndex < personalQuotes.length) {
        const quote = personalQuotes[personalQuotesIndex];
        personalQuotesIndex++;
        return quote;
    }

    if (quotesLoaded && quotesIndex < quotes.length) {
        const quote = quotes[quotesIndex];
        quotesIndex++;
        return quote;
    }
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        var importedQuotes;
        try {
            importedQuotes = JSON.parse(event.target.result);
            if(!validateQuotes(importedQuotes)) {
                throw new Error();
            }
            personalQuotes.push(...importedQuotes);
        } catch(e) {
            alert('failed to parse quotes file');
            return;
        }
        saveQuotes();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function saveQuotes() {
    window.localStorage.setItem('quotes', JSON.stringify(personalQuotes));
}

function validateQuotes(userQuotes) {
    if(typeof userQuotes !== 'array') {
        return false;
    }
    return userQuotes.find(e => !(e.q && e.c));
}

window.sessionStorage.setItem('quotes', 'demonstrating session knowledge');

// var forAlex = [{
//     'category': 'Quote',
//     'text': 'text'
// }];

// function displayRandomQuote() {
//     const random = document.getElementById('random');
//     const quote = forAlex[Math.random()];
//     random.innerHTML = "quotes HTMl";
// }