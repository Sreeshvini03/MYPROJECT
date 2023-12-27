const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js"); //bcz we add reviews in listings
const {validateReview,isLoggedIn, isreviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Post Review Route 
//"/listings/:id/reviews" to "/" bcz it is a common path
router.post("/",isLoggedIn, validateReview ,wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn ,isreviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;