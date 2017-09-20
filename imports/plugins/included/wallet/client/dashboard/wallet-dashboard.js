import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { ReactiveDict } from "meteor/reactive-dict";
import { Accounts } from "/lib/collections";


Template.walletDashboard.onCreated(function () {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.state.setDefault({
      renderTemplate: "home",
      usersWallet: {}
    });
    const usersWallet = Accounts.findOne({_id: Meteor.userId()}).wallet;
    this.state.set("usersWallet", usersWallet);
  });
});

Template.walletDashboard.helpers({
  usersWallet() {
    const instance = Template.instance();
    return instance.state.get("usersWallet");
  },
  showTemplate() {
    const instance = Template.instance();
    return instance.state.get("renderTemplate");
  }
});

Template.walletDashboard.events({
  "click .nav-tabs li"(event, template) {
    const currentTab = $(event.target).closest("li");
    currentTab.addClass("active");
    $(".nav-tabs  li").not(currentTab).removeClass("active");
    template.state.set("renderTemplate", currentTab.data("template"));
  }
});
