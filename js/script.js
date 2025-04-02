$(document).ready(function () {
  var exchangeRateEUR;
  var products = [];

  const EXCHANGERATE_API_KEY = "248e5e2234e8a5765dc1adb9";

  init();

  function init() {
    $.ajax({
      url: "https://matthiasbaldauf.com/wbdg25/products",
      method: "GET",
      dataType: "json",
      success: function (data) {
        products = data;
        renderProducts(products);
      },
      error: function (error) {
        console.error("Error fetching products:", error);
      },
    });

    $.ajax({
      url: `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/CHF`,
      method: "GET",
      dataType: "json",
      success: function (data) {
        exchangeRateEUR = data.conversion_rates.EUR;
      },
      error: function (error) {
        console.error("Error fetching exchange rate data:", error);
      },
    });
  }

  function renderProducts(productsToRender) {
    // Validate productsToRender
    if (!validateProducts(productsToRender)) return;

    // Format prices and create HTML for each product
    const productCards = productsToRender
      .map((product) => formatProductPrices(product))
      .map((product) => createProductCard(product))
      .join("");

    // Append all product cards to the container
    $("#product-container").html(productCards);

    // Update the information about the amount of visible products
    $("#sumProductsContainer").html(`
      <div class="text-center fw-bold">
        <span>${productsToRender.length}</span> 
        <span class="fw-normal">from</span> 
        <span>${products.length}</span> 
        <span class="fw-normal">products</span>
      </div>
    `);
  }

  function validateProducts(productsToRender) {
    // Validate if productsToRender is an array and is not empty
    if (!Array.isArray(productsToRender) || productsToRender.length === 0) {
      console.error("productsToRender is either not an array or it is empty.");
      return false;
    }

    // Validate if each item in the array has the required properties
    const isValid = productsToRender.every(
      (product) =>
        product.hasOwnProperty("id") &&
        product.hasOwnProperty("label-en") &&
        product.hasOwnProperty("price-chf") &&
        product.hasOwnProperty("category") &&
        product.hasOwnProperty("url")
    );

    if (!isValid) {
      console.error("One or more products are missing required properties.");
      return false;
    }

    return true;
  }

  function formatProductPrices(product) {
    // Format price to 2 decimal places
    product["price-chf"] = parseFloat(product["price-chf"]).toFixed(2);
    product["price-eur"] = parseFloat(
      product["price-chf"] * exchangeRateEUR
    ).toFixed(2);
    return product;
  }

  function createProductCard(product) {
    return `
      <div class="col-md-4 mb-4 productCard">
        <a href="product.html?id=${product.id}" style="all: unset; cursor: pointer;">
          <div class="card h-100">
            <img src="${product.img}" class="card-img-top" alt="${product["label-en"]}">
            <div class="card-body d-flex flex-column">
              <p class="card-text fs-6 mb-0 fw-light" style="color: #8c195f">${product["category"]}</p>
              <h5 class="card-title">${product["label-en"]}</h5>
              <div class="d-flex flex-column">
                <p class="card-text mb-1 fs-5">CHF ${product["price-chf"]}</p>
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
  }

  $(document).ajaxStop(function () {
    populateCategoryFilter();

    $("#filter-category").on("change", function () {
      const selectedCategory = $(this).val();
      filterProductsByCategory(selectedCategory);
    });
  });

  function populateCategoryFilter() {
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ];

    const options = categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");

    $("#filter-category").append(options);
  }

  function filterProductsByCategory(selectedCategory) {
    const filteredProducts = selectedCategory
      ? products.filter((product) => product.category === selectedCategory)
      : products;

    $("#product-container").empty();
    renderProducts(filteredProducts);
  }
});
