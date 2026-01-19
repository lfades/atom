import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useMemo,
} from "react"
import { atom, type Atom, useAtom as useAtomCore } from "./atom.js"

/**
 * Creates a typed context wrapper around an atom.
 * Returns a Provider plus hooks to read or access the underlying atom.
 */
export function createAtomContext<Value>() {
	const context = createContext<Atom<Value> | null>(null)

	/**
	 * Provides an atom instance to descendants.
	 */
	function Provider({
		/** Initial value for the atom. */
		value,
		/** React children to render. */
		children,
		/** When true, keeps the atom value in sync with `value`. */
		sync = false,
	}: {
		value: Value
		children: ReactNode
		sync?: boolean
	}) {
		// biome-ignore lint/correctness/useExhaustiveDependencies(value): The atom must only be created once.
		const valueAtom = useMemo(() => atom(value), [])

		useEffect(() => {
			if (sync) valueAtom.set(value)
		}, [sync, value, valueAtom])

		return <context.Provider value={valueAtom}>{children}</context.Provider>
	}

	function useGetAtom() {
		const atom = useContext(context)
		if (!atom) {
			throw new Error(
				"useGetAtom must be used within the provider from createAtomContext",
			)
		}
		return atom
	}

	function useAtom() {
		return useAtomCore(useGetAtom())
	}

	return [Provider, useAtom, useGetAtom] as const
}
