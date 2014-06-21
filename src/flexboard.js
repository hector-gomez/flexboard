var dom = require('./dom.js');
var persistence = require('./persistence.js');
var registry = require('./registry.js');

module.exports = (function () {
    "use strict";

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
                console.error("No interval applied - updateInterval must be greater than 1000 (1 second)");
            } else {
                newItem.updateInterval = item.updateInterval;
                newItem.updateIntervalHandle = window.setInterval(function (iframe) {
                    iframe.src = "about:blank";
                    iframe.src = item.url;
                }, newItem.updateInterval, newItem.domNode);
            }
        }

        // Add the item to the collection
        registry.add(newItem);

        return newItem;
    }

    /**
     * Removes an element from the board
     *
     * @param {object} item Item to be deleted
     * @return {boolean} Success removing the item
     */
    function removeItem(item) {
        if (typeof item !== "object") {
            console.error("Invalid parameter, must be an object:", item);
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
     * Wraps the item into a container so that more items can be added in that location
     *
     * @param {object} item The item that will be "transformed" into a container
     * @return {object} The resulting container
     */
    function convertToContainer(item) {
        if (typeof item !== "object" || !item.domNode) {
            console.error("Invalid parameter:", item);
            return false;
        }

        //TODO place in the same position
        var newContainer = dom.addContainer(item.domNode.parentElement);
        newContainer.appendChild(item.domNode);

        return newContainer;
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
                    direction: item.direction || "row",
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
        var storedCollection = JSON.parse(localStorage.getItem("flexboard-items"));
        if (storedCollection) {
            clear();
            loadCollection(storedCollection);
        }
    }

    /**
     * Deletes saved data from the browser's storage
     */
    function clearSavedState() {
        localStorage.removeItem("flexboard-items");
    }

    // Initialize the application once the body is ready
    window.onload = init;

    // Exposed API
    return {
        addItem:            addItem,
        clear:              clear,
        clearSavedState:    clearSavedState,
        convertToContainer: convertToContainer,
        getAll:             registry.getAll,
        loadCollection:     loadCollection,
        loadSavedState:     loadSavedState,
        removeItem:         removeItem,
        saveCurrentState:   persistence.saveCurrentState,
        stopUpdating:       stopUpdating,
    };
})();
