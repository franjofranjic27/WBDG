$(document).ready(function () {
  const EXCHANGERATE_API_KEY = "248e5e2234e8a5765dc1adb9";

  var products = [];
  var filteredProducts = [];
  var categories = [];
  var exchangeRateEUR;

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
    url: `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/CHF`,
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
            <div class="card productCard h-100">
              <img src="${product.img}" class="card-img-top" alt="${product["label-en"]}">
              <div class="card-body d-flex flex-column">
                <p class="card-text fs-6 mb-0 fw-light" style="color: #8c195f">${product["category"]}</p>
                <h5 class="card-title">${product["label-en"]}</h5>
                <div class="d-flex flex-column">
                  <p class="card-text me-3 mb-1 fs-5">CHF ${product["price-chf"]}</p>
                  <p class="card-text fw-lighter mb-2">EUR ${product["price-eur"]}</p>
                </div>
                <a href="${product.url}" target="_blank" class="btn btn-primary mt-auto">
                  <i class="bi bi-box-arrow-up-right"></i> To the product
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
          <span class="fw-normal">from</span> 
          <span>${products.length}</span> 
          <span class="fw-normal">products</span>
       </div>`
    );
  }

  function getCategories() {
    categories = [...new Set(products.map((product) => product.category))];
  }

  function populateCategoryFilter() {
    const options = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");

    $("#filter-category").append(options);
  }

  function filterProductsByCategory(selectedCategory) {
    filteredProducts = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products;

    $("#product-container").empty();
    renderProducts(filteredProducts);
  }

  // Populate filter dropdown and add event listener
  $(document).ajaxStop(function () {
    populateCategoryFilter();

    // Unbind previous event listeners to prevent duplicate bindings
    $("#filter-category").on("change", function () {
      const selectedCategory = $(this).val();
      filterProductsByCategory(selectedCategory);
    });
  });
});
