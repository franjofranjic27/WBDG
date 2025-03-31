$(document).ready(function () {
  // To-Do: either id in url of localStoragte
  const productId = new URLSearchParams(window.location.search).get("id");
  const EXCHANGERATE_API_KEY = "248e5e2234e8a5765dc1adb9";

  // Set the user's name and email from local storage if available
  $("#email").val(localStorage.getItem("email"));
  $("#user").val(localStorage.getItem("user"));

  var products = [];
  var product = {};
  var exchangeRateEUR;
  var reviews = [];
  
  var orderBy = "desc";
  var sortBy = "";
  var filter = "";

  if (productId) {
    // Fetch all the products from the API
    $.ajax({
      url: "https://matthiasbaldauf.com/wbdg25/products",
      method: "GET",
      dataType: "json",
      success: function (data) {
        products = data;
        renderProductByProductID(productId);
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
  } else {
    $("#product-container").html("<p>No product ID provided.</p>");
  }

  function renderProductByProductID(productId) {
    product = products.find((p) => p.id == productId);
    if (product) {
      getReviewsByProductID();

      // Convert price to EUR
      product["price-eur"] = product["price-chf"] * exchangeRateEUR;
      // Format price to 2 decimal places
      product["price-chf"] = parseFloat(product["price-chf"]).toFixed(2);
      product["price-eur"] = parseFloat(product["price-eur"]).toFixed(2);

      $("#product-container").html(`
        <div class="card">
          <img src="${product.img}" class="card-img-top" alt="${product["label-de"]}">
          <div class="card-body">
            <p class="card-text fs-6 mb-0 fw-light" style="color: #8c195f">${product["category"]}</p>
            <h3 class="card-title">${product["label-de"]}</h3>
            <div class="d-flex flex-column">
              <p class="card-text me-3 mb-1 fs-5">CHF ${product["price-chf"]}</p>
              <p class="card-text fw-lighter mb-1">EUR ${product["price-eur"]}</p>
            </div>
            <div class="overflow-hidden mb-2" id="productRating"></div>
            <a href="${product.url}" target="_blank" class="btn btn-primary"><i class="bi bi-box-arrow-up-right"></i> Zum Produkt</a>
          </div>
        </div>
      `);
      $("#reviews").html(`
          <div>Loading reviews...</div>
      `);
    } else {
      $("#product-container").html("<p>Product not found.</p>");
    }
  }

  // Fetch reviews by product ID
  function getReviewsByProductID() {
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
          reviews = reviews;

          meanRatingPerProduct =
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length;

          var reviewsPerProduct = reviews.length;

          $("#productRating").html(
            `<span class='score fs-5 s${meanRatingPerProduct}'></span><span class="fs-5"> ${reviewsPerProduct}</span>`
          );

          //Todo Map also for the other not foreach?
          $("#reviews").html(
            reviews
              .map(
                (review) => `
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="d-flex align-items-center mb-2">
                        <img
                          src="https://avatar.iran.liara.run/username?username=${
                            review.username
                          }"
                          alt="Avatar"
                          class="review-avatar me-3"
                        /> 
                        <h5 class="card-title text-center m-0">${
                          review.username
                        }</h5>
                      </div>
                      <div class=overflow-hidden>
                        <span class="score fs-6 s${review.rating}"></span>
                      </div>
                      <p class="card-text">${review.comment}</p>
                      <small class="text-muted d-block">erstellt am: ${new Date(
                        review.date
                      ).toLocaleDateString()}</small>
                    </div>
                  </div>
                `
              )
              .join("")
          );
        } else {
          $("#reviews").html("<p>No reviews available.</p>");
        }
      },
      error: function () {
        $("#reviews").html("<p>Error loading reviews.</p>");
      },
    });
  }

  //Form + Validation
  $("#review-form").on("submit", function (event) {
    event.preventDefault();
    var formData = new FormData();

    var formData = {
      prodid: productId,
      comment: $("#comment").val(),
      rating: $("#rating").val(),
      user: $("#user").val(),
      email: $("#email").val(),
    };

    localStorage.setItem("user", $("#user").val());
    localStorage.setItem("email", $("#email").val());

    var reviewData = JSON.stringify(formData);

    console.log(reviewData);

    /*
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
    */
  });

  // Listener for review sort dropdown
  $("#reviewOrderBy").on("change", function () {
    orderBy = $(this).val();
    console.log(orderBy);

    getReviewsByProductID();
  });

  // Listener for review sort dropdown
  // ToDo Fix this Muffucka
  $("#reviewSortBy").on("change", function () {
    sortBy = $(this).val();
    console.log(sortBy);

    getReviewsByProductID();
  });

  // Listener for review sort dropdown
  // ToDo Listen not on change but on whatever
  $("#reviewFilter").on("change", function () {
    filter = $(this).val();
    console.log(filter);

    getReviewsByProductID();
  });
  
});
