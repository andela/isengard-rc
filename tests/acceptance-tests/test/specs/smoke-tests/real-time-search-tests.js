"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Real Time Search", function () {
  it("should display both prouducts that meet the searched input", function () {
    const inputText = "ep";

    browser.waitForExist(".product-primary-images");
    browser.click(".search-icon");
    browser.waitForExist("input#search-input");
    browser.setValue("input#search-input", inputText);
    browser.waitForExist("div.overlay-title");
    expect(browser.getText("div.overlay-title")).to.contain("ONEPLUS 5");
    expect(browser.getText("div.overlay-title")).to.contain("PRISONBREAK EPISODE 9");
  });

  it("should display prouduct(s) that meet the searched input", function () {
    const inputText = "ba";

    browser.waitForExist(".product-primary-images");
    browser.click(".search-icon");
    browser.waitForExist("input#search-input");
    browser.setValue("input#search-input", inputText);
    browser.waitForExist("div.overlay-title");
    expect(browser.getText("div.overlay-title")).to.contain("BASIC REACTION PRODUCT");
  });
});

