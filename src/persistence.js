var registry = require('./registry.js');

/**
 * This module handles saving and restoring the application state
 */
module.exports = {
    'clearSavedState':  clearSavedState,
    'loadSavedState':   loadSavedState,
    'saveCurrentState': saveCurrentState
};

var storageKey = 'flexboard-items';

/**
 * Deletes saved data from the browser's storage
 */
function clearSavedState() {
    localStorage.removeItem(storageKey);
}

/**
 * Returns the previously saved application state
 *
 * @return {object} Collection that was saved, if any
 */
function loadSavedState() {
    return JSON.parse(localStorage.getItem(storageKey));
}

/**
 * Stores the current state of the application so that it can be resumed in the future
 */
function saveCurrentState() {
    var collection = [];

    /**
     * Helper function that parses a DOM node and extracts the relevant information
     */
    var parseNode = function(node) {
        var element = {},
            item;

        if (node === document.body) {
            // Top-most container
            return [].map.call(node.childNodes, parseNode);
        } else if (node.classList.contains('container')) {
            // Parsing a container
            if (node.style.flexDirection) {
                element.direction = node.style.flexDirection;
            }
            if (node.style.flexGrow) {
                element.relativeSize = node.style.flexGrow;
            }
            if (node.childElementCount > 0) {
                element.items = [].map.call(node.childNodes, parseNode);
            }
        } else {
            // Parsing an individual item
            item = registry.getElementForNode(node);
            element.url = node.src;
            if (node.style.flexGrow) {
                element.relativeSize = node.style.flexGrow;
            }
            if (item.updateInterval) {
                element.updateInterval = item.updateInterval;
            }
        }

        return element;
    }

    var collection = parseNode(document.body);

    // Save to local storage
    localStorage.setItem('flexboard-items', JSON.stringify(collection));
}
