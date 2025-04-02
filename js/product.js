$(document).ready(function () {
  var exchangeRateEUR;
  var orderBy = "";
  var sortBy = "asc";
  var filter = "";

  const productId = new URLSearchParams(window.location.search).get("id");
  const EXCHANGERATE_API_KEY = "248e5e2234e8a5765dc1adb9";

  init();

  function init() {
    if (!productId) {
      $("#product-container").html("<p>No product ID provided.</p>");
      return;
    }

    //Todo: split into functions
    // Set the user's name and email from local storage
    $("#email").val(localStorage.getItem("email"));
    $("#user").val(localStorage.getItem("user"));

    // Fetch all the products from the API
    $.ajax({
      url: "https://matthiasbaldauf.com/wbdg25/products",
      method: "GET",
      dataType: "json",
      success: function (products) {
        renderProductByProductID(products, productId);
      },
      error: function (error) {
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
      error: function (error) {
        console.error("Error fetching exchange rate data:", error);
      },
    });
  }

  function formatProductPrices(product) {
    // Format price to 2 decimal places
    product["price-chf"] = parseFloat(product["price-chf"]).toFixed(2);
    product["price-eur"] = parseFloat(
      product["price-chf"] * exchangeRateEUR
    ).toFixed(2);
    return product;
  }

  // Function to render the product details
  function renderProductDetails(product) {
    return `
    <div class="card">
      <img src="${product.img}" class="card-img-top" alt="${product["label-en"]}">
      <div class="card-body">
        <p class="card-text fs-6 mb-0 fw-light" style="color: #8c195f">${product["category"]}</p>
        <h3 class="card-title">${product["label-en"]}</h3>
        <div class="d-flex flex-column">
          <p class="card-text me-3 mb-1 fs-5">CHF ${product["price-chf"]}</p>
          <p class="card-text fw-lighter mb-1">EUR ${product["price-eur"]}</p>
        </div>
        <div class="overflow-hidden mb-2" id="productRating"></div>
        <a href="${product.url}" target="_blank" class="btn btn-primary">
          <i class="bi bi-box-arrow-up-right"></i> To the product
        </a>
      </div>
    </div>
  `;
  }

  // Main function to render product by product ID
  function renderProductByProductID(products, productId) {
    const product = products.find((p) => p.id == productId);

    //Todo: display on the whole page
    if (!product) {
      $("#product-container").html("<p>Product not found.</p>");
      return;
    }

    formatProductPrices(product);

    // Render product details and reviews
    $("#product-container").html(renderProductDetails(product));

    getReviewsByProductID();
  }

  function calculateMeanRating(reviews) {
    return (
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    );
  }

  // Function to create review HTML markup
  function createReviewMarkup(review) {
    return `
    <div class="card mb-3">
      <div class="card-body">
        <div class="d-flex align-items-center mb-2">
          <img
            src="https://avatar.iran.liara.run/username?username=${
              review.username
            }"
            alt="Avatar"
            class="reviewAvatar me-3 rounded-circle"
          />
          <h5 class="card-title text-center m-0">${review.username}</h5>
        </div>
        <div class="overflow-hidden">
          <span class="score fs-6 s${review.rating}"></span>
        </div>
        <p class="card-text">${review.comment}</p>
        <small class="text-muted d-block">created on: ${new Date(
          review.date
        ).toLocaleDateString()}</small>
      </div>
    </div>
  `;
  }

  // Fetch reviews by product ID
  // Todo: Refactor this code
  function getReviewsByProductID() {
    $("#reviews").html("<div>Loading reviews...</div>");

    $.ajax({
      url: `https://matthiasbaldauf.com/wbdg25/reviews`,
      method: "GET",
      data: {
        prodid: productId,
        orderby: orderBy,
        sort: sortBy,
        filter: filter,
      },
      dataType: "json",
      success: function (reviews) {
        if (reviews.length > 0) {
          const meanRatingPerProduct = calculateMeanRating(reviews);
          const reviewsPerProduct = reviews.length;

          $("#productRating").html(`
            <span class='score fs-5 s${meanRatingPerProduct}'></span>
            <span class="fs-5"> ${reviewsPerProduct}</span>
          `);

          const reviewsMarkup = reviews.map(createReviewMarkup).join("");
          $("#reviews").html(reviewsMarkup);
        } else {
          $("#reviews").html("<p>No reviews available.</p>");
        }
      },
      error: function () {
        $("#reviews").html("<p>Error loading reviews.</p>");
      },
    });
  }

  function showToast(message, type = "success") {
    const toastClass =
      type === "success" ? "text-bg-success" : "text-bg-danger";
    $("body").append(`
      <div class="toast align-items-center ${toastClass} border-0" role="alert" aria-live="assertive" aria-atomic="true" style="position: fixed; top: 1rem; right: 1rem;">
        <div class="d-flex">
          <div class="toast-body">
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `);
    $(".toast").toast({ delay: 3000 }).toast("show");
  }

  //Todo: Refactor this code
  $("#reviewForm").on("submit", function (event) {
    event.preventDefault();

    //Todo: refactor this code
    const form = $(this)[0];

    // Check if the form is valid
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      $(this).addClass("was-validated");
      return;
    }

    // Add Bootstrap validation classes
    $(this).addClass("was-validated");

    var user = $("#user").val();
    var email = $("#email").val();
    var comment = $("#comment").val();
    var rating = $("#rating").val();

    localStorage.setItem("user", user);
    localStorage.setItem("email", email);

    // Todo: it should not send a request if the form is invalid
    $.ajax({
      url: "https://matthiasbaldauf.com/wbdg25/review",
      method: "POST",
      contentType: "application/x-www-form-urlencoded",
      data: $.param({
        prodid: productId,
        comment: comment,
        rating: rating,
        email: email,
        user: user,
      }),
      success: function () {
        showToast("Review submitted successfully!", "success");

        // Reset the form and update fields
        $("#review-form")[0].reset();
        $("#user").val(user);
        $("#email").val(email);

        // Refresh the reviews and scroll to the review section
        getReviewsByProductID();
        // Scroll to the reviews section
        $("html, body").animate(
          {
            scrollTop: $("#product-container").offset().top,
          },
          500
        );
      },
      error: function () {
        showToast("Failed to submit review. Please try again.", "error");
      },
    });
  });

  // Listener for review sort button
  $("#reviewSortBy").on("click", function () {
    const currentSort = $(this).data("sort");
    const newSort = currentSort === "asc" ? "desc" : "asc";
    $(this).data("sort", newSort); // Update the data-sort attribute
    $(this).html(
      newSort === "asc"
        ? '<i class="bi bi-sort-up"></i> Ascending'
        : '<i class="bi bi-sort-down"></i> Descending'
    );
    sortBy = newSort;

    getReviewsByProductID();
  });

  // Listener for review sort dropdown
  $("#reviewOrderBy").on("change", function () {
    orderBy = $(this).val();

    getReviewsByProductID();
  });

  // Listener for review sort dropdown
  $("#reviewFilter").on("input", function () {
    filter = $(this).val();

    getReviewsByProductID();
  });
});
