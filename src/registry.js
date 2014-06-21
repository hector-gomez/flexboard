/**
 * Module in charge of keeping an internal storage of all the items in the board
 */
module.exports = {
    add:                add,
    getAll:             getAll,
    getElementForNode:  getElementForNode,
    remove:             remove
};

// Array containing all the nodes (the actual registry)
var items = [];

/**
 * Stores a new item in the registry
 *
 * @param {object} item Item to store
 */
function add(item) {
    items.push(item);
}

/**
 * Deletes an item from the registry
 *
 * @param {object} item Item to delete
 */
function remove(item) {
    items.splice(items.indexOf(item), 1);
}

/**
 * Retrieves all the items in the internal collection
 *
 * @return {array} All the items in the internal collection
 */
function getAll() {
    return items;
}

/**
 * Retrieves the item that is connected to the provided DOM node
 *
 * @param {object} domNode Element in the DOM tree that is referenced
 * @return {array} The internal item
 */
function getElementForNode(domNode) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].domNode === domNode) {
            return items[i];
        }
    };
    return null;
}
