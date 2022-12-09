import { store } from "@/store";
import { fabric } from "fabric";

export const ComputedMutator = (module, name, setter) => ({
  get() {
    return store.state[module][name];
  },
  set(value) {
    store.commit(`${module}/${setter}`, value);
  },
});

export const ObjectStorage = {
  get: (key, deafultValue = {}) => {
    let value = deafultValue;
    try {
      let parsedObject = JSON.parse(localStorage.getItem(key));
      if (typeof parsedObject === "object" && parsedObject !== null) {
        value = parsedObject;
      }
    } catch (e) {
      //
    }
    return value;
  },

  set: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const defaultOnTouchStartHandler = fabric.Canvas.prototype._onTouchStart;
fabric.util.object.extend(fabric.Canvas.prototype, {
  _onTouchStart: function (e) {
    var target = this.findTarget(e);
    if (this.allowTouchScrolling && !target && !this.isDrawingMode) {
      return;
    }
    defaultOnTouchStartHandler.call(this, e);
  },
});