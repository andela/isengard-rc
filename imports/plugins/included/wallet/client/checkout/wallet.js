/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { ReactiveDict } from "meteor/reactive-dict";
import { Template } from "meteor/templating";
import { Cart, Shops } from "/lib/collections";
import * as walletHelpers from "../../lib/api/walletHelpers";
import { Accounts } from "/lib/collections";

import "./wallet.html";

function uiEnd(template, buttonText) {
  template.$("#btn-complete-order").text(buttonText);
  return template.$("#btn-processing").addClass("hidden");
}

Template.walletPaymentCollapsible.onCreated(function () {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.state.setDefault({
      currentBalance: 0
    });
    const usersWallet = Accounts.findOne({_id: Meteor.userId()}).wallet;
    if (usersWallet.balance > 0) {
      this.state.set("currentBalance", usersWallet.balance);
    }
  });
});

Template.walletPaymentCollapsible.helpers({
  walletBalance() {
    const instance = Template.instance();
    return instance.state.get("currentBalance");
  }
});

Template.walletPaymentCollapsible.events({
  "click #pay-with-wallet": (event) => {
    event.preventDefault();
    const template = this.template;
    const balance = Template.instance().state.get("currentBalance");
    const cartAmount = Number(Cart.findOne().cartTotal());
    const currency = Shops.findOne().currency;

    if (cartAmount > balance) {
      Alerts.toast("Insufficient balance", "error");
      uiEnd(template, "Retry your order");
      return false;
    }
    const transactionId = Random.id();
    Meteor.call("wallet/checkout", Meteor.userId(), cartAmount, transactionId, (err, transaction) => {
      if (err) {
        walletHelpers.handleSubmitError("Oops!!, an error occured, please try again");
        return uiEnd(template, "Retry your order");
      }
      const paymentMethod = {
        processor: "Wallet",
        method: "Wallet",
        transactionId,
        currency: currency,
        amount: transaction.amount,
        status: "passed",
        mode: "authorize",
        createdAt: new Date(),
        transactions: []
      };
      paymentMethod.transactions.push(transaction);
      Meteor.call("cart/submitPayment", paymentMethod);
      Alerts.toast("transaction completed");
    });
    return false;
  }
});


