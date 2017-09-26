"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Product review", function () {
  it("should submit a user review and update the review list", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    browser.waitForExist(".product-grid-item-images");
    // browser.pause("3000");
    browser.click(".product-grid-item-images");
    browser.pause("6000");
    browser.click("//div[@id='reviewStars']/div/span");
    browser.pause("3000");
    browser.click("#exampleTextarea");
    browser.setValue("#exampleTextarea", "Not a very good product");
    browser.pause("6000");
    browser.click("//button[text()='Submit Review']");
    browser.pause("6000");
    expect(browser.getText(".comment")).to.exist;
  });
});
