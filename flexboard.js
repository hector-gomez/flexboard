var Flexboard = (function () {
    "use strict";

    var items = [];

    /**
     * Give value to all variables and initialize event listeners
     */
    function init() {
        loadSavedState();
    }

    /**
     * Creates a new container
     *
     * @param {object} parentContainer DOM node where the new container will be created (optional)
     * @param {object} options Set of properties to apply to the new container (direction, size)
     * @return {object} The newly created container
     */
    function addContainer(parentContainer, options) {
        var newContainer = document.createElement("div");
        parentContainer = parentContainer || document.body;
        newContainer.className = "item container";

        if (options && options.direction) {
            newContainer.style.flexDirection = options.direction;
        }

        if (options && options.relativeSize) {
            newContainer.style.flexGrow = options.relativeSize;
        }

        parentContainer.appendChild(newContainer);
        return newContainer;
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
        var iframe = document.createElement("iframe");
        var newItem = {};

        // The body is the default container
        container = container || document.body;

        // Populate the values
        iframe.src = item.url;
        iframe.className = "item";

        // Establish the size, if set
        if (item.relativeSize) {
            iframe.style.flexGrow = item.relativeSize;
        }

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

        var container = item.domNode.parentElement;

        // Stop updates,if necessary
        if (item.updateIntervalHandle) {
            stopUpdating(item);
        }

        // Remove the element from the view
        container.removeChild(item.domNode);

        // Remove the item from the collection
        items.splice(items.indexOf(item), 1);


        // If the container is empty, delete it (unless it's the body)
        if (container.childElementCount === 0 && container !== document.body) {
            container.parentElement.removeChild(container);
        }

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
        var newContainer = addContainer(item.domNode.parentElement);
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
                newContainer = addContainer(container, {
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
     * Retrieves all the items in the internal collection
     *
     * @return {array} All the items in the internal collection
     */
    function getAllItems() {
        return items;
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
        getAllItems:        getAllItems,
        loadCollection:     loadCollection,
        loadSavedState:     loadSavedState,
        removeItem:         removeItem,
        saveCurrentState:   saveCurrentState,
        stopUpdating:       stopUpdating,
    };
})();
