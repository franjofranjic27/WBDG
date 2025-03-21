document.addEventListener("DOMContentLoaded", function () {
  const productContainer = document.getElementById("product-container");

  fetch("https://matthiasbaldauf.com/wbdg25/products")
    .then((response) => response.json())
    .then((products) => {
      products.forEach((product) => {
        const productHTML = `
            <div class="col-md-4 mb-4">
              <div class="card product-card h-100">
                <img src="${product.img}" class="card-img-top" alt="${
          product["label-de"]
        }">
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title">${product["label-de"]}</h5>
                  <p class="card-text fw-bold">CHF ${product[
                    "price-chf"
                  ].toFixed(2)}</p>
                  <a href="${
                    product.url
                  }" target="_blank" class="mt-auto btn btn-primary">Zum Produkt</a>
                </div>
              </div>
            </div>
          `;
        productContainer.innerHTML += productHTML;
      });
    })
    .catch((err) => {
      console.error("Fehler beim Laden der Produkte:", err);
      productContainer.innerHTML =
        "<p>Produkte konnten nicht geladen werden.</p>";
    });
});
