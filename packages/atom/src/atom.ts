import {
	useEffect,
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
	// biome-ignore lint/correctness/useExhaustiveDependencies(cb): Unlikely to be needed.
	useEffect(() => atom.sub(cb), [atom, ...deps])
}
