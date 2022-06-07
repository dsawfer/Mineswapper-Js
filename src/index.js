import { Model } from "./app/model.js";
import { View } from "./app/view.js";
import { Controller } from "./app/controller.js";

// create view
const view = new View();
// create model
const model = new Model(view);
// create controller
const controller = new Controller(model);

controller.generateBoard(model.currentLevel);
