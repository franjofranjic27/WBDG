$(document).ready(function () {
  var products = [];
  var filteredProducts = [];
  var categories = [];
  var exchangeRateEUR;

  const EXCHANGERATE_API_KEY = "248e5e2234e8a5765dc1adb9";

  // Fetch all the products from the API
  $.ajax({
    url: "https://matthiasbaldauf.com/wbdg25/products",
    method: "GET",
    dataType: "json",
    success: function (data) {
      products = data;
      filteredProducts = [...products]; // Initially, show all products
      getCategories();
      renderProducts(filteredProducts);
    },
    error: function (xhr, status, error) {
      console.error("Error fetching products:", error);
    },
  });

  // Fetch the exchange rate from the API and set the current exchange rate in EUR
  $.ajax({
    url: "https://v6.exchangerate-api.com/v6/248e5e2234e8a5765dc1adb9/latest/CHF",
    method: "GET",
    dataType: "json",
    success: function (data) {
      exchangeRateEUR = data.conversion_rates.EUR;
    },
    error: function (xhr, status, error) {
      console.error("Error fetching exchange rate data:", error);
    },
  });

  // render Products from API
  function renderProducts(productsToRender) {
    productsToRender.forEach(function (product) {
      // Convert price to EUR
      product["price-eur"] = product["price-chf"] * exchangeRateEUR;
      // Format price to 2 decimal places
      product["price-chf"] = parseFloat(product["price-chf"]).toFixed(2);
      product["price-eur"] = parseFloat(product["price-eur"]).toFixed(2);
      // Create product HTML
      var productHTML = `
        <div class="col-md-4 mb-4 hover-effect">
          <a href="product.html?id=${product.id}" style="all: unset; cursor: pointer;">
            <div class="card product-card h-100">
              <img src="${product.img}" class="card-img-top" alt="${product["label-de"]}">
              <div class="card-body d-flex flex-column">
                <p class="card-text fs-6 mb-0 fw-light" style="color: #8c195f">${product["category"]}</p>
                <h5 class="card-title">${product["label-de"]}</h5>
                <div class="d-flex flex-column">
                  <p class="card-text me-3 mb-1 fs-5">CHF ${product["price-chf"]}</p>
                  <p class="card-text fw-lighter mb-2">EUR ${product["price-eur"]}</p>
                </div>
                <a href="${product.url}" target="_blank" class="btn btn-primary mt-auto">
                  <i class="bi bi-box-arrow-up-right"></i> Zum Produkt
                </a>
              </div>
            </div>
          </a>
        </div>
      `;

      $("#product-container").append(productHTML);
    });

    $("#sumProductsContainer").html(
      `<div class="text-center fw-bold">
          <span>${filteredProducts.length}</span> 
          <span class="fw-normal">von</span> 
          <span>${products.length}</span> 
          <span class="fw-normal">Produkten</span>
       </div>`
    );
  }

  // Fetch categories from the API
  function getCategories() {
    products.forEach(function (product) {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });
  }

  function populateCategoryFilter() {
    categories.forEach(function (category) {
      $("#filter-category").append(
        `<option value="${category}">${category}</option>`
      );
    });
  }

  function filterProductsByCategory(selectedCategory) {
    $("#product-container").empty();
    filteredProducts = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products;

    renderProducts(filteredProducts);
  }

  // Populate filter dropdown and add event listener
  $(document).ajaxStop(function () {
    populateCategoryFilter();
    $("#filter-category").on("change", function () {
      var selectedCategory = $(this).val();
      filterProductsByCategory(selectedCategory);
    });
  });
});
