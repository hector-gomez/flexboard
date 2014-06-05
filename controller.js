var Flexboard = (function () {

    var container;

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
            item.updateIntervalHandle = window.setInterval(function () {
                iframe.src = "about:blank";
                iframe.src = item.url;
            }, item.updateInterval);
        }
    }

    // Initialize the application once the body is ready
    window.onload = init;

    // Exposed API
    return {
        addItem: addItem
    };
})();
