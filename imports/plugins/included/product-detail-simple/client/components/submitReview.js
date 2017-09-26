import React, { Component, PropTypes } from "react";
import Logger from "/client/modules/logger";
import { Meteor } from "meteor/meteor";
import ReactStars from "react-stars";
import moment from "moment";

// import "react-star-rating/dist/css/react-star-rating.min.css";

class SubmitReviewContainer extends Component {
  constructor() {
    super();
    this.ratingChanged = this.ratingChanged.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.rating = 0;
    this.state = {
      rating: 0
    };
  }
  ratingChanged(newRating) {
    this.rating = newRating;
  }
  submitReview() {
    if (Number(this.rating) <= 0) return;
    const productId = this.props.product._id || "notexisting";
    const email = Meteor.user().emails[0] || {};
    let userName = Meteor.user().username || email.address || "Anonymous";
    userName = userName || "Anonymous";
    const time = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
    const review = {
      productId: productId,
      userName: userName,
      stars: Number(this.rating),
      time: time,
      comment: this.review.value
    };
    if (productId) {
      Meteor.call("products/submitReview", productId, review, (error) => {
        if (error) {
          Logger.error("Failed to add to cart.", error);
        }
        return true;
      });
    }
    // Reset component state
    this.review.value = "";
    this.setState({
      rating: 0
    });
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-8">
            <div className="row">
              <div>Rate this product</div>
              <div className="col" id="reviewStars">
              <ReactStars name="react-stars"  value={this.state.rating} size={24}
                onChange={this.ratingChanged} count={5}
              />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-12 col-lg-8">
                <label htmlFor="exampleTextarea">Write a review</label>
                <textarea ref={(review) => { this.review = review; }} className="form-control" id="exampleTextarea" rows="3"/>
                <div>
                  <br/>
                  <button type="submit" onClick={this.submitReview} className="btn btn-primary">Submit Review</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SubmitReviewContainer.propTypes = {
  product: PropTypes.object,
  productId: PropTypes.string
};

export default SubmitReviewContainer;
