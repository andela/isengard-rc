"use strict";
const yaml = require("js-yaml");
const fs = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");

beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
  // browser.getSession().then(function (sessionid) {
  // browser.sessionID = sessionid.id_;
  // });
});

describe("test for cancel order", function () {
  it("should be able to cancel placed order", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    // default to process env if we've got that
    const adminEmail = process.env.REACTION_EMAIL || usrData.admin_email;
    const adminPassword = process.env.REACTION_AUTH || usrData.admin_pw;
    // const adminUserName = process.env.REACTION_USER || usrData.admin_user;
    browser.pause("3000");
    browser.click(eleMap.login_dropdown_btn);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), adminEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), adminPassword);
    browser.click(eleMap.login_btn);
    browser.pause("3000");

    // Make Order
    browser.waitForExist(".product-grid-item-images");
    browser.click(".product-grid-item-images");
    browser.pause("6000");
    browser.waitForExist(eleMap.red_option);
    browser.click(eleMap.red_option);
    browser.pause("3000");
    browser.click("//button[text()='Add to cart']");
    browser.pause("300");
    browser.click("//span[text()='Checkout now']");
    browser.pause("3000");
    browser.click("//span[text()='Standard']");
    browser.pause("3000");
    browser.waitForExist("//span[text()='Example Payment']");
    browser.click("//span[text()='Example Payment']");
    browser.pause(2000);
    browser.setValue("input[name='cardNumber']", eleMap.payer_cardNumber);
    browser.click("select[name='expireMonth']");
    browser.click("option[value='1']");
    browser.pause(2000);
    browser.click("select[name='expireYear']");
    browser.pause(2000);
    browser.click("option[value='2018']");
    browser.pause("3000");
    browser.setValue("input[name='cvv']", eleMap.cvv);
    browser.pause(2000);
    browser.click("#btn-complete-order");
    browser.pause("3000");
    browser.waitForExist("button[name='cancel']");
    // Cancel Order
    browser.click("button[name='cancel']");
    browser.pause("5000");
    browser.click(eleMap.confirm_cancel_order);
    browser.pause("5000");
    expect(browser.getText("#order-status")).to.equal("Your order is now canceled.");
  });
});

