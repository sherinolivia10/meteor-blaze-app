import { Meteor } from "meteor/meteor";
import { Tasks } from "../indexCollections";
import { check, Match } from "meteor/check";

Meteor.methods({
  async getAllTasks() {
    const tasks = await Tasks.find().fetch();
    return tasks;
  },

  async getTaskById(_id) {
    const task = await Tasks.findOneAsync(_id);
    if (!task) {
      console.log("task error:", task);
      throw new Meteor.Error("Invalid ID", `Task with ${_id} not found`);
    }
    return { success: true, data: task };
  },

  async createNewTask(taskData) {
    check(taskData, {
      title: String,
      description: String,
      isDone: Boolean,
      updatedAt: Date,
      createdAt: Date,
    });
    const newTask = Tasks.insertAsync({
      ...taskData,
    });
    if (!newTask) {
      throw new Meteor.Error("Create Task Failed", "Failed to create new task");
    }
    return { success: true, data: newTask };
  },

  async updateTask(_id, updateData) {
    check(updateData, {
      title: String,
      description: String,
      updatedAt: Date,
    });

    await Tasks.updateAsync(_id, {
      $set: {
        ...updateData,
      },
    });
    const updatedTask = Tasks.findOneAsync(_id);
    return { success: true, data: updatedTask };
  },
  async updateTaskIsDone(_id, updateIsDone) {
    check(updateIsDone, {
      isDone: Boolean,
      updatedAt: Date,
    });
    const updateTaskIsDone = Tasks.updateAsync(_id, {
      $set: {
        ...updateIsDone,
      },
    });
    if (!updateTaskIsDone) {
      return Meteor.Error("error update", "cannot update task's status");
    }
    const result = Tasks.findOneAsync(_id);
    return { success: true, data: result };
  },
  async deleteTask(_id) {
    const deleteTask = Tasks.removeAsync(_id);
    if (!deleteTask) {
      return Meteor.Error("error delete", "cannot delete task");
    }
    return { success: true, message: "Task Deleted!" };
  },
});
