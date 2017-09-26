"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Share on social", function () {
  it("should open a window for sharing a product on facebook and twitter", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    browser.waitForExist(".product-grid-item-images");
    browser.pause("3000");
    browser.click(".product-grid-item-images");
    browser.pause("3000");
    browser.click("#facebookShare");
    browser.pause("3000");
    browser.click("#twitterShare");
    browser.pause("3000");
    // expect(browser.getText(".comment")).to.equal(adminUserName);
  });
});
