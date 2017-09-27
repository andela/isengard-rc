"use strict";
const yaml = require("js-yaml");
const fs   = require("fs");
const expect = require("chai").expect;
const getId = require("../../../lib/get-elements.js");
const dotenv = require("dotenv");

dotenv.config();
beforeEach(function () {
  const browserConfig = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/settings.yml", "utf8"));
  const baseUrl = browserConfig.base_url.toString();
  browser.url(baseUrl);
});

describe("fund wallet test", function () {
  it("verifies a user is able to signup, navigate to wallet dashboard and fund wallet", function () {
    const eleMap = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-map.yml", "utf8"));
    const eleIds = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/elements/element-ids.yml", "utf8"));
    const usrData = yaml.safeLoad(fs.readFileSync("./tests/acceptance-tests/config/user-data.yml", "utf8"));

    // default to process env if we've got that
    const guestEmail = process.env.REACTION_EMAIL || usrData.register_email;
    const guestPassword = process.env.REACTION_AUTH || usrData.register_pw;
    const balanceText =  "My Wallet Balance ( ₦5,000.00)";
    const guestName = "Guest";
    const amount = 5000;

    browser.pause("5000");
    browser.click(eleMap.register_dropdown_btn);
    browser.pause(5000);
    browser.click(eleMap.register_form);
    browser.pause(5000);
    browser.setValue(getId.retId(eleIds.login_email_fld_id), guestEmail);
    browser.setValue(getId.retId(eleIds.login_pw_fld_id), guestPassword);
    browser.click(eleMap.register_btn);
    browser.pause("5000");
    browser.click(eleMap.current_user_dropdown);
    browser.pause("5000");
    browser.waitForExist(eleMap.wallet_menu);
    browser.click(eleMap.wallet_menu);
    browser.pause("5000");
    browser.waitForExist(eleMap.fund_wallet_menu);
    browser.click(eleMap.fund_wallet_menu);
    browser.pause("5000");
    browser.waitForExist("input[name='payerName']");
    browser.setValue("input[name='payerName']", guestName);
    browser.waitForExist("input[name='payerEmail']");
    browser.setValue("input[name='payerEmail']", guestEmail);
    browser.waitForExist("input[name='amount']");
    browser.setValue("input[name='amount']", amount);
    browser.pause(2000);
    browser.click("#complete-order");
    browser.pause(10000);

    const frameId = getId.getElemById("iframe").value;
    browser.frame(frameId);
    browser.setValue(getId.customRetId(eleIds.cardnumber_id), process.env.cardNumber);
    browser.setValue(getId.customRetId(eleIds.expiry_id), process.env.expiryDate);
    browser.setValue(getId.customRetId(eleIds.cvv_id), process.env.cvv);
    browser.click("#pay-btn");
    browser.pause(5000);
    browser.switchTab();
    browser.pause(5000);
    expect(browser.getText(".dashboard-wallet-balance")).to.equal(balanceText);
  });
});
