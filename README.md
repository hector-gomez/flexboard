flexboard
=========

A fully-customizable dashboard implemented using flexbox

**This is still a work in progress**. The goal is to provide a dashboard that displays
information from multiple sources using iframes.

The layout is designed using _flexbox_, hence the name :-)

# Reference

## Working with items and containers

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

#### container

Type: **object** _optional_

DOM node to which the element will be added. If not set the item will be added to the document's body.


**Example:**

```
Flexboard.addItem({
    url: "http://domain.com",
    updateInterval: 25000
});
```

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
