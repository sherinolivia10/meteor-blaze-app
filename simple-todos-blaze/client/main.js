import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";

import "./main.html";
import { Meteor } from "meteor/meteor";
import { Tasks } from "../imports/api/indexCollections";

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   "click button"(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

// Template.world.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.world.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });
// Template.world.events({
//   "click button"(event, instance) {
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });

Template.tasks.helpers({
  tasks() {
    return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  taskStatus() {
    return this.isDone === true ? "completed" : "ongoing";
  },
  taskChecked() {
    return this.isDone ? "checked" : "";
  },
  taskMessage() {
    return Template.instance().message.get();
  },
});

Template.tasks.events({
  "submit #newTaskForm"(event) {
    event.preventDefault();
    const taskTitle = event.target.taskTitle.value;
    const taskDesc = event.target.taskDesc.value;
    const instance = Template.instance();
    Meteor.call(
      "createNewTask",
      {
        title: taskTitle,
        description: taskDesc,
        isDone: false,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      (error, result) => {
        if (error) {
          console.log("Error", error);
          instance.message.set(`Error: ${error.reason}`);
        } else {
          instance.message.set(`Task created successfully!`);
          event.target.reset();
        }
        setTimeout(() => {
          instance.message.set("");
        }, 2000);
      }
    );
  },
  "click .taskCheckbox"(event) {
    event.preventDefault();
    const instance = Template.instance();
    Meteor.call(
      "updateTaskIsDone",
      this._id,
      {
        isDone: !this.isDone,
        updatedAt: new Date(),
      },

      (error, result) => {
        if (error) {
          console.log("Error", error);
          instance.message.set(`Error: ${error.reason}`);
        } else {
          instance.message.set(`Task status updated successfully!`);
        }
        setTimeout(() => {
          instance.message.set("");
        }, 2000);
      }
    );
  },
  "click .editButton"(event, instance) {
    event.preventDefault();
    const taskElement = event.currentTarget.closest("li");
    const editForm = taskElement.querySelector(".updateTask");

    if (editForm) {
      editForm.classList.toggle("hidden");
    }
  },
  "submit .updateTask"(event) {
    event.preventDefault();
    const taskTitle = event.target.editTitle.value;
    const taskDesc = event.target.editDesc.value;
    const taskId = event.target.id.replace("form", "");
    const instance = Template.instance();
    Meteor.call(
      "updateTask",
      taskId,
      {
        title: taskTitle,
        description: taskDesc,
        updatedAt: new Date(),
      },
      (error, result) => {
        if (error) {
          console.log("Error", error);
          instance.message.set(`Error: ${error.reason}`);
        } else {
          instance.message.set(`Task updated successfully!`);
          event.target.reset();
        }
        setTimeout(() => {
          instance.message.set("");
        }, 2000);
      }
    );
  },
  "click .deleteButton"(event) {
    console.log("test console log");
    event.preventDefault();
    const instance = Template.instance();
    const taskId = event.target.id;
    console.log("task id:", taskId);
    Meteor.call("deleteTask", taskId, (error, result) => {
      if (error) {
        console.log("Error", error);
        instance.message.set(`Error: ${error.reason}`);
      } else {
        instance.message.set(`Task deleted successfully!`);
      }
      setTimeout(() => {
        instance.message.set("");
      }, 2000);
    });
  },
});

Template.tasks.onCreated(function () {
  this.subscribe("allTasks");
  this.message = new ReactiveVar("");
});
