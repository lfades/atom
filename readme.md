# @lfades/atom

Straightforward state management library for React. Featuring:

- Minimal API: The entire source code is [84 lines long](src/atom.ts). Feel free to copy it to your project instead of installing the package.
- There's no underlying store, it's like a shared `useState`.
- It helps you remove the complexity of state management by making you do thinks the react-way.

## Getting Started

Install the package with your package manger of choice:

```bash
npm install @lfades/atom
```

```bash
pnpm add @lfades/atom
```

```bash
yarn add @lfades/atom
```

Now, create an atom and use it:

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

That's it! It only takes a few minutes to understand what the library does so I encourage you to read the [source code](src/atom.ts).

## FAQ

### Why another state management library?

I think handling state should not be a complicated task. Current alternatives in React are either using React Context or some third party state management library. However, both have their own set of downsides:

#### React Context

A lot of times all that I want is a shared `useState` between components, and `atom` is exactly that. React Context can be overkill in these situations, because depending on the complexity of the app, you'll add more and more providers to handle simple states, it's common that when you only use React Context to globally share state, you'll end up with a long tree of providers, because having a single provider for everything is ultimately bad for performance.

React Context has a very good use case when you need to change the state behind a tree of components based on some action or initial state, but a lot of times you don't need that, and if you do, [you can store multiple atoms in React Context that can be individually subscribed to](#usehydrate).

#### Third party state management libraries

In case you haven't noticed, this library takes a lot of inspiration from [Jotai](https://jotai.org/). That's intentional because I really enjoy the mental model of Jotai where the state works very similarly to React's `useState` and you're encouraged to do most of the work inside your components, so you're always developing in the react way.

So why not just use Jotai instead? Well, Jotai does more than what I want it to do, like handling async operations and it also allows for setters and state logic to live outside of your hooks/components, which allows you to create a separation between your state and your components.

Other popular state management libraries like Redux and Zustand are great but also introduce more complexity in order to handle features you might not need. For example, if you need to handle data fetching it's probably better that you use [SWR](https://swr.vercel.app/). To handle promises the [use](https://react.dev/reference/react/use) hook.

#### How should I handle complex state mutations?

Create a hook that returns your mutation handlers that update one or multiple atoms. For example, I'm building an editor where you can select multiple components to edit them:

```tsx
export function useComponentActions(componentAtom: Atom<EditorPageBody>) {
  // This reads multiple atoms from React Context.
  const { importsAtom, selectedComponentAtom } = usePageStore()

  return useMemo(
    () => ({
      selectComponent() {
        if (selectedComponentAtom.get() === componentAtom) return

        const component = componentAtom.get()
        const imports = importsAtom.get()
        const variantImport = imports[component.tag]
        const componentData = variantImport
          ? getComponentData(imports[component.tag].fileName, component.tag)
          : { commonProps: [], discriminators: {}, props: [] }

        component.selectedAtom.set({ declaration: componentData })
        selectedComponentAtom.set(componentAtom)
      },
    }),
    [componentAtom, importsAtom, selectedComponentAtom],
  )
}
```

The `useComponentActions` hook returns a `selectComponent` function that updates multiple atoms at once. You can mutate the atoms directly without having to subscribe to changes so whoever calls the function doesn't have to re-render, and every update generated here will re-render components subscribed to one of the atoms.

## API

### `atom`

```ts
function atom<Value>(initialValue: Value): Atom<Value>;
```

Creates an atom with the given `initialValue`.

```ts
import { atom} from '@lfades/atom';

const counterAtom = atom(0);
```

You can read the value of the atom without subscribing to it by using the `read` method:

```ts
atom.get() // 0
```

Similarly, you can update the value of the atom with `set`:

```tsx
atom.set(1);
atom.get() // 1
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
```

```ts
const count = useAtom(counterAtom)[0];
// ..
counterAtom.set(1);
```

#### Creating an atom inside a component

This is a valid use case, but be sure to use `useMemo` to prevent the atom from being recreated on every render:

```tsx
const counterAtom = useMemo(() => atom(0), []);
const [count, setCount] = useAtom(counterAtom);
```

An atom created this way will work similarly to `useState`. However, you can pass down the atom through props and allow other components to subscribe to it if needed. This can prove particularly useful when combined with React Context.

> The atom also has a unique identifier in `atom.id` that you can use as the `key` attribute.

### `useSubscribe`

```ts
function useSubscribe<Value>(atom: Atom<Value>, cb: SubFn<Value>, deps?: DependencyList): void;
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
useSubscribe(counterAtom, (value) => {
  console.log(value, dep);
}, [dep]);
```

### `useHydrate`

```ts
function useHydrate(cb: () => void, deps: DependencyList): void;
```

Allows you to hydrate atoms, useful for updating atoms with data from the server. For example, we can have atoms be created and shared by a context provider, and hydrate them with server data:

```tsx
// atoms-context.tsx
import { atom, useHydrate } from '@lfades/atom';

const atoms = { counterAtom: atom(0) }
export const atomsContext = React.createContext(atoms);

export function AtomsProvider({ children, data }) {
  useHydrate(() => {
    if (data) {
      atoms.counterAtom.set(data.counter);
    }
  }, [data]);

  return (
    <atomsContext.Provider value={atoms}>
      {children}
    </atomsContext.Provider>
  )
}
```

```tsx
// page.tsx
import { AtomsProvider } from './atoms-context'
import { Counter } from './counter'

async function Page() {
  const data = await fetchData()
  return (
    <Atoms data={data}>
      <Counter />
    </Atoms>
   )
}
```

The `Counter` component can then get the atom from the context and subscribe to the atom:

```tsx
// counter.tsx
import { useAtom } from '@lfades/atom';
import { atomsContext } from './atoms-context'

function Counter() {
  const { counterAtom } = React.useContext(atomsContext);
  const [count, setCount] = useAtom(counterAtom);

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  )
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
