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

## Advanced patterns

### Multiple atoms in a single provider

If you want a single provider that exposes many related atoms, create them together and export focused hooks.

```tsx
import { atom, useAtom } from '@lfades/atom';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

type AppConfig = {
  userId: string;
  theme: 'light' | 'dark';
  showHints: boolean;
};

const createAtoms = (config: AppConfig) => ({
  userIdAtom: atom(config.userId),
  themeAtom: atom(config.theme),
  showHintsAtom: atom(config.showHints),
});

const AppAtomsContext =
  createContext<ReturnType<typeof createAtoms> | null>(null);

export function AppAtomsProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: AppConfig;
}) {
  const atoms = useMemo(() => createAtoms(config), []);

  // Optionally subscribe to atoms here to trigger side effects from changes.
  useEffect(() => {
    const { themeAtom, showHintsAtom } = atoms;
    const unsubs = [
      themeAtom.sub((theme) => {
        console.log('theme changed', theme);
      }),
      showHintsAtom.sub((showHints) => {
        console.log('show hints changed', showHints);
      }),
    ];

    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, [atoms]);

  return (
    <AppAtomsContext.Provider value={atoms}>
      {children}
    </AppAtomsContext.Provider>
  );
}

function useAppAtoms() {
  const atoms = useContext(AppAtomsContext);
  if (!atoms) {
    throw new Error('useAppAtoms must be used within AppAtomsProvider');
  }
  return atoms;
}

export function useTheme() {
  return useAtom(useAppAtoms().themeAtom);
}

export function useShowHints() {
  return useAtom(useAppAtoms().showHintsAtom);
}
```

### Single atom provider with `createAtomContext`

If you only need a single atom, the `createAtomContext` utility can generate a provider and hooks for you.

```tsx
import { createAtomContext } from '@lfades/atom/utils';

const [CounterProvider, useCounter, useCounterAtom] =
  createAtomContext<number>();

export function CounterRoot({ initial, children }) {
  // `sync` keeps the atom value in sync with `initial`.
  return (
    <CounterProvider value={initial} sync>
      {children}
    </CounterProvider>
  );
}

export function Counter() {
  const [count, setCount] = useCounter();
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

## Contributing

After cloning the repository, install dependencies with `pnpm`:

```bash
pnpm install
```

Run the main website:

```bash
pnpm dev
```

And then open the site at [http:localhost:3000](http:localhost:3000) and test your changes in the [counter demo](apps/web/components/examples/counter.tsx).

### Testing the library with a different app

Alternatively, you can link the package and use it with an app outside the monorepo. First navigate to the package directory:

```bash
cd packages/atom
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

### Releasing a new version

After you're done with your changes, run:

```bash
pnpm changeset
```

And add a good description of your changes.

