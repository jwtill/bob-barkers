import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import AmazonService from './js/amazonService.js';
import Player from './js/gameLogic.js';

let player1 = new Player(3, 0, 0); 


function displayErrors(error) {
  $("#errors").html(error);
}

function refreshHearts() {
  if (player1.hearts === 2) {
    $(".heart-3").addClass("hidden");
    $("#wrong-guess").html("You went over, and lost a heart!");
  } else if (player1.hearts === 1) {
    $(".heart-2").addClass("hidden");
  }
}

function displayProduct(productArray, i) {
  $("#active-game").removeClass("hidden");
  $("#intro").addClass("hidden");
  $("#score").html(player1.points);
  refreshHearts();
  $("#item-title").html(productArray[i].title);
  $(".item-image").attr('src', `${productArray[i].image}`)
}

function displayPrice(userGuess, price) {
  let points = player1.guessCheck(userGuess);
  $("#actual-price").html("$"+price);
  $("#user-guess").html("$"+userGuess);
  $("#won-points").html(points);
  refreshHearts();
  $("#active-game").addClass("hidden");
  $("#result").removeClass("hidden"); 
}

$(document).ready(function() { 
  let productArray;
  let i = 0;
  $("#start-game").on('click', function() {

    $("#video")[0].src += "?autoplay=1";

    $("#intro").hide();
    $(".load-screen").fadeIn();
    setTimeout(function(){$(".load-screen").fadeOut();}, 3000);
    setTimeout(function(){$("#intro").show();}, 3000);

    let searchCategory = $("input:radio[name=searchCategory]:checked").val(); // Add in Category selection
    AmazonService.makeAPICall(searchCategory).then(function(response) {
      if (response instanceof Error) {
        throw Error(`There was an unexpected error: ${response.message}`);
      }
      productArray = response.bestsellers;
      displayProduct(productArray, i);

    }) .catch(function(error) {
      displayErrors(error.message);
    });
  });

  $("#guess-button").on('click', function(){ // for submitting guessed price for each item
    let userGuess = $("#price-guess").val();
    $("#price-guess").val("");
    let price = productArray[i].price.value;
    displayPrice(userGuess, price);
  });

  $("#new-product").on('click', function(){ // for switching out the product and hiding the results screen
    i ++; // global variable increments every time time the function is called
    $("#results-screen").hide();
    displayProduct(productArray, i);
  });

});