# 📦 Product Review Platform

## 📚 Project Overview

This project is a **web-based product review platform** developed as part of the **Web Development Fundamentals** course at OST - School of Management. It showcases core front-end web development skills using:

- **HTML**
- **CSS**
- **JavaScript**
- **Bootstrap**

The platform dynamically fetches product and review data from REST APIs, allows users to browse products and reviews, and submit their own reviews.

---

## 🌟 Features & User Stories

### ✅ User Story 1: List Products

- Fetches product data from the REST endpoint
- Displays:
  - Product image
  - German label
  - Price in CHF and EUR (live exchange rate)
  - Product link to the OST shop

### ✅ User Story 2: Browse Reviews

- Displays user reviews per product including:
  - Username
  - Review date
  - Comment
  - Numeric rating
- Calculates and shows the **mean rating**
- _(Optional)_ Sort and filter reviews by rating, date, or content

### ✅ User Story 3: Submit a Review

- Review form with validation:
  - Username
  - Email
  - Comment
  - Numeric rating (1–5)
- Data submission via REST API
- Local storage of user data for auto-filling future reviews
- Provides user-friendly success/error feedback

---

## 📁 Project Structure

```
/project-folder
│
├── index.html               # Main HTML page
├── css/
│   └── style.css            # Custom CSS
├── js/
│   └── script.js            # Main JavaScript logic
├── images/                  # Product or layout images
└── README.md                # Project documentation
```

---

## 🔗 REST Endpoints Used

- **Get Products:** `https://matthiasbaldauf.com/wbdg25/products`
- **Get Reviews:** `https://matthiasbaldauf.com/wbdg25/reviews?prodid={productId}`
- **Post Review:** `https://matthiasbaldauf.com/wbdg25/review`
- **Exchange Rate API:** `https://api.exchangerate-api.com/v4/latest/CHF`

---

## 🛠 Technologies

- HTML5
- CSS3 & Bootstrap 5
- Vanilla JavaScript (DOM Manipulation & Fetch API)
- RESTful APIs
- LocalStorage

---

## 📄 Submission Details

- 📅 Deadline: **June 18, 2025**
- 📦 Submit: **ZIP file** containing:
  - `index.html`
  - CSS, JS, images, and other assets
  - Final project report (PDF)

---

## 🙌 Author

**[Your Name]** - Web Development Fundamentals Project

---
