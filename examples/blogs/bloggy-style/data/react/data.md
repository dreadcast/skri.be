---
created: 2015-10-10T17:57:35Z
tags: js,javascript,dev,computing,browser,library,component
---

# React (JavaScript library)

React (sometimes styled React.js or ReactJS) is an open-source JavaScript library
for creating user interfaces that aims to address challenges encountered in
developing single-page applications. It is maintained by Facebook, Instagram and
a community of individual developers and corporations.

## History

React was created by Jordan Walke, a software engineer at Facebook. He was
influenced by XHP, an HTML components framework for PHP.


## Features

### Vanilla JavaScript

Rather than re-inventing the wheel, React makes use of a developer's knowledge
of JavaScript. For example, to output a component for each item in an array, you
can use a vanilla for loop, Array.forEach, or Array.map - rather than a custom
"each" construct. This applies to almost everything about React, which can be
see by viewing React's small API.

React relies on features already available in JavaScript for most of what it
does; this ensures that the React API is as lightweight as possible. This also
allows them to inherit ECMAScript updates without large amounts of wrapper code
that needs to be updated to match, as with many other frameworks and libraries.

### One Way Data Flow

React removes the complexity of two-way data binding by embracing one way data
flow. When the props on a React component are updated, that component is
re-rendered.
