var Flexboard = (function () {
    "use strict";

    var container,
        items = {};

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
     * @return {object} The original item, with added information
     */
    function addItem(item) {
        var iframe = document.createElement("iframe");

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
                item.updateIntervalHandle = window.setInterval(function () {
                    iframe.src = "about:blank";
                    iframe.src = item.url;
                }, item.updateInterval);
            }
        }

        // Add the item to the collection
        item.id = generateItemId();
        item.domNode = iframe;
        items[item.id] = item;

        return item;
    }

    /**
     * Removes an element from the board
     *
     * @param {number} itemId Unique identifier of the desired item
     * @return {boolean} Success removing the item
     */
    function removeItem(itemId) {
        var item = items[itemId];
        if (!item) {
            console.warn("Tried to remove an unexisting item");
            return false;
        }

        // Stop updates,if necessary
        if (item.updateIntervalHandle) {
            stopUpdating(item.id);
        }

        // Remove the element from the view
        container.removeChild(item.domNode);

        // Remove the item from the collection
        delete items[itemId];

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
     * Retrieves an item from the internal collection
     *
     * @param {number} itemId Unique identifier of the desired item
     * @return {object} Item
     */
    function getItem(itemId) {
        return items[itemId];
    }

    /**
     * Helper function that generates a unique random id for storing items
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

    // Initialize the application once the body is ready
    window.onload = init;

    // Exposed API
    return {
        addItem: addItem,
        getItem: getItem,
        removeItem: removeItem,
        stopUpdating: stopUpdating,
    };
})();
