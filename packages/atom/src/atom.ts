import {
	useEffect,
	useRef,
	useSyncExternalStore,
	useDebugValue,
	type DependencyList,
} from "react"

export interface Atom<Value>
	extends Readonly<{
		id: string
		get(): Value
		getInitial(): Value
		set(value: Value): void
		sub(cb: SubFn<Value>): Unsub
	}> {}

export type SubFn<Value> = (value: Value) => void
export type Unsub = () => void

let atomCount = 0

export function atom<Value>(initialValue: Value): Atom<Value> {
	let value = initialValue
	const subs = new Set<SubFn<Value>>()
	const id = `atom${atomCount++}`

	return Object.freeze({
		id,
		get() {
			return value
		},
		getInitial() {
			return initialValue
		},
		set(newValue) {
			if (Object.is(value, newValue)) return
			value = newValue
			for (const sub of subs) {
				sub(value)
			}
		},
		sub(cb) {
			subs.add(cb)
			return () => {
				subs.delete(cb)
			}
		},
	} satisfies Atom<Value>)
}

export function useAtom<Value>(atom: Atom<Value>) {
	const value = useSyncExternalStore(atom.sub, atom.get, atom.getInitial)
	useDebugValue(`${atom.id}: ${value}`)
	return [value, atom.set] as const
}

export function useSubscribe<Value>(
	atom: Atom<Value>,
	cb: SubFn<Value>,
	deps: DependencyList = [],
) {
	useEffect(() => atom.sub(cb), [atom, ...deps])
}

enum HydrateState {
	Pending = 0,
	Done = 1,
	Effect = 2,
}

export function useHydrate(cb: () => void, deps: DependencyList) {
	const hydratedRef = useRef<HydrateState>(HydrateState.Pending)

	// Hydrate immediately for SSR and for the first render in the browser, this
	// should avoid hydration mismatches.
	if (hydratedRef.current === HydrateState.Pending) {
		hydratedRef.current = HydrateState.Done
		cb()
	}

	// This allows bundlers to remove the effect at build time.
	if (typeof window !== "undefined") {
		useEffect(() => {
			// Prevent a double hydration and potential mismatch issues by running the
			// callback only from the second render onwards.
			if (hydratedRef.current === HydrateState.Done) {
				hydratedRef.current = HydrateState.Effect
			} else {
				cb()
			}
		}, deps)
	}
}
