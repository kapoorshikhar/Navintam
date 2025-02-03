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
        savarkar: "Savarkar: The Controversial Figure",
        savarkarDesc: "Revolution is necessary when natural political evolution is suppressed to restore justice",
        navyDay: "Navy's Day",
        navyDayDesc: "Catch up on the latest highlights. This is a quick teaser of the article.",
        modiLaws: "Modi's 3 Criminal Laws",
        modiLawsDesc: "Empowering Justice and Citizen Rights: A Landmark Initiative in India",
        footer: "© 2024 Navintam Samacharam. All Rights Reserved.",
        socialMedia: "Social Media Connects",
        toggleText: "🌐 हिंदी"
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
        savarkar: "सावरकर: विवादास्पद व्यक्ति",
        savarkarDesc: "क्रांति आवश्यक है जब प्राकृतिक राजनीतिक विकास को दबाया जाता है न्याय बहाल करने के लिए",
        navyDay: "नौसेना दिवस",
        navyDayDesc: "नवीनतम हाइलाइट्स के बारे में पढ़ें। यह एक संक्षिप्त पूर्वावलोकन है।",
        modiLaws: "मोदी के 3 आपराधिक कानून",
        modiLawsDesc: "न्याय और नागरिक अधिकारों को सशक्त बनाना: भारत में एक ऐतिहासिक पहल",
        footer: "© 2024 नविनतम समाचार। सभी अधिकार सुरक्षित।",
        socialMedia: "सोशल मीडिया कनेक्ट्स",
        toggleText: "🌐 English"
    }
};

// Function to change language
function changeLanguage() {
    let currentLang = localStorage.getItem("lang") || "en";
    let newLang = currentLang === "en" ? "hi" : "en";

    document.querySelector("#toggle-language").textContent = translations[newLang].toggleText;
    document.querySelector("#headline a:nth-child(1)").textContent = translations[newLang].home;
    document.querySelector("#headline a:nth-child(2)").textContent = translations[newLang].opinion;
    document.querySelector("#headline a:nth-child(3)").textContent = translations[newLang].latestNews;
    document.querySelector("#headline a:nth-child(4)").textContent = translations[newLang].aboutUs;

    let categories = document.querySelectorAll(".senav button");
    let categoryKeys = ["world", "nation", "business", "technology", "entertainment", "sports", "science", "health"];
    categories.forEach((btn, i) => btn.textContent = translations[newLang][categoryKeys[i]]);

    document.querySelector("#Matakhandh h2").textContent = translations[newLang].opinionTitle;
    document.querySelector(".card-content-2 h3:nth-child(1)").textContent = translations[newLang].savarkar;
    document.querySelector(".card-content-2 p:nth-child(2)").textContent = translations[newLang].savarkarDesc;
    document.querySelector(".card-content-2 h3:nth-child(3)").textContent = translations[newLang].navyDay;
    document.querySelector(".card-content-2 p:nth-child(4)").textContent = translations[newLang].navyDayDesc;
    document.querySelector(".card-content-2 h3:nth-child(5)").textContent = translations[newLang].modiLaws;
    document.querySelector(".card-content-2 p:nth-child(6)").textContent = translations[newLang].modiLawsDesc;

    document.querySelector(".footer-text").textContent = translations[newLang].footer;
    document.querySelector(".Social").firstChild.textContent = translations[newLang].socialMedia;

    localStorage.setItem("lang", newLang);
}

// Event Listener for Language Toggle Button
document.querySelector("#toggle-language").addEventListener("click", changeLanguage);

// Load stored language preference on page load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("lang") === "hi") changeLanguage();
});


// Fetch articles on page load
document.addEventListener('DOMContentLoaded', fetchGNewsArticles);
