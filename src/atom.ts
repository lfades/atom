import { useEffect, useRef, useState, type DependencyList } from "react";

export interface Atom<Value>
  extends Readonly<{
    id: string;
    get(): Value;
    set(value: Value): void;
    sub(cb: SubFn<Value>): Unsub;
  }> {}

export type SubFn<Value> = (value: Value) => void;
export type Unsub = () => void;

let atomCount = 0;

export function atom<Value>(initialValue: Value): Atom<Value> {
  let value = initialValue;
  let subs: SubFn<Value>[] = [];
  let id = `atom${atomCount++}`;
  return Object.freeze({
    id,
    get() {
      return value;
    },
    set(newValue) {
      if (value === newValue) return;
      value = newValue;
      subs.forEach((cb) => {
        cb(value);
      });
    },
    sub(cb) {
      subs.push(cb);
      return () => {
        subs = subs.filter((sub) => sub !== cb);
      };
    },
  } satisfies Atom<Value>);
}

export function useAtom<Value>(atom: Atom<Value>) {
  const [_count, rerender] = useState(0);
  useSubscribe(atom, () => rerender((c) => c + 1));
  return [atom.get(), atom.set] as const;
}

export function useSubscribe<Value>(
  atom: Atom<Value>,
  cb: SubFn<Value>,
  deps: DependencyList = [],
) {
  useEffect(() => atom.sub(cb), [atom, ...deps]);
}

enum HydrateState {
  Pending = 0,
  Done = 1,
  Effect = 2,
}

export function useHydrate(cb: () => void, deps: DependencyList) {
  const hydratedRef = useRef<HydrateState>(HydrateState.Pending);

  // Hydrate immediately for SSR and for the first render in the browser, this
  // should avoid hydration mismatches.
  if (hydratedRef.current === HydrateState.Pending) {
    hydratedRef.current = HydrateState.Done;
    cb();
  }

  // This allows bundlers to remove the effect at build time.
  if (typeof window !== "undefined") {
    useEffect(() => {
      // Prevent a double hydration and potential mismatch issues by running the
      // callback only from the second render onwards.
      if (hydratedRef.current === HydrateState.Done) {
        hydratedRef.current = HydrateState.Effect;
      } else {
        cb();
      }
    }, deps);
  }
}
