/** @module tests/helpers/mapbox/mapbox-stub-helpers */

/**
 * associates one or more handlers with a named event within the registeredEvents object.
 * @param {Object} registeredEvents - object hash associating one or more actions handlers to a
 * specific event, which are the object keys.
 * @param {string} event - name of the event to trigger.
 * @param {function} handler - The function to call when event occurs.
 */
const registerEventHandler = function (registeredEvents, event, handler) {
  if (!registeredEvents[event]) {
    registeredEvents[event] = [handler];
  } else {
    registeredEvents[event].push(handler);
  }
};

/**
 * mock an event by calling all handlers associated with an event.
 * @param {Object} registeredEvents - object hash associating one or more actions handlers to a
 * specific event, which are the object keys.
 * @param {string} event - name of the event to trigger.
 * @param {function} data - mock of data resulting from the map event
 */
const simulateEvent = function (registeredEvents, event, data) {
  if (registeredEvents[event]) {
    registeredEvents[event].forEach((eventHandler) => {
      eventHandler(data);
    });
  }
};

export { registerEventHandler, simulateEvent };
