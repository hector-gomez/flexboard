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
        addItem: addItem
    };
})();
