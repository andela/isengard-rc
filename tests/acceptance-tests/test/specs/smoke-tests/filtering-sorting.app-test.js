"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
  // browser.getSession().then(function (sessionid) {
  //   browser.sessionID = sessionid.id_;
  // });
});

describe("sorting", function () {
  it("searches for Item and sort by highest or lowest price and filter by vendor or price", () => {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));

    const email = "test@test.com";
    const password = "tester";

    const searchQuery = "Reaction";

    browser.pause("5000");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause("5000");
    browser.setValue(getId.retId(eleIds.login_email_fld_id), email);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), password);
    browser.click(eleMap.login_btn);
    browser.pause("5000");

    browser.click(".search .btn");
    browser.pause("3000");
    browser.click("#search-input");
    browser.pause("3000");
    browser.setValue("#search-input", searchQuery);
    browser.pause("2000");
    browser.scroll(0, 200);
    browser.click(".filter-search");
    browser.pause("2000");
    browser.click("#price-filter");
    browser.pause("2000");
    browser.click("#ten");
    browser.pause("2000");
    browser.click("#brand-filter");
    browser.pause("3000");
    browser.pause("4000");
    browser.click("#vendor-mac");
    browser.pause("2000");

    expect(browser.getAttribute("div", "fb-integration")).to.exist;
  });
});
