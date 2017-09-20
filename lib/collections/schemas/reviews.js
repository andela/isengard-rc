import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
 * Reviews Schema
 */
export const Reviews = new SimpleSchema({
  productId: {
    type: String,
    optional: false
  },
  userName: {
    type: String,
    optional: false
  },
  comment: {
    type: String,
    optional: true
  },
  stars: {
    type: Number,
    decimal: true,
    optional: false
  },
  time: {
    type: String,
    optional: false
  }
});
