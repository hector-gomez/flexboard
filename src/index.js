var dom = require('./dom.js');
var persistence = require('./persistence.js');
var registry = require('./registry.js');

/**
 * Main module and the application's entry point
 */
 module.exports = {
    'addItem':              addItem,
    'clear':                clear,
    'clearSavedState':      persistence.clearSavedState,
    'convertToContainer':   dom.convertToContainer,
    'getAll':               registry.getAll,
    'loadCollection':       loadCollection,
    'loadSavedState':       loadSavedState,
    'removeItem':           removeItem,
    'saveCurrentState':     persistence.saveCurrentState,
    'stopUpdating':         stopUpdating,
    'version':              '0.0.1'
};

// Initialize the application once the body is ready
window.onload = init;

/**
 * Add a new element to the board
 *
 * @example
 *      Flexboard.addItem({
 *          url: "http://domain.com",
 *          updateInterval: 25000
 *      });
 * @param {object} item Element to be added
 * @param {object} container DOM node to which the element will be added (optional)
 * @return {object} The new item, which extends the original one
 */
function addItem(item, container) {
    var newItem = {
        url: item.url,
        domNode: dom.addItem(item, container)
    };

    // Set the refresh rate, if necessary
    if (item.updateInterval) {
        if (item.updateInterval < 1000) {
            console.error('No interval applied - updateInterval must be greater than 1000 (1 second)');
        } else {
            newItem.updateInterval = item.updateInterval;
            newItem.updateIntervalHandle = window.setInterval(function (iframe) {
                iframe.src = 'about:blank';
                iframe.src = item.url;
            }, newItem.updateInterval, newItem.domNode);
        }
    }

    // Add the item to the collection
    registry.add(newItem);

    return newItem;
}

/**
 * Removes all items from the board
 */
function clear() {
    var items = registry.getAll();
    for (var i = items.length - 1; i >= 0; i--) {
        removeItem(items[i]);
    };
}

/**
 * Give value to all variables and initialize event listeners
 */
function init() {
    // Initialize the DOM
    dom.init();
    // Replay the saved state
    loadSavedState();
}

/**
 * Populates a collection of items to the board
 *
 * @param {array} collection Array of objects that represent the items to be added
 * @param {object} container DOM node that will contain the collection (optional)
 */
function loadCollection(collection, container) {
    var newContainer;
    collection.forEach(function (item) {
        if (item.items) {
            // Container with nested items
            newContainer = dom.addContainer(container, {
                direction: item.direction || 'row',
                relativeSize: item.relativeSize
            });
            loadCollection(item.items, newContainer);
        } else {
            // Individual item
            addItem(item, container);
        }
    });
}

/**
 * Returns the application to the previously saved state
 */
function loadSavedState() {
    var storedCollection = persistence.loadSavedState();
    if (storedCollection) {
        clear();
        loadCollection(storedCollection);
    }
}

/**
 * Removes an element from the board
 *
 * @param {object} item Item to be deleted
 * @return {boolean} Success removing the item
 */
function removeItem(item) {
    if (typeof item !== 'object') {
        console.error('Invalid parameter, must be an object:', item);
        return false;
    }

    // Stop updates,if necessary
    if (item.updateIntervalHandle) {
        stopUpdating(item);
    }

    // Remove the element from the view
    dom.removeItem(item);

    // Remove the item from the collection
    registry.remove(item);

    return true;
}

/**
 * Ceases to automatically update an item
 *
 * @param {object} item Item that must stop refreshing its content
 * @return {boolean} Success stopping the updates
 */
function stopUpdating(item) {
    if (!item.updateIntervalHandle) {
        console.warn("Tried to stop updates on an item that doesn't exist or doesn't have updates");
        return false;
    }
    window.clearInterval(item.updateIntervalHandle);
    return true;
}
