import onfire from "onfire.js";

let OnFireMixin = {
  bindingEvents: {},

  on: function (eventName, callback) {
    let eventObject = onfire.on(eventName, callback);

    if (!this.bindingEvents[this.__ONFIRE__]) {
      this.bindingEvents[this.__ONFIRE__] = {};
    }
    this.bindingEvents[this.__ONFIRE__][eventObject[1]] = eventObject;

    return eventObject;
  },

  un: function (eventObject) {
    if (this.bindingEvents[this.__ONFIRE__]) {
      delete this.bindingEvents[this.__ONFIRE__][eventObject[1]];
      return onfire.un(eventObject);
    }
    return true;
  },

  fire: function (eventName, data) {
    return onfire.fire(eventName, data);
  },

  componentDidMount: function () {
    if (!this.__ONFIRE__) {
      throw new Error(
        "Component should has attribute __ONFIRE__ if you want to use OnFireMixin."
      );
    }
  },
  // when unmont, un all the event
  componentWillUnmount: function () {
    if (this.bindingEvents[this.__ONFIRE__]) {
      for (let key in this.bindingEvents[this.__ONFIRE__]) {
        this.un(this.bindingEvents[this.__ONFIRE__][key]);
      }
    }
  },
};

export default OnFireMixin;
