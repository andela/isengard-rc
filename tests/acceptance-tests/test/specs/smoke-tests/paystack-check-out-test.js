"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("Payment by Paystack", function () {
  it("should be available when a user decides to check out a product", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    // default to process env if we've got that
    const guestEmail = process.env.REACTION_EMAIL || usrData.guest_email;
    const guestPassword = process.env.REACTION_AUTH || usrData.guest_pw;

    // Sign in to application
    browser.pause("5000");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(eleMap.login_email_fld, guestEmail);
    browser.setValue(eleMap.login_pw_fld, guestPassword);
    browser.click(eleMap.login_btn);
    browser.pause(5000);

    // Add a product to cart and checkout with paystack
    browser.waitForExist("#logged-in-display-name");
    browser.click("//div[text()='Basic Reaction Product']");
    browser.pause(6000);
    browser.scroll(0, 300);
    browser.waitForExist(".js-add-to-cart");
    browser.click(eleMap.select_green);
    browser.click(".js-add-to-cart");
    browser.waitForExist(eleMap.checkout_btn);
    browser.click(eleMap.checkout_btn);
    browser.pause("5000");
    browser.scroll(0, 500);
    browser.pause(2000);
    browser.click(eleMap.free_shipping);
    browser.pause("5000");
    browser.click("//span[text()='Paystack Payment']");
    browser.pause(2000);
    browser.setValue("input[name='payerEmail']", "tomipaul95@gmail.com");
    browser.pause(10000);
    browser.click("#completeOrder");
    browser.pause(5000);
    const frameCount = browser.selectorExecuteAsync("//iframe", function (frames, message, callback) {
      const paystackIframe = document.getElementsByTagName("iframe");
      const IframeName = paystackIframe[0].name;
      callback(IframeName);
    }, " iframe on the page");
    browser.frame(frameCount);
    browser.pause(10000);
    browser.setValue(getId.customRetId(eleIds.cardnumber_id), usrData.paystack_visa);
    browser.setValue(getId.customRetId(eleIds.expiry_id), usrData.paystack_exp);
    browser.setValue(getId.customRetId(eleIds.cvv_id), usrData.paystack_cvv);
    browser.click("#pay-btn");
    browser.pause(10000);
    browser.switchTab();
    expect(browser.getText("#orderTitle")).to.equal("Basic Reaction Product Option 2 - Green Tomato");
  });
});
