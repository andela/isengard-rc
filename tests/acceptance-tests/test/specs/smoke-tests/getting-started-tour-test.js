"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Quick Tour", function () {
  it("should take the user through a quick walkthrough of the app when the button is clicked", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));

    browser.pause("5000");
    browser.click(eleMap.quick_tour);
    browser.pause(5000);
    browser.click(eleMap.quick_tour_next);
    browser.pause(5000);
    browser.click(eleMap.quick_tour_next);
    browser.pause(5000);
    browser.click(eleMap.quick_tour_next);
    browser.pause(5000);
    browser.click(eleMap.quick_tour_next);
    browser.pause(5000);
    browser.click(eleMap.quick_tour_next);
    browser.pause(5000);
    browser.click(eleMap.quick_tour_next);
    browser.pause(5000);
    browser.click(eleMap.quick_tour_done);
    expect(browser.getAttribute("a", "introjs-button introjs-skipbutton introjs-donebutton")).to.exist;
  });
});
