import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
import swal from "sweetalert2";
import { WalletTransfer } from "../../lib/collections/schemas";
import * as walletHelpers from "../../lib/api/walletHelpers";
import { Accounts } from "/lib/collections";

import "./wallet-dashboard.html";

Template.transfer.helpers({
  WalletTransfer() {
    return WalletTransfer;
  }
});

AutoForm.addHooks("wallet-transfer-form", {
  onSubmit(doc) {
    const template = this.template;
    swal({
      title: "Are you sure?",
      text: "You will not be able to reverse this action!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, Transfer it!",
      html: false
    }).then(() => {
      const usersWallet = Accounts.findOne({_id: Meteor.userId()}).wallet;
      if (doc.amount > usersWallet.balance) {
        Alerts.toast("Insufficient Balance", "error");
        walletHelpers.uiEnd(template, "Resend");
        return false;
      }
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
      if (Meteor.user().emails[0].address === doc.payeeEmail) {
        Alerts.toast("You can not transfer to yourself", "error");
        walletHelpers.uiEnd(template, "Resend");
        return false;
      }
      Meteor.call("wallet/sendFund", doc.amount, doc.payeeEmail, (err, transaction) => {
        if (err) {
          walletHelpers.handleSubmitError(template, err);
          walletHelpers.uiEnd(template, "Resend");
        } else {
          Alerts.toast(`Funds successfully sent to ${transaction.to}`);
          walletHelpers.uiEnd(template, "Transfer Now");
          this.resetForm();
        }
      });
    }).catch(() => {
      walletHelpers.uiEnd(template, "Transfer Now");
    });
    return false;
  }
});
