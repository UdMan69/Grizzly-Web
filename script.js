// Existing JavaScript for currency conversion (keep this)
document.addEventListener('DOMContentLoaded', () => {
    const currencySelector = document.getElementById('currencySelector');
    const priceElements = document.querySelectorAll('.pricing-card .price');

    const exchangeRates = {
        'EUR': 1,
        'USD': 1.08, // Example rate
        'GBP': 0.85  // Example rate
    };

    function updatePrices() {
        const selectedCurrency = currencySelector.value;
        const rate = exchangeRates[selectedCurrency];

        priceElements.forEach(priceElement => {
            const basePriceEUR = parseFloat(priceElement.dataset.basePriceEur);
            let convertedPrice = (basePriceEUR * rate).toFixed(2);
            let symbol = '';

            switch (selectedCurrency) {
                case 'EUR':
                    symbol = '€';
                    break;
                case 'USD':
                    symbol = '$';
                    break;
                case 'GBP':
                    symbol = '£';
                    break;
            }
            priceElement.innerHTML = `${symbol}${convertedPrice} <span>/ ${priceElement.querySelector('span').textContent}</span>`;
        });
    }

    currencySelector.addEventListener('change', updatePrices);
    updatePrices(); // Initial price update

    // Mobile nav toggle (keep this if you have it)
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            const expanded = mobileNavToggle.getAttribute('aria-expanded') === 'true' || false;
            mobileNavToggle.setAttribute('aria-expanded', !expanded);
            mainNav.classList.toggle('nav-open');
        });
    }
});


// New JavaScript for fetching GitHub raw data
document.addEventListener('DOMContentLoaded', () => {
    const githubRawDataElement = document.getElementById('githubRawData');
    const githubLink = 'https://raw.githubusercontent.com/UdMan69/Grizzly-Web/refs/heads/main/status.txtE'; // **Replace with your actual raw GitHub link**

    fetch(githubLink)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('File not found on GitHub. Please check the link.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            // Display the raw data, preserving line breaks
            githubRawDataElement.innerHTML = `<pre>${data}</pre>`;
        })
        .catch(error => {
            console.error('Error fetching GitHub data:', error);
            githubRawDataElement.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });
});