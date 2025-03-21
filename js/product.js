document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const productContainer = document.getElementById("product-container");

  if (!productId) {
    productContainer.innerHTML = "<p>No product ID provided.</p>";
  } else {
    // Fetch product details
    fetch("https://matthiasbaldauf.com/wbdg25/products")
      .then((response) => response.json())
      .then((products) => {
        const product = products.find((p) => p.id == productId);
        if (product) {
          productContainer.innerHTML = `
            <div class="col-md-8">
              <div class="card">
                <img src="${product.img}" class="card-img-top" alt="${
            product["label-de"]
          }">
                <div class="card-body">
                  <h3 class="card-title">${product["label-de"]}</h3>
                  <p class="card-text fw-bold">CHF ${product[
                    "price-chf"
                  ].toFixed(2)}</p>
                  <p class="card-text">${
                    product.description || "No description available."
                  }</p>
                  <a href="${
                    product.url
                  }" target="_blank" class="btn btn-primary">Buy Now</a>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <h3>Reviews</h3>
              <div id="reviews">Loading reviews...</div>
            </div>
          `;

          // Fetch reviews
          fetch(
            `https://matthiasbaldauf.com/wbdg25/reviews?prodid=${productId}`
          )
            .then((response) => response.json())
            .then((reviews) => {
              const reviewsDiv = document.getElementById("reviews");
              if (reviews.length > 0) {
                reviewsDiv.innerHTML = reviews
                  .map(
                    (review) => `
                    <div class="card mb-3">
                      <div class="card-body">
                        <h5 class="card-title">${review.username}</h5>
                        <p class="card-text">${review.comment}</p>
                        <span class="badge bg-success">Rating: ${
                          review.rating
                        }/5</span>
                        <small class="text-muted d-block">Reviewed on: ${new Date(
                          review.date
                        ).toLocaleDateString()}</small>
                      </div>
                    </div>
                  `
                  )
                  .join("");
              } else {
                reviewsDiv.innerHTML = "<p>No reviews available.</p>";
              }
            })
            .catch(() => {
              document.getElementById("reviews").innerHTML =
                "<p>Error loading reviews.</p>";
            });
        } else {
          productContainer.innerHTML = "<p>Product not found.</p>";
        }
      })
      .catch(() => {
        productContainer.innerHTML = "<p>Error loading product data.</p>";
      });
  }
});
