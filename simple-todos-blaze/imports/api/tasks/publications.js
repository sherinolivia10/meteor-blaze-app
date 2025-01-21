import { Meteor } from "meteor/meteor";
import { Tasks } from "../indexCollections";

Meteor.publish("allTasks", function () {
  return Tasks.find({}, { sort: { createdAt: -1 } });
});

Meteor.publish("taskById", function (_id) {
  check(_id, String);
  return Tasks.find({ _id }); 
});
