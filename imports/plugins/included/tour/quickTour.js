import introJs from "intro.js";

const tour = introJs.introJs();
const tourSteps = [
  {
    intro: `<h3 class="text-center">Hello, Welcome to <strong>Isengard
     Reaction Commerce</strong></h3>
    <hr>
    <div class="tourcontainer">
      <strong>Reaction Commerce</strong> is an ecommerce application for all 
      types of products and services.<br>
      This tour would give you a quick introductory walkthrough of how to use the application.
      Click Next to get started. You can end the tour anytime by clicking Skip.
    </div>`
  },
  {
    element: ".dropdown",
    intro: `<h2 class="text-center">Language</h2>
    <hr>
    <div class="tourcontainer">
      As we always expect users from all over the world.<br>
      We believe that language should never be a barrier.<br>
      Click on language icon and select your preferred language from the dropdown.
    </div>`
  },
  {
    element: ".navbar-item",
    intro: `<h2 class="text-center">Shops</h2>
    <hr>
    <div class="tourcontainer">
      Access all shops by clicking here
    </div>`
  },
  {
    element: ".search",
    intro: `<h2 class="text-center">Search</h2>
    <hr>
    <div class="tourcontainer">
      With a lot of number of products in the store,
      we help you get your products of choice quickly through
      this real-time search system. Click here to search for products.
    </div>`
  },
  {
    element: ".product-grid",
    intro: `<h2 class="text-center">Products</h2>
    <hr>
    <div class="tourcontainer">
      Products in the store would be displayed here. Just browse through.<br>
      When you find the product of your choice, click on the product
      and proceed to adding it to your cart.
    </div>`
  },
  {
    element: ".cart",
    intro: `<h2 class="text-center">Cart</h2>
    <hr>
    <div class="tourcontainer">
      Having found the products of your choice, you can add the products to your cart here.<br>
      Click on the cart icon to make payment.<br>
      Note that we presently offer just two means of payment:
      <ol>
        <li><strong>Wallet</strong></li>
        <li><strong>Paystack</strong></li>
      </ol>
    </div>`
  },
  {
    intro: `<h2 class="text-center">
        Got it? Continue Shopping!
      </h2>`
  }
];

export function quickTour() {
  tour.setOptions({
    showBullets: true,
    showProgress: true,
    scrollToElement: true,
    showStepNumbers: true,
    tooltipPosition: "auto",
    steps: tourSteps
  });
  tour.start();
}
