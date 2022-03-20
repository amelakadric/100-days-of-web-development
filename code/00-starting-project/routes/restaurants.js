const express = require("express");
const resData = require("../util/restaurant-data");
const uuid = require("uuid");

const router = express.Router();

router.get("/restaurants", function (req, res) {
  let order = req.query.order;
  let nextOrder = "desc";

  if (order !== "asc" && order !== "desc") {
    order = "asc";
  }

  if (order === "desc") {
    nextOrder = "asc";
  }

  const storedRestaurants = resData.getStoredRestaurants();

  storedRestaurants.sort(function (res1, res2) {
    if (
      (order !== "asc" && res1.name > res2.name) ||
      (order !== "desc" && res1.name < res2.name)
    ) {
      return 1;
    }
    return -1;
  });

  res.render("restaurants", {
    numberOfRestaurants: storedRestaurants.length,
    restaurants: storedRestaurants,
    nextOrder: nextOrder,
  });
});

router.get("/restaurants/:id", function (req, res) {
  const restaurantId = req.params.id;

  const storedRestaurants = resData.getStoredRestaurants();

  for (const restaurant of storedRestaurants) {
    if (restaurant.id === restaurantId) {
      return res.render("restaurant-detail", {
        restaurant: restaurant,
      });
    }
  }

  res.status(404).render("404");
});

router.post("/recommend", function (req, res) {
  const restaurant = req.body;
  restaurant.id = uuid.v4();
  const storedRestaurants = resData.getStoredRestaurants();
  storedRestaurants.push(restaurant);

  resData.storedRestaurants(storedRestaurants);
  res.redirect("/confirm");
});

router.get("/confirm", function (req, res) {
  res.render("confirm");
});

router.get("/index", function (req, res) {
  res.render("index");
});

router.get("/recommend", function (req, res) {
  res.render("recommend");
});

module.exports = router;
