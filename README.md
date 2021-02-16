# smart-set

[![npm](https://img.shields.io/npm/dt/smart-set)](https://www.npmjs.com/package/smart-set)
[![NPM version](https://badge.fury.io/js/smart-set.svg)](https://www.npmjs.com/package/smart-set)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/smart-set)](https://www.npmjs.com/package/smart-set)
[![License](https://img.shields.io/github/license/dbalazs97/smart-set)](https://github.com/dbalazs97/smart-set/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/dbalazs97/smart-set)](https://github.com/dbalazs97/smart-set/issues)
[![GitHub stars](https://img.shields.io/github/stars/dbalazs97/smart-set)](https://github.com/dbalazs97/smart-set/stargazers)

SmartSet is a micro-library for creating a smarter set data structure compatible with Set.

## Install

```shell
npm install smart-set

yarn add smart-set
```


## Import package to the project

### TypeScript

```typescript
import { SmartSet } from "smart-set";
```

### JavaScript/Node

```javascript
let { SmartSet } = require("smart-set");
```

## Usage

The `SmartSet` class extends the `Set` class, so every member of `Set` is available, and compatible with the `Set` interface.

### Constructor
`SmartSet` has two template paramters: 
- `T` is the type of items
- `ID` is the type of the key (must be primitive)

`SmartSet` constructor requires a function that determines the id of an item which should be unique and primitive. The second parameter is a list of items of `T`, which will be the starting data of the set. These items will be unique in the set.
```typescript
import { SmartSet } from "smart-set";

interface Data { id: string };

const mySet = new SmartSet<Data, string>(item => item.id, [{ id: 'id1' }, { id: 'id2' }, { id: 'id1' }]);
```

### Addition
The `add(item: T)` and `addAll(items: T[])` functions add item(s) to the set uniquely by the given id function.
```typescript
mySet.add({ id: 'id3' });
mySet.add({ id: 'id1' });
mySet.addAll([{ id: 'id1' }, { id: 'id4' }, { id: 'id5' }]);
```

### Deletion
The `delete(item: T)` and `deleteId(id: ID)` functions delete an item by the given id function.
The `clear()` function deletes all elements.
```typescript
mySet.delete({ id: 'id3' });
mySet.deleteId('id1');
mySet.clear();
```

### Containment
The `has(item: T): boolean` and `hasId(id: ID): boolean` check whether an item is part of the set by the given id function.
```typescript
mySet.has({ id: 'id3' }) === false;
mySet.hasId('id1') === true;
```

### Iteration
`SmartSet` is iterable and has the `keys(): IterableIterator<ID>`, `values(): IterableIterator<T>` and `entries(): IterableIterator<[ID, T]>` functions for iterating the set. Keys are the values of the `ID` type.
```typescript
const mySet = new SmartSet<Data, string>(item => item.id, [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }]);

[...mySet.keys()] === ['id1', 'id2', 'id3'];

[...mySet.values()] === [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }];

[...mySet.entries()] === [['id1', { id: 'id1' }], ['id2', { id: 'id2' }], ['id3', { id: 'id3' }]];

[...mySet] === [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }];

mySet.forEach((value, key, set) => { /* something with the key, value and set */ })
```

### Set operations

`SmartSet` has some set operation that corresponds to the mathematics representation. These operations are immutable, so they return a new `SmartSet` instance and does not modify the original set. The methods accept regular `Set` objects, because it runs the ID creation function on the items.

`union(other: Set<T>): SmartSet<T, ID>`

`intersection(other: Set<T>): SmartSet<T, ID>`

`difference(other: Set<T>): SmartSet<T, ID>`

`symmetricDifference(other: Set<T>): SmartSet<T, ID>`

```typescript
let result;
const setA = new SmartSet<Data, string>(item => item.s, [ { s: '1' }, { s: '2' } ]);
const setB = new SmartSet<Data, string>(item => item.s, [ { s: '1' }, { s: '3' } ]);

result = setA.union(setB); //  [ { s: '1' }, { s: '2' }, { s: '3' } ]
result = setA.intersection(setB); //  [ { s: '1' } ]
result = setA.difference(setB); //  [ { s: '2' } ]
result = setB.difference(setA); //  [ { s: '3' } ]
result = setA.symmetricDifference(setB); //  [ { s: '2' }, { s: '3' } ]
```

## Debugging

`npm run build` - Build typescript files

`npm run test` - Run Jest tests

`npm run coverage` - Run code coverage

`npm run lint` - Run EsLint

`npm run lint-fix` - Run EsLint and fix errors

## Rights and Agreements

License [MIT](https://github.com/dbalazs97/smart-set/blob/master/LICENSE)
