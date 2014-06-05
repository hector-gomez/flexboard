var Flexboard = (function () {
    "use strict";

    var container,
        items = [];

    /**
     * Give value to all variables and initialize event listeners
     */
    function init() {
        container = document.getElementById("container");
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
     * @return {object} The new item, which extends the original one
     */
    function addItem(item) {
        var iframe = document.createElement("iframe");
        var newItem = {};

        // Populate the values
        iframe.src = item.url;
        iframe.className = "item";

        // Add the new element
        container.appendChild(iframe);

        // Set the refresh rate, if necessary
        if (item.updateInterval) {
            if (item.updateInterval < 1000) {
                console.error("No interval applied - updateInterval must be greater than 1000 (1 second)");
            } else {
                newItem.updateInterval = item.updateInterval;
                newItem.updateIntervalHandle = window.setInterval(function () {
                    iframe.src = "about:blank";
                    iframe.src = item.url;
                }, item.updateInterval);
            }
        }

        // Add the item to the collection
        newItem.id = item.id || generateItemId();
        newItem.url = item.url;
        newItem.domNode = iframe;
        items.push(newItem);

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
            stopUpdating(item.id);
        }

        // Remove the element from the view
        container.removeChild(item.domNode);

        // Remove the item from the collection
        items.splice(items.indexOf(item), 1);

        return true;
    }

    /**
     * Ceases to automatically update an item
     *
     * @param {number} itemId Unique identifier of the desired item
     * @return {boolean} Success stopping the updates
     */
    function stopUpdating(itemId) {
        if (!items[itemId] || !items[itemId].updateIntervalHandle) {
            console.warn("Tried to stop updates on an item that doesn't exist or doesn't have updates");
            return false;
        }
        window.clearInterval(items[itemId].updateIntervalHandle);
        return true;
    }

    /**
     * Removes all items from the board
     */
    function clear() {
        for (var i = items.length - 1; i >= 0; i--) {
            removeItem(items[i]);
        };
    }

    /**
     * Populates a collection of items to the board
     *
     * @param {array} collection Array of objects that represent the items to be added
     */
    function loadCollection(collection) {
        clear();
        collection.forEach(addItem);
    }

    /**
     * Retrieves an item from the internal collection
     *
     * @param {number} itemId Unique identifier of the desired item
     * @return {object} The requested item, or null if not found
     */
    function getItem(itemId) {
        for (var i = 0; i < items.length; i++) {
            if (items[i]["id"] === itemId) {
                return items[i];
            }
        };
        return null;
    }

    /**
     * Retrieves all the items in the internal collection
     *
     * @return {array} All the items in the internal collection
     */
    function getAllItems() {
        return items;
    }

    /**
     * Helper function that generates a unique random id that can be used for storing items
     *
     * @return {number} Unique identifier
     */
    function generateItemId() {
        var id;
        do {
            id = Math.floor(Math.random() * 10000000000);
        } while(items[id]);
        return id;
    }

    /**
     * Stores the current state of the application so that it can be resumed in the future
     */
    function saveCurrentState() {
        var collection = [];

        // Save only the relevant data (exclude DOM nodes and IDs)
        items.forEach(function (item) {
            collection.push({
                "url": item.url,
                "updateInterval": item.updateInterval
            });
        });

        // Save to local storage
        localStorage.setItem("flexboard-items", JSON.stringify(collection));
    }

    /**
     * Returns the application to the previously saved state
     */
    function loadSavedState() {
        var storedCollection = JSON.parse(localStorage.getItem("flexboard-items"));
        loadCollection(storedCollection);
    }

    // Initialize the application once the body is ready
    window.onload = init;

    // Exposed API
    return {
        addItem:            addItem,
        clear:              clear,
        getAllItems:        getAllItems,
        getItem:            getItem,
        loadCollection:     loadCollection,
        loadSavedState:     loadSavedState,
        removeItem:         removeItem,
        saveCurrentState:   saveCurrentState,
        stopUpdating:       stopUpdating,
    };
})();
