// GNews API Integration
const apiKeys = [
    '6db28cbad383869dd0d986c1ab891236',
    '6faefcd2530c99721f4b17eaf22b2187',
    '6e96c992789b60999b047572d305298f',
    'cc24b0768fef6b0002fc975f726d96fb'
];

let currentApiKeyIndex = 0;
const gnewsContainer = document.getElementById('gnews-container');

async function fetchGNewsArticles() {
    if (currentApiKeyIndex >= apiKeys.length) {
        gnewsContainer.innerHTML = `<p>Failed to load articles. Please try again later.</p>`;
        return;
    }

    try {
        const apiKey = apiKeys[currentApiKeyIndex];
        const response = await fetch(
            `https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=8&token=${apiKey}`
        );

        if (response.status === 429) {
            console.warn(`Rate limit reached for API key: ${apiKey}. Switching keys...`);
            currentApiKeyIndex++;
            fetchGNewsArticles();
            return;
        }

        if (!response.ok) {
            throw new Error(`Error fetching GNews articles: ${response.status}`);
        }

        const data = await response.json();
        displayArticles(data.articles);
    } catch (error) {
        console.error(`Error with API key ${apiKeys[currentApiKeyIndex]}:`, error);
        currentApiKeyIndex++;
        fetchGNewsArticles();
    }
}

function displayArticles(articles) {
    if (!articles || articles.length === 0) {
        gnewsContainer.innerHTML = `<p>No articles available.</p>`;
        return;
    }

    // Generate cards for each article
    const articleCards = articles.map(article => `
        <div class="card">
            <div class="card-content-img">
                <img src="${article.image || 'https://via.placeholder.com/300x200'}" alt="Article Image">
            </div>
            <div class="card-content-h3"><h3>${article.title}</h3></div>
            <div class="card-content-p"><p>${article.description || 'No description available.'}</p></div>
            <div class="card-content-a">
                <a href="${article.url}" target="_blank" class="read-more">
                    <button class="custom-button interactiveButton">Read More</button>
                </a>
            </div>
        </div>
    `);

    // Insert articles into the container
    gnewsContainer.innerHTML = articleCards.join('');
}

// Fetch articles on page load
document.addEventListener('DOMContentLoaded', fetchGNewsArticles);
