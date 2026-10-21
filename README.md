
# 📰 NewsNow — News Search Web App

NewsNow is a responsive news search application built with HTML, CSS, and JavaScript. It integrates NewsAPI to help users search and explore news articles by keyword.

## ✨ Features

- 🔎 Search news by keyword or topic
- 📅 Filter articles by publication date
- ↕️ Sort articles by publication time or relevance
- 📰 Display article titles, descriptions, images, and sources
- ➕ Load more articles with pagination
- 🌙 Dark mode and ☀️ light mode
- 📱 Responsive user interface
- ⚠️ API error handling and loading messages

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- NewsAPI
- Fetch API
- URLSearchParams

## 📸 Preview

Add a screenshot of your application here.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the project

Open the project folder in VS Code.

### 3. Configure your API key

Register at [NewsAPI.org](https://newsapi.org/) and obtain your API key.

In `script.js`, configure:

```javascript
const API_KEY = "YOUR_NEWSAPI_KEY";
const API_URL = "https://newsapi.org/v2/everything";
```

Replace the placeholder with your own key.

### 4. Run the application

Open `index.html` using VS Code Live Server and search for a news topic.

## 📚 What I Learned

- Working with third-party APIs
- Fetching and processing JSON data
- Using async/await and error handling
- Creating dynamic news cards with DOM manipulation
- Implementing search, sorting, filtering, and pagination
- Building interactive dark/light themes

## 🔐 API Key Security

Never commit API keys to a public repository. Frontend JavaScript exposes its contents to visitors. For public deployment, call NewsAPI through a backend and review the API plan's usage and deployment restrictions.

## 👨‍💻 Author

**Ankush Nath Sharma**

B.Tech CSE (AI & ML) Student | Learning Web Development

## 📄 License

This project is available for learning and educational purposes.
