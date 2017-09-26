import React, { Component, PropTypes } from "react";
import { FacebookButton, TwitterButton } from "react-social";

class ShareOnSocial extends Component {
  render() {
    const productHandle = this.props.product.handle || "";
    const url = `https://isengard-rc-staging.herokuapp.com/reaction/product/${productHandle}`;
    return (
      <div>
        <hr/>
        <div className="row text-center">
          <div>
            <FacebookButton element={"i"} url={url} appId={127579111312725}>
              <a className="btn btn-block btn-primary" id="facebookShare">
                <span className="fa fa-facebook"></span> Share on Facebook
              </a>
            </FacebookButton>
            <br/>
            <TwitterButton element={"i"} url={url}>
              <a className="btn btn-block btn-social btn-info" id="twitterShare">
                <span className="fa fa-twitter"></span> Share on Twitter
              </a>
            </TwitterButton>
          </div>
        </div>
      </div>
    );
  }
}


ShareOnSocial.propTypes = {
  product: PropTypes.object
};

export default ShareOnSocial;
