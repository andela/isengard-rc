import { Reviews } from "/lib/collections";

/**
 * Reviews
 */

Meteor.publish("Reviews", function () {
  return Reviews.find({});
});
