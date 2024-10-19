var quotes = [];
var quotesLoaded = false;
var quotesIndex = 0;

var personalQuotes = [];
var personalQuotesIndex = 0;

var displayedQuotes = [];

var quotesCategory;

var categories = ['all'];

const mockQuotesCategory = 'Life quotes';

async function fetchQuotesFromServer() {
    if (quotesLoaded) {
        quotesIndex = (quotesIndex + 1) % quotes.length;
        return quotes[quotesIndex];
    }
    try {
        // const notUsingThis = 'https://jsonplaceholder.typicode.com/posts'
        // fetch(notUsingThis, {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        const resp = await fetch("https://raw.githubusercontent.com/well300/quotes-api/refs/heads/main/quotes.json", { mode: 'cors' });
        (await resp.json()).forEach(element => {
            quotes.push({ q: element.quote, c: mockQuotesCategory, a: element.author });
        });
        quotesLoaded = true;
        quotesIndex = 0;
    } catch (e) {
        console.log(e);
    }
}


function newQuote() {
    const quote = nextQuote();
    if (!quote) {
        alert('Try to add your own quote');
        return;
    }
    displayedQuotes.push(quote);
    quoteDisplay.prepend(createQuote(quote));
    populateCategories();
    document.getElementById('categoryFilter').value = 'all';
    filterQuotes();
}

function createAddQuoteForm() {
    const quote = {
        q: document.getElementById('newQuoteText').value,
        c: document.getElementById('newQuoteCategory').value,
        a: 'You',
    };
    personalQuotes.push(quote);
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    newQuote();
}

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
            if (!quotesValid(importedQuotes)) {
                throw new Error();
            }
            personalQuotes.push(...importedQuotes);
        } catch (e) {
            alert('failed to parse quotes file');
            return;
        }
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

function saveQuotes() {
    window.localStorage.setItem('quotes', JSON.stringify(personalQuotes));
}

function quotesValid(userQuotes) {
    if (!Array.isArray(userQuotes)) {
        return false;
    }

    return userQuotes.every(e => e.q && e.c && e.a);
}

function exportToJsonFile() {
    if (displayedQuotes.length < 1) {
        alert('no quotes available');
        return;
    }
    const blobText = JSON.stringify(displayedQuotes);
    const blobQuotes = new Blob([blobText], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blobQuotes);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

function populateCategories() {
    const selectOp = document.getElementById('categoryFilter');

    const newCategories = [...personalQuotes.map(e => e.c), mockQuotesCategory];
    newCategories.forEach(c => {
        if (categories.indexOf(c.toLowerCase()) < 0) {
            categories.push(c);
            selectOp.appendChild(createOption(c, c));
        }
    });

    if(categories.indexOf(quotesCategory) > 0) {
        selectOp.value = quotesCategory;
    } else {
        saveSelectedCategory('all');
    }
}

function createOption(value, text) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = text;
    return opt;
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    saveSelectedCategory(selectedCategory);

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    displayedQuotes.forEach(quote => {
        if (quotesCategory !== 'all' && quote.c !== quotesCategory) {
            return
        }

        quoteDisplay.prepend(createQuote(quote));
    });
}

function saveSelectedCategory(c) {
    window.localStorage.setItem('quotesCategory', c);
    quotesCategory = c;
}

function createQuote(quote) {
    const quoteHolder = document.createElement('blockquote');
    const quoteText = document.createElement('p');
    quoteText.textContent = quote.q;
    const quoteCategory = document.createElement('span');
    quoteCategory.textContent = `${quote.c} by ${quote.a}`;
    quoteHolder.appendChild(quoteText);
    quoteHolder.appendChild(document.createElement('br'));
    quoteHolder.appendChild(quoteCategory);
    return quoteHolder;
}

document.addEventListener('DOMContentLoaded', async () => {
    const localQuotes = JSON.parse(window.localStorage.getItem('quotes') || '[]');
    if (quotesValid(localQuotes)) {
        personalQuotes = localQuotes;
        displayedQuotes.push(...personalQuotes);
    }

    if(window.localStorage.getItem('quotesCategory')) {
        quotesCategory = window.localStorage.getItem('quotesCategory');
    } else {
        quotesCategory = 'all';
    }

    await fetchQuotesFromServer();
    populateCategories();
    filterQuotes();
});

document.getElementById('newQuote').addEventListener('click', newQuote);

document.getElementById('addQuoteForm').addEventListener('submit', (event) => {
    event.preventDefault();
    createAddQuoteForm();
});

document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);

// window.sessionStorage.setItem('quotes', 'demonstrating session knowledge');

// var forAlex = [{
//     'category': 'Quote',
//     'text': 'text'
// }];

// function displayRandomQuote() {
//     const random = document.getElementById('random');
//     const quote = forAlex[Math.random()];
//     random.innerHTML = "quotes HTMl";
// }