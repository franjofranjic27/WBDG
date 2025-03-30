$(document).ready(function () {
  var products = [];
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
      getCategories();
      renderProducts();
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
  function renderProducts() {
    products.forEach(function (product) {
      // Convert price to EUR
      product["price-eur"] = product["price-chf"] * exchangeRateEUR;
      // Format price to 2 decimal places
      product["price-chf"] = parseFloat(product["price-chf"]).toFixed(2);
      product["price-eur"] = parseFloat(product["price-eur"]).toFixed(2);
      // Create product HTML
      var productHTML = `
        <div class="col-md-4 mb-4 hover-effect">
          <a href="product.html?id=${product.id}" style="all: unset;">
            <div class="card product-card h-100">
              <img src="${product.img}" class="card-img-top" alt="${product["label-de"]}">
              <div class="card-body">
                <h5 class="card-title">${product["label-de"]}</h5>
                <p class="card-text fw-bold">CHF ${product["price-chf"]}</p>
                <p class="card-text fw-bold">EUR ${product["price-eur"]}</p>
                <a href="${product.url}" target="_blank" class="btn btn-primary">Zum Produkt</a>
                <div class=overflow-hidden>
                  <span class="score s4"></span>
                </div>
              </div>
            </div>
          </a>
        </div>
      `;

      $("#product-container").append(productHTML);
    });
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
    var filteredProducts = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products;
    filteredProducts.forEach(function (product) {
      // Reuse render logic
      var productHTML = `
        <div class="col-md-4 mb-4 hover-effect">
          <a href="product.html?id=${product.id}" style="all: unset;">
            <div class="card product-card h-100">
              <img src="${product.img}" class="card-img-top" alt="${product["label-de"]}">
              <div class="card-body">
                <h5 class="card-title">${product["label-de"]}</h5>
                <p class="card-text fw-bold">CHF ${product["price-chf"]}</p>
                <p class="card-text fw-bold">EUR ${product["price-eur"]}</p>
                <a href="${product.url}" target="_blank" class="btn btn-primary">Zum Produkt</a>
                <div class=overflow-hidden>
                  <span class="score s4"></span>
                </div>
              </div>
            </div>
          </a>
        </div>
      `;
      $("#product-container").append(productHTML);
    });
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
