$(document).ready(function () {
  // get all the products and display them
  $.get("https://matthiasbaldauf.com/wbdg25/products", function (products) {
    products.forEach(function (product) {
      var productHTML = `
        <div class="col-md-4 mb-4 hover-effect">
        <a href="product.html?id=${product.id}">
          <div class="card product-card h-100">
            <img src="${product.img}" class="card-img-top" alt="${
        product["label-de"]
      }">
            <div class="card-body">
              <h5 class="card-title
              ">${product["label-de"]}</h5>
              <p class="card-text fw-bold">CHF ${product["price-chf"].toFixed(
                2
              )}</p>
              <a href="${
                product.url
              }" target="_blank" class="btn btn-primary">Zum Produkt</a>
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
  });
});
