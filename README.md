# Drawer Swipe

A minimalistic swipe gesture library for emulating Android drawer swipe as closely as possible. Compatible with ES6, RequireJS, or plain JavaScript.

Even works for emulating notification swipes, card swipes, etc.

The library works by defining a touch area element, and letting the user handle the transformations that occur when the element is touched and swiped. The library can be implemented with a variety of CSS frameworks as well as customized components.

## Getting Started

### Install the library
  * with [bower](http://bower.io): ```bower install drawer-swipe```
  * with [npm](https://www.npmjs.com): ```npm install drawer-swipe```

### Load the library:

* Browser Global
```javascript
var swiper = new DrawerSwipeRecognizer('#drawer');
```

* AMD
```javascript
define(['DrawerSwipeRecognizer'] , function (DrawerSwipeRecognizer) {
  var swiper = new DrawerSwipeRecognizer('#drawer');
});
```

* CommonJS
```javascript
var DrawerSwipeRecognizer = require('DrawerSwipeRecognizer');
var swiper = new DrawerSwipeRecognizer('#drawer');
```

* ES2015 Modules (after npm install)
```javascript
import {DrawerSwipeRecognizer} from 'drawer-swipe-recognizer';
var swiper = new DrawerSwipeRecognizer('#editor');
```
