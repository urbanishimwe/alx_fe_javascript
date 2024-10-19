var quotes = [];
var quotesLoaded = false;
var quotesIndex = 0;

var presonalQuotes = [];
var presonalQuotesIndex = 0;

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

async function newQuote() {
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

document.addEventListener('DOMContentLoaded', showRandomQuote);

document.getElementById('newQuote').addEventListener('click', newQuote);

document.getElementById('addQuoteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const quote = {
        q: document.getElementById('newQuoteText').value,
        c: document.getElementById('newQuoteCategory').value
    };
    presonalQuotes.push(quote);
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    await newQuote();
});

function nextQuote() {
    if (presonalQuotesIndex < presonalQuotes.length) {
        const quote = presonalQuotes[presonalQuotesIndex];
        presonalQuotesIndex++;
        return quote;
    }

    if (quotesLoaded && quotesIndex < quotes.length) {
        const quote = quotes[quotesIndex];
        quotesIndex++;
        return quote;
    }
}