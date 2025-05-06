# @lfades/atom

Straightforward state management library for React. You can learn more about it at [atom.lfades.com](https://atom.lfades.com/).

## Installation

Install the package with your package manager of choice:

```bash
pnpm add @lfades/atom
```

```bash
npm install @lfades/atom
```

```bash
yarn add @lfades/atom
```

Now you can create an atom and subscribe to it:

```tsx
import { atom, useAtom } from '@lfades/atom';

const counterAtom = atom(0);

const Counter = () => {
  const [count, setCount] = useAtom(counterAtom);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};

export default Counter;
```

That's it! It only takes a few minutes to understand what the library does so I encourage you to read the [source code](packages/atom/src/atom.ts).

## API

### `atom`

```ts
function atom<Value>(initialValue: Value): Atom<Value>;
```

Creates an atom with the given `initialValue`.

```ts
import { atom } from '@lfades/atom';

const counterAtom = atom(0);
```

You can read the value of the atom without subscribing to it by using the `get` method:

```ts
atom.get(); // 0
```

Similarly, you can update the value of the atom with `set`:

```tsx
atom.set(1);
atom.get(); // 1
```

When you update the value of the atom, all components subscribed to it will re-render.

### `useAtom`

```ts
function useAtom<Value>(atom: Atom<Value>): [Value, (value: Value) => void];
```

Returns the current value of the atom and a setter function to update it. This also subscribes the component to the atom, so it will re-render when the atom value changes.

The setter returned by `useAtom` is equivalent to `atom.set`. So the following are equivalent:

```ts
import { useAtom } from '@lfades/atom';

const [count, setCount] = useAtom(counterAtom);
// ..
setCount(1);
setCount === counterAtom.set; // true
```

```ts
const count = useAtom(counterAtom)[0];
// ..
counterAtom.set(1);
```

#### Creating an atom inside a component

This is a valid use case, but be sure to add `useMemo` to prevent the atom from being recreated on every render:

```tsx
const counterAtom = useMemo(() => atom(0), []);
const [count, setCount] = useAtom(counterAtom);
```

An atom created this way will work similarly to `useState`. However, you can pass down the atom through props and allow other components to subscribe to it if needed. This can prove particularly useful when combined with React Context.

> Atoms also have a unique identifier in `atom.id` that you can use as the `key` attribute.

### `useSubscribe`

```ts
function useSubscribe<Value>(
  atom: Atom<Value>,
  cb: SubFn<Value>,
  deps?: DependencyList
): void;
```

Subscribes to the atom and calls the callback function with the new value whenever it changes.

```ts
import { useSubscribe } from '@lfades/atom';

useSubscribe(counterAtom, (value) => {
  console.log(value);
});
```

If the callback function has dependencies, you can pass them as the third argument:

```ts
useSubscribe(
  counterAtom,
  (value) => {
    console.log(value, dep);
  },
  [dep]
);
```

### `useHydrate`

```ts
function useHydrate(cb: () => void, deps: DependencyList): void;
```

Allows you to hydrate atoms, useful for updating atoms with data from the server. For example, we can have atoms be created and shared by a context provider, and hydrate them with server data:

```tsx
// atoms-context.tsx
import { atom, useHydrate } from '@lfades/atom';

const atoms = { counterAtom: atom(0) };
export const atomsContext = React.createContext(atoms);

export function AtomsProvider({ children, data }) {
  useHydrate(() => {
    if (data) {
      atoms.counterAtom.set(data.counter);
    }
  }, [data]);

  return (
    <atomsContext.Provider value={atoms}>{children}</atomsContext.Provider>
  );
}
```

```tsx
// page.tsx
import { AtomsProvider } from './atoms-context';
import { Counter } from './counter';

async function Page() {
  const data = await fetchData();
  return (
    <Atoms data={data}>
      <Counter />
    </Atoms>
  );
}
```

The `Counter` component can then get the atom from the context and subscribe to the atom:

```tsx
// counter.tsx
import { useAtom } from '@lfades/atom';
import { atomsContext } from './atoms-context';

function Counter() {
  const { counterAtom } = React.useContext(atomsContext);
  const [count, setCount] = useAtom(counterAtom);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
}
const counterAtom = atom(0);
```

## Contributing

After cloning the repository, install dependencies with `pnpm`:

```bash
pnpm install
```

Make your changes and build the library:

```bash
pnpm build
# Or to watch for changes
pnpm dev
```

and then create a [link](https://pnpm.io/cli/link) for the package:

```bash
pnpm link --global
```

You can install the package in an app with:

```bash
pnpm link @lfades/atom
```

To remove the linked package run the following command:

```bash
pnpm uninstall --global @lfades/atom
```
