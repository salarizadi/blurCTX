# blurCTX
Custom jQuery context menu

```js
const ctxItems = [
  {
    content: `Item 1`,
    events: {
      click: (e) => console.log(e, "Item 1 Clicked")
    }
  },
  { content: `Item 2` },
  { content: `Item 3` },
  { content: `Item 4` },
  {
    content: `Item 5`,
    divider: "top" // top, bottom, top-bottom
  }
];
```

### Attach the context menu to the target element.
```js
const ctx = new blurCTX({
  target    : ".item", // $(".item")
  mode      : "light", // Dark & Light
  menuItems : ctxItems
});
```

### Initialize the context menu. Done.
```js
ctx.init();
```
