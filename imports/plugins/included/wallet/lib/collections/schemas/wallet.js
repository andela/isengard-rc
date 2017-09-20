import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const WalletFund = new SimpleSchema({
  payerName: {
    type: String,
    label: "Name"
  },
  payerEmail: {
    type: String,
    label: "Email"
  },
  amount: {
    type: Number,
    label: "Amount"
  }
});

export const WalletTransfer = new SimpleSchema({
  payeeEmail: {
    type: String,
    label: "Email"
  },
  amount: {
    type: Number,
    label: "Amount"
  }
});

