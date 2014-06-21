/**
 * All the functionality needed to interact with the DOM is contained in this module.
 * This includes adding, deleting and splitting elements.
 */
module.exports = {
    addContainer:       addContainer,
    addItem:            addItem,
    convertToContainer: convertToContainer,
    init:               init,
    removeItem:         removeItem
};

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
 * Attach an item to the board
 *
 * @param {object} item Element to be added
 * @param {object} container DOM node to which the element will be added (optional)
 * @return {object} The node that has been added to the DOM to display the provided item
 */
function addItem(item, container) {
    var iframe = document.createElement("iframe");

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

    return iframe;
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
 * Sets the DOM in the desired initial state
 */
function init() {
    // Remove the initial text node
    document.body.removeChild(document.body.childNodes[0]);
}

/**
 * Removes an element from the board
 * If it is the last item remaining in the container, will remove it too
 *
 * @param {object} item Item to be deleted
 */
function removeItem(item) {
    var container = item.domNode.parentElement;

    // Remove the element from the view
    container.removeChild(item.domNode);

    // If the container is empty, delete it (unless it's the body)
    if (container.childElementCount === 0 && container !== document.body) {
        container.parentElement.removeChild(container);
    }
}
