module.exports = {
    "env": {
      "browser": true,
      "es6": true
    },
    "parser": "babel-eslint",
    "extends": "airbnb", // 使用 eslint
    "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
    },
    "rules": {
    }
  };
