import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import {Reviews} from "/lib/collections";


/**
 * Reaction Product Methods
 */

Meteor.methods({
  "products/submitReview": function (productId, review) {
    check(productId, String);
    check(review, Object);
    Reviews.insert(review);
  }
});
