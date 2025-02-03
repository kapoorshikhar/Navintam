// GNews API Keys
const apiKeys = [
    '6db28cbad383869dd0d986c1ab891236',
    '6faefcd2530c99721f4b17eaf22b2187',
    '6e96c992789b60999b047572d305298f',
    'cc24b0768fef6b0002fc975f726d96fb'
];

let currentApiKeyIndex = 0;
const gnewsContainer = document.getElementById('gnews-container');
let currentLang = localStorage.getItem("lang") || "en";

// Function to fetch GNews Articles
async function fetchGNewsArticles() {
    if (currentApiKeyIndex >= apiKeys.length) {
        gnewsContainer.innerHTML = `<p>Failed to load articles. Please try again later.</p>`;
        return;
    }

    try {
        const apiKey = apiKeys[currentApiKeyIndex];
        const langParam = currentLang === "hi" ? "hi" : "en";  // Fetch articles in Hindi if selected
        const response = await fetch(
            `https://gnews.io/api/v4/top-headlines?lang=${langParam}&country=in&max=8&token=${apiKey}`
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

// Function to display articles
function displayArticles(articles) {
    if (!articles || articles.length === 0) {
        gnewsContainer.innerHTML = `<p>No articles available.</p>`;
        return;
    }

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

    gnewsContainer.innerHTML = articleCards.join('');
}

// Language translations
const translations = {
    en: {
        home: "Home",
        opinion: "Opinion",
        latestNews: "Latest News",
        aboutUs: "About Us",
        world: "World",
        nation: "Nation",
        business: "Business",
        technology: "Technology",
        entertainment: "Entertainment",
        sports: "Sports",
        science: "Science",
        health: "Health",
        opinionTitle: "Opinion",
        footer: "© 2024 Navintam Samacharam. All Rights Reserved.",
        socialMedia: "Social Media Connects",
        toggleText: "🌐 हिंदी",
        readMore: "Read More"
    },
    hi: {
        home: "होम",
        opinion: "मताखंड",
        latestNews: "ताज़ा खबर",
        aboutUs: "हमारे बारे में",
        world: "विश्व",
        nation: "राष्ट्र",
        business: "व्यवसाय",
        technology: "तकनीक",
        entertainment: "मनोरंजन",
        sports: "खेल",
        science: "विज्ञान",
        health: "स्वास्थ्य",
        opinionTitle: "मताखंड",
        footer: "© 2024 नविनतम समाचार। सभी अधिकार सुरक्षित।",
        socialMedia: "सोशल मीडिया कनेक्ट्स",
        toggleText: "🌐 English",
        readMore: "अधिक पढ़ें"
    }
};

// Function to change language
function changeLanguage() {
    currentLang = currentLang === "en" ? "hi" : "en";
    
    document.querySelector("#toggle-language").textContent = translations[currentLang].toggleText;
    document.querySelector("#headline a:nth-child(1)").textContent = translations[currentLang].home;
    document.querySelector("#headline a:nth-child(2)").textContent = translations[currentLang].opinion;
    document.querySelector("#headline a:nth-child(3)").textContent = translations[currentLang].latestNews;
    document.querySelector("#headline a:nth-child(4)").textContent = translations[currentLang].aboutUs;

    let categories = document.querySelectorAll(".senav button");
    let categoryKeys = ["world", "nation", "business", "technology", "entertainment", "sports", "science", "health"];
    categories.forEach((btn, i) => btn.textContent = translations[currentLang][categoryKeys[i]]);

    document.querySelector(".footer-text").textContent = translations[currentLang].footer;
    document.querySelector(".Social").firstChild.textContent = translations[currentLang].socialMedia;

    // Change "Read More" buttons in articles
    document.querySelectorAll(".read-more button").forEach(button => {
        button.textContent = translations[currentLang].readMore;
    });

    localStorage.setItem("lang", currentLang);

    // Fetch news articles in the selected language
    fetchGNewsArticles();
}

// Event Listener for Language Toggle Button
document.querySelector("#toggle-language").addEventListener("click", changeLanguage);

// Load stored language preference and fetch articles on page load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("lang") === "hi") {
        changeLanguage(); // This will also fetch news in Hindi
    } else {
        fetchGNewsArticles();
    }
});
