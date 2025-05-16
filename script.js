document.addEventListener('DOMContentLoaded', () => {

    const currencySelector = document.getElementById('currencySelector');
    const priceElements = document.querySelectorAll('.price[data-base-price-eur]');
    const apiErrorElement = document.getElementById('api-error-message');

    if (currencySelector && priceElements.length) {
        const API_BASE_URL = 'https://open.er-api.com/v6/latest/EUR';


        let exchangeRates = null;

        function displayApiError(message) {
            if (apiErrorElement) {
                apiErrorElement.textContent = message;
                apiErrorElement.style.display = message ? 'block' : 'none';
            }
            console.error(message);
        }

        async function fetchRates() {
            if (exchangeRates) {
                console.log("Using cached exchange rates.");
                return exchangeRates;
            }

            try {
                displayApiError('');
                const response = await fetch(API_BASE_URL);
                if (!response.ok) {
                    throw new Error(`API Network Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                if (data.result === 'error') {
                    throw new Error(`API Functional Error: ${data['error-type'] || 'Unknown API Error'}`);
                }
                if (!data.rates || !data.rates['EUR']) {
                    throw new Error('API Response missing expected rates data.');
                }

                exchangeRates = data.rates;
                console.log("Exchange rates loaded:", exchangeRates);
                return exchangeRates;
            } catch (error) {
                displayApiError('Fehler beim Laden der Wechselkurse. Preise werden in EUR angezeigt.');
                console.error("Fetching exchange rates failed:", error);
                return null;
            }
        }

        function formatPrice(amount, currencyCode) {
            try {
                return new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: currencyCode,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(amount);
            } catch (e) {
                console.error("Intl.NumberFormat Error:", e);
                const symbols = { EUR: '€', USD: '$', GBP: '£' };
                const symbol = symbols[currencyCode] || currencyCode;
                return `${symbol}${amount.toFixed(2)}`;
            }
        }

        async function updatePrices() {
            const selectedCurrency = currencySelector.value;
            const rates = await fetchRates();

            let rate = 1;
            let effectiveCurrency = 'EUR';

            if (rates && rates[selectedCurrency]) {
                rate = rates[selectedCurrency];
                effectiveCurrency = selectedCurrency;
                displayApiError('');
            } else if (selectedCurrency !== 'EUR' && rates) {
                displayApiError(`Wechselkurs für ${selectedCurrency} nicht verfügbar. Preise in EUR.`);
            } else if (!rates) {

            }

            priceElements.forEach(el => {
                const basePriceEUR = parseFloat(el.getAttribute('data-base-price-eur'));
                if (!isNaN(basePriceEUR)) {
                    const convertedPrice = basePriceEUR * rate;

                    const suffixElement = el.querySelector('span:not(.li-icon)');
                    const suffixHTML = suffixElement ? suffixElement.outerHTML : '';

                    if (basePriceEUR === 0) {
                        el.innerHTML = `${formatPrice(0, effectiveCurrency)} ${suffixHTML}`;
                    } else {
                        el.innerHTML = `${formatPrice(convertedPrice, effectiveCurrency)} ${suffixHTML}`;
                    }
                } else {
                    console.warn("Price element missing data-base-price-eur attribute or it's not a number:", el);
                }
            });
            console.log(`Prices updated to ${effectiveCurrency} (Rate: ${rate})`);
        }

        currencySelector.addEventListener('change', updatePrices);

        fetchRates().then(() => {
            updatePrices();
        });

    } else {
        console.warn("Currency selector or price elements not found. Currency conversion disabled.");
    }

    const createSparkle = (x, y) => {
        const sparkle = document.createElement('span');
        sparkle.classList.add('sparkle');
        document.body.appendChild(sparkle);

        const randomX = Math.random() * 15 - 7.5;
        const randomY = Math.random() * 15 - 7.5;

        sparkle.style.left = `${x + randomX}px`;
        sparkle.style.top = `${y + randomY}px`;


        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
        });

        setTimeout(() => {
            if(sparkle.parentNode) {
                sparkle.remove();
            }
        }, 700);

    };

    document.addEventListener('mousemove', (e) => {
        createSparkle(e.clientX, e.clientY);
    });

});