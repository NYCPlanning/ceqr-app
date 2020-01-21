## Module Report
### Unknown Global

**Global**: `Ember.onerror`

**Location**: `app/initializers/on-error.js` at line 9

```js
export function initialize() {
  if (shouldThrowOnError) {
    Ember.onerror = function(err) {
      throw err;
    };
```
