import React, { Component, PropTypes } from "react";
import { FacebookButton, TwitterButton } from "react-social";

class ShareOnSocial extends Component {
  render() {
    const url = "https://isengard-rc-staging.herokuapp.com/reaction/product/";
    return (
      <div>
        <hr/>
        <div className="row text-center">
          <div className="row">
            <div className="col-xs-6">
              <FacebookButton element={"i"} url={url} appId={127579111312725}>
                <a className="btn btn-block btn-primary">
                  <span className="fa fa-facebook"></span> Share on Facebook
                </a>
              </FacebookButton>
            </div>
            <div className="col-xs-6">
              <TwitterButton element={"i"} url={url}>
                <a className="btn btn-block btn-social btn-info">
                  <span className="fa fa-twitter"></span> Share on Twitter
                </a>
              </TwitterButton>
            </div>
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
