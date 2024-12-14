// GNews API Integration
const apiKey = '6db28cbad383869dd0d986c1ab891236'; // Replace with your GNews API key
const gnewsContainer = document.getElementById('gnews-container');

async function fetchGNewsArticles() {
    try {
        // Fetch top headlines from GNews API
        const response = await fetch(
            `https://gnews.io/api/v4/top-headlines?lang=en&country=in&max=8&token=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Error fetching GNews articles: ${response.status}`);
        }

        const data = await response.json();
        displayArticles(data.articles);
    } catch (error) {
        console.error(error);
        gnewsContainer.innerHTML = `<p>Failed to load articles. Please try again later.</p>`;
    }
}

function displayArticles(articles) {
    if (articles.length === 0) {
        gnewsContainer.innerHTML = `<p>No articles available.</p>`;
        return;
    }

    // Generate cards for each article
    const articleCards = articles.map(article => `
        <div class="card">
            <img src="${article.image || 'https://via.placeholder.com/300x200'}" alt="Article Image">
            <div class="card-content">
                <h3>${article.title}</h3>
                <p>${article.description || 'No description available.'}</p>
                <a href="${article.url}" target="_blank" class="read-more"><button class="custom-button" id="interactiveButton"></button></a>
            </div>
        </div>
    `);

    // Insert articles into the container
    gnewsContainer.innerHTML = articleCards.join('');
}

// Fetch articles on page load
document.addEventListener('DOMContentLoaded', fetchGNewsArticles);
