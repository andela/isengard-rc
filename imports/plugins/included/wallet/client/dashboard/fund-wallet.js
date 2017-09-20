import { Template } from "meteor/templating";
import { Meteor } from  "meteor/meteor";
import { WalletFund } from "../../lib/collections/schemas";
import { Paystack } from "/imports/plugins/included/paystack/lib/api/paystack";
import * as walletHelpers from "../../lib/api/walletHelpers";
import "/imports/plugins/included/paystack/lib/api/paystackApi";

import "./wallet-dashboard.html";

let paystackKeys;
let template;
let self;

Template.fund.helpers({
  WalletFundForm() {
    return WalletFund;
  }
});

const payWithPaystack = (response) => {
  const secret = paystackKeys.secret;
  const reference = response.reference;
  if (reference) {
    Paystack.verify(reference, secret, (error, res) => {
      if (error) {
        walletHelpers.handleSubmitError(template, error);
        walletHelpers.uiEnd(template, "Resubmit payment");
      } else {
        const transaction = {
          from: "Paystack credit",
          transactionId: Random.id(),
          amount: res.data.amount,
          date: new Date()
        };
        Meteor.call("wallet/fundAccount", transaction);
        Alerts.toast("Account funded");
        walletHelpers.uiEnd(template, "Pay Now");
        self.resetForm();
      }
    });
  }
};

AutoForm.addHooks("wallet-fund-form", {
  onSubmit(doc) {
    Meteor.call("paystack/getKeys", (err, keys) => {
      if (doc.amount < 0) {
        Alerts.toast("Amount cannot be negative", "error");
        walletHelpers.uiEnd(template, "Resend");
        return false;
      }
      if (doc.amount === 0 || doc.amount === "") {
        Alerts.toast("Please enter amount ", "error");
        walletHelpers.uiEnd(template, "Resend");
        return false;
      }
      self = this;
      paystackKeys = keys;
      template = this.template;
      const amount = doc.amount * 100;
      const key = paystackKeys.public;
      const details = {
        key,
        name: doc.payerName,
        email: doc.payerEmail,
        reference: Random.id(),
        amount,
        callback: payWithPaystack,
        onClose() {
          walletHelpers.uiEnd(template, "Pay Now");
        }
      };
      try {
        PaystackPop.setup(details).openIframe();
      } catch (error) {
        walletHelpers.handleSubmitError(template, error);
        walletHelpers.uiEnd(template, "Pay Now");
      }
    });
    return false;
  }
});
