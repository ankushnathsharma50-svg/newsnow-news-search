
const API_KEY = "your own API keys";
const API_URL = "https://newsapi.org/v2/everything";

const form = document.getElementById("news-form");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const fromDate = document.getElementById("from-date");
const sortBy = document.getElementById("sort-by");
const message = document.getElementById("message");
const newsGrid = document.getElementById("news-grid");
const resultsTitle = document.getElementById("results-title");
const resultsCount = document.getElementById("results-count");
const loadMoreBtn = document.getElementById("load-more");

let currentPage = 1;
let currentQuery = "";
let totalResults = 0;
let isLoading = false;

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
  message.hidden = false;
}

function hideMessage() {
  message.hidden = true;
  message.classList.remove("error");
}

function formatDate(dateString) {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

function createNewsCard(article) {
  const card = document.createElement("article");
  card.className = "news-card";

  if (article.urlToImage) {
    const image = document.createElement("img");
    image.className = "news-image";
    image.src = article.urlToImage;
    image.alt = article.title || "News image";
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";

    image.addEventListener("error", () => image.remove(), {
      once: true
    });

    card.appendChild(image);
  }

  const body = document.createElement("div");
  body.className = "news-body";

  const source = document.createElement("p");
  source.className = "news-source";
  source.textContent = article.source?.name || "News source";

  const title = document.createElement("h3");
  const titleLink = document.createElement("a");
  titleLink.textContent = article.title || "Untitled article";

  if (article.url && article.url.startsWith("https://")) {
    titleLink.href = article.url;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";
  } else {
    titleLink.removeAttribute("href");
  }

  title.appendChild(titleLink);

  const description = document.createElement("p");
  description.className = "news-description";
  description.textContent =
    article.description || "No description is available for this article.";

  const meta = document.createElement("p");
  meta.className = "news-meta";
  meta.textContent =
    `${article.author ? article.author + " · " : ""}${formatDate(article.publishedAt)}`;

  body.append(source, title, description, meta);

  if (article.url && article.url.startsWith("https://")) {
    const link = document.createElement("a");
    link.className = "read-more";
    link.href = article.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Read full article ↗";
    body.appendChild(link);
  }

  card.appendChild(body);
  return card;
}

async function searchNews(query, loadMore = false) {
  query = query.trim();

  if (!query) {
    showMessage("Please enter a keyword to search for news.", true);
    searchInput.focus();
    return;
  }

  if (API_KEY === "PASTE_YOUR_NEWSAPI_KEY_HERE" || !API_KEY.trim()) {
    showMessage("Add your NewsAPI key in script.js first.", true);
    return;
  }

  if (isLoading) return;

  if (!loadMore) {
    currentPage = 1;
    currentQuery = query;
    newsGrid.replaceChildren();
    loadMoreBtn.hidden = true;
    resultsTitle.textContent = `Results for "${query}"`;
    resultsCount.textContent = "Searching...";
  }

  isLoading = true;
  searchBtn.disabled = true;
  loadMoreBtn.disabled = true;
  searchBtn.textContent = "Searching...";

  showMessage(
    loadMore ? "Loading more articles..." : "Searching the news..."
  );

  try {
    const params = new URLSearchParams({
      q: currentQuery,
      sortBy: sortBy.value,
      pageSize: "9",
      page: String(currentPage),
      language: "en"
    });

    if (fromDate.value) {
      params.set("from", fromDate.value);
    }

    const response = await fetch(`${API_URL}?${params}`, {
      method: "GET",
      headers: {
        "X-Api-Key": API_KEY
      }
    });

    const data = await response.json();

    if (!response.ok || data.status === "error") {
      throw new Error(
        `${data.code || response.status}: ${
          data.message || "Unable to retrieve news."
        }`
      );
    }

    const articles = Array.isArray(data.articles)
      ? data.articles
      : [];

    totalResults = Number(data.totalResults) || 0;

    if (!loadMore) {
      newsGrid.replaceChildren();
    }

    if (articles.length === 0 && currentPage === 1) {
      resultsCount.textContent = "0 articles found.";
      showMessage("No articles found. Try another keyword or date.");
      return;
    }

    const fragment = document.createDocumentFragment();

    articles.forEach(article => {
      fragment.appendChild(createNewsCard(article));
    });

    newsGrid.appendChild(fragment);

    const shown = newsGrid.children.length;
    resultsCount.textContent =
      `Showing ${shown} of ${totalResults.toLocaleString()} available results.`;

    hideMessage();

    loadMoreBtn.hidden =
      articles.length === 0 ||
      shown >= totalResults ||
      shown >= 100;

    currentPage++;

  } catch (error) {
    console.error("NewsAPI error:", error);

    if (error instanceof TypeError) {
      showMessage(
        "Network or CORS error. Check Live Server and your browser Console.",
        true
      );
    } else {
      showMessage(`Unable to load news: ${error.message}`, true);
    }

    if (!loadMore) {
      resultsCount.textContent = "Search failed.";
    }

  } finally {
    isLoading = false;
    searchBtn.disabled = false;
    loadMoreBtn.disabled = false;
    searchBtn.textContent = "Search News";
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  searchNews(searchInput.value);
});

loadMoreBtn.addEventListener("click", () => {
  searchNews(currentQuery, true);
});

document.querySelectorAll(".topic").forEach(button => {
  button.addEventListener("click", () => {
    searchInput.value = button.dataset.query;
    searchNews(searchInput.value);
  });
});

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.body.classList.toggle("dark-mode", isDark);

  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "Light Mode" : "Dark Mode";

  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode"
  );
}

// Restore the saved theme, or use light mode by default.
const savedTheme = localStorage.getItem("newsnow-theme") || "light";
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-mode")
    ? "light"
    : "dark";

  applyTheme(nextTheme);
  localStorage.setItem("newsnow-theme", nextTheme);
});
