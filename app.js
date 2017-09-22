require = require("@std/esm")(module, { esm: "js", cjs: true });
require("./node-dest/app-helpers/promiseUtils");
require("dotenv").config();
require("./startApp");

class Task {
  constructor(id, name, completed) {
    this.id = id;
    this.name = name;
    this.completed = completed;
  }

  setCompleted() {
    this.completed = true;
  }
}

let taskProto = {
  setCompleted() {
    this.completed = true;
  }
};
function createTask(id, name, completed) {
  let result = Object.create(taskProto);
  result.id = id;
  result.name = name;
  result.completed = completed;
  return result;
}
