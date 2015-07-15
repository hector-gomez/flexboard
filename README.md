flexboard
=========

A fully-customizable dashboard implemented using flexbox

**This is still a work in progress**. The goal is to provide a dashboard that displays
information from multiple sources using iframes.

The layout is designed using _flexbox_, hence the name :-)

# Reference

## Working with items and containers

### addContainer(parentContainer, options)

Creates a new container where to put items.

#### parentContainer

Type: **object** _optional_

DOM node where the new container will be created. If not specified, the document body node will be used.

#### options

Type: **object** _optional_

A JSON object containing key-value pairs. Accepted attributes:

* `direction` **string** _optional_
  * The direction in which the items in this container will be displayed
  * Either `row` or `column`
* `relativeSize` **number** _optional_
  * Size of this container in comparison to others in the same parent container.

### addItem(item, container)

Adds a new element to the board.

#### item

Type: **object**

A JSON object representing the item to add to the board. Accepted attributes:

* `url` **string**
  * URL to display
* `updateInterval` **number** _optional_
  * In milliseconds.
  * Enables refreshing this item at the specified rate.
  * Minimum value: 1000 (1 second)
* `relativeSize` **number** _optional_
  * Size of this item in comparison to others in the same container.

**Example:**

```
Flexboard.addItem({
    url: "http://domain.com",
    updateInterval: 25000
});
```

#### container

Type: **object** _optional_

DOM node to which the element will be added. If not set the item will be added to the document's body.

### clear()

Wipes out the current contents of the board.

### getAll()

Returns: **array**

Returns all the items currently in the board.

## Working with collections

### loadCollection(collection, container)

Populates a collection of items to the board.

#### collection

Type: **array**

Array of objects that represent the items and containers to be added.

If the item contains a property named `items` then it is a container.

**Example:**

```
Flexboard.loadCollection([
    {
        url: "http://www.cnn.com",
        updateInterval: 120000
    },
    {
        direction: "column",
        relativeSize: 2,
        items: [
            {
                url: "http://www.bing.com"
            },
            {
                url: "http://www.w3c.org",
                relativeSize: 3
            }
        ]
    }
]);
```

#### container

Type: **object** _optional_

DOM node that will contain the collection. If not specified, the document body will be used.

## Saving and loading state

### clearSavedState()

Removes all the stored data.

### loadSavedState()

Loads the latest saved state, if any. This will effectively change the board's contents.

### saveCurrentState()

Saves the current state. If the browser tab / window is refreshed it will show the current state automatically.

To load this state programmatically use `loadSavedState()`.

# License

**The MIT License (MIT)**

Copyright (c) 2014 - 2015 Héctor Gómez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
