import React, { Component, PropTypes } from "react";
import ReactStars from "react-stars";
import { Meteor } from "meteor/meteor";
import { Reviews } from "/lib/collections";

const userReview = (review, index) => {
  return (
    <div className="row" key={index}>
      <hr/>
      <div><strong>{review.userName}</strong></div>
      <div>{review.time}</div>
      <div className="col">
        <ReactStars name="react-stars"  edit={false} size={15} value={review.stars} count={5} />
      </div>
      <div>{review.comment}</div>
    </div>
  );
};

class ProductReviewsContainer extends Component {
  render() {
    const productId = this.props.product._id;
    Meteor.subscribe("Reviews");
    const productReviews = Reviews.find({productId: productId}).fetch();
    const filteredReviews = productReviews.filter(review => review.userName);
    return (
      <div className="pdp column left pdp-left-column">
        <h3>Product Reviews</h3>
        {
          filteredReviews.map((review, index) => {
            return userReview(review, index);
          })
        }
        <hr/>
      </div>
    );
  }
}

ProductReviewsContainer.propTypes = {
  product: PropTypes.object
};

export default ProductReviewsContainer;
