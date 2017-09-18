import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import * as Collections from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";

Meteor.methods({

  /**
   * wallet/withdrawFund
   * @description debits user account
   * @param {String} userId - id of user to be debited
   * @param {Number} amount - to be debited
   * @return {Number} amount debited
   */
  "wallet/withdrawFund"(userId, amount) {
    check(userId, String);
    check(amount, Number);
    const update = {
      $inc: {
        "wallet.balance": -amount
      }
    };
    Collections.Accounts.update({ userId }, update);
    return amount;
  },

  /**
   * wallet/sentFund
   * @description creates a transaction history
   * for user's wallet being debited
   * @param {String} userId - sender's id
   * @param {Object} transaction - details to be saved
   * @return {void}
   */
  "wallet/sentFund"(userId, transaction) {
    check(transaction, Schemas.SentFunds);
    check(userId, String);
    const update = {
      $push: {
        "wallet.transactions.sent": transaction
      }
    };
    Collections.Accounts.update({ userId }, update);
  },

  /**
   * wallet/receivedFund
   * @description creates a transaction history
   * for user's wallet being credited
   * @param {String} userId - recipient id
   * @param {Object} transaction - details to be saved
   * @return {void}
   */
  "wallet/receivedFund"(userId, transaction) {
    check(transaction, Schemas.ReceivedFunds);
    check(userId, String);
    const update = {
      $push: {
        "wallet.transactions.received": transaction
      }
    };
    Collections.Accounts.update({ userId }, update);
  },

  /**
   * wallet/checkout
   * @description completes user order and debits wallet
   * @param {String} userId - id of user checking out
   * @param {Number} amount - to be debited
   * @param {String} transactionId - transaction unique id
   * @return {Object} transaction details
   */
  "wallet/checkout"(userId, amount, transactionId) {
    check(userId, String);
    check(amount, Number);
    check(transactionId, String);
    const shopOwnerEmail = Collections.Shops.findOne().emails[0].address;
    const query = {
      emails: {
        $elemMatch: {
          address: shopOwnerEmail
        }
      }
    };
    const user = Collections.Accounts.findOne(query);
    const sentTransaction = {
      to: `Payment to ${user.emails[0].address}`,
      transactionId,
      amount,
      date: new Date()
    };

    Meteor.call("wallet/withdrawFund", userId, amount, () => {
      Meteor.call("wallet/sentFund", userId, sentTransaction);
      // Meteor.call("wallet/receivedFund", user._id, receivedTransaction);
    });
    return sentTransaction;
  },

  /**
   * wallet/fundAccount
   * @description updates the user's account balance and creates
   * a transaction history
   * @param {Object} transaction - details to be saved
   * @return {Object} returns the transaction details
   */
  "wallet/fundAccount"(transaction) {
    check(transaction, Schemas.ReceivedFunds);
    transaction.amount = transaction.amount / 100;
    const update = {
      $inc: {
        "wallet.balance": transaction.amount
      }
    };

    Collections.Accounts.update({ _id: Meteor.userId()}, update);
    Meteor.call("wallet/receivedFund", Meteor.userId(), transaction);
    return transaction;
  },

  /**
   * wallet/sendFund
   * @description debits user account, adds the record to transaction
   * history and updates the recipients wallet balance and record
   * @param {Number} amount - to be debited
   * @param {String} email - recipient email
   * @return {Object} transaction details
   */
  "wallet/sendFund"(amount, email) {
    check(amount, Number);
    check(email, String);

    const query = {
      emails: {
        $elemMatch: {
          address: email
        }
      }
    };
    const user = Collections.Accounts.findOne(query);
    if (!user) {
      throw new Meteor.Error("User with that email not found");
    } else {
      const credit = {
        $inc: {
          "wallet.balance": amount
        }
      };
      const sentTransaction = {
        to: `Transfer to ${user.emails[0].address}`,
        transactionId: Random.id(),
        amount,
        date: new Date()
      };
      const receivedTransaction = {
        from: `Transfer from ${Meteor.user().emails[0].address}`,
        transactionId: Random.id(),
        amount,
        date: new Date()
      };

      Meteor.call("wallet/withdrawFund", Meteor.userId(), amount, () => {
        Collections.Accounts.update({_id: user._id }, credit);
        Meteor.call("wallet/sentFund", Meteor.userId(), sentTransaction);
        Meteor.call("wallet/receivedFund", user._id, receivedTransaction);
      });
      return sentTransaction;
    }
  }
});
