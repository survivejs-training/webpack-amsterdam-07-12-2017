# Webpack - From Apprentice to Master

* [Slides - From Apprentice to Journeyman](https://presentations.survivejs.com/webpack-from-apprentice-to-journeyman/)
* [Slides - From Journeyman to Master](https://presentations.survivejs.com/webpack-from-journeyman-to-master/)
* [Book](https://survivejs.com/webpack/)

## Schedule

**07.12.2017**

* 09:00-12:00 - Get started with the first set
* 12:00-13:00 - Lunch
* 13:00-17:00 - Finish the first set + possible bonus topics

**08.12.2017**

* 09:00-12:00 - Get started with the second set
* 12:00-13:00 - Lunch
* 13:00-15:00 - Finish the second set + free form
* 15:00-17:00 - Tobias

## Goals

* vue-cli, stuck with plugins -> Understand how the plugins work
* How to extend plugins and how to write your own
* How to write webpack configuration
* Understand fundamentals of webpack
* create-react-app - understand how the configuration works
* How to use webpack in CI environment

## Examples

### Loader

```javascript
module.exports = input => input + input;
```

### `resolve`

```javascript
import 'foo'; // foo.jsx

/* ... */
```

```javascript
const config = {
  resolve: {
    alias: {
      foo: path.join(__dirname, 'foo'),
    },
    extensions: [
      '.jsx', '.js',
    ],
    modules: [
      /*...*/
      'own_modules',
      'node_modules'
    ],
  },
};
```

### Loader Order

```javascript
use: ["style-loader", "css-loader"]
```

read as

```
styleLoader(cssLoader(cssFile))
```

1. `enforce: "pre"` - Linters
2. Regular loaders
3. `enforce: "post"` - Code coverage
