$(document).ready(function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const productContainer = document.getElementById("product-container");

  if (!productId) {
    productContainer.innerHTML = "<p>No product ID provided.</p>";
  } else {
    renderProductByProductID(productId);
  }

  function renderProductByProductID(productId) {
    $.ajax({
      url: "https://matthiasbaldauf.com/wbdg25/products",
      method: "GET",
      dataType: "json",
      success: function (products) {
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
                  <p class="card-text fw-bold">EUR ${product[
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

          // Fetch the current exchange rate from the API
          $.ajax({
            url: "https://v6.exchangerate-api.com/v6/248e5e2234e8a5765dc1adb9/latest/CHF",
            method: "GET",
            dataType: "json",
            success: function (data) {
              // Set the current exchange rate in EUR
              exchangeRateEUR = data.conversion_rates.EUR;
              console.log(data);
              console.log(exchangeRateEUR);
            },
            error: function (xhr, status, error) {
              console.error("Error fetching exchange rate data:", error);
            },
          });

          // Fetch reviews
          $.ajax({
            url: `https://matthiasbaldauf.com/wbdg25/reviews`,
            method: "GET",
            data: { prodid: productId },
            dataType: "json",
            success: function (reviews) {
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
            },
            error: function () {
              document.getElementById("reviews").innerHTML =
                "<p>Error loading reviews.</p>";
            },
          });
        } else {
          productContainer.innerHTML = "<p>Product not found.</p>";
        }
      },
      error: function () {
        productContainer.innerHTML = "<p>Error loading products.</p>";
      },
    });
  }

  //Form + Validation
  $("#reviewForm").on("submit", function (event) {
    event.preventDefault();
    var formData = new FormData();

    formData.append("prodid", productId);
    formData.append("comment", $("#ncommentame").val());
    formData.append("rating", $("#rating").val());
    formData.append("user", $("#user").val());
    formData.append("email", $("#email").val());

    localStorage.setItem("user", document.getElementById("user").value);
    localStorage.setItem("email", document.getElementById("email").value);

    var reviewData = JSON.stringify(formData);

    $.ajax({
      url: "https://matthiasbaldauf.com/wbdg25/reviews",
      method: "POST",
      contentType: "application/json",
      data: reviewData,
      success: function () {
        //alert("Review submitted successfully!");
        //reviewForm.reset();
      },
      error: function () {
        alert("Failed to submit review. Please try again.");
      },
    });
  });
});
