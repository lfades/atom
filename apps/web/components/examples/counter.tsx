"use client"

import { atom, useAtom } from "@lfades/atom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const counterAtom = atom(0)

export function CounterExample() {
	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex justify-center">
					<Counter />
				</div>
			</CardContent>
		</Card>
	)
}

function Counter() {
	const [count, setCount] = useAtom(counterAtom)

	const increment = () => setCount(count + 1)
	const decrement = () => setCount(count - 1)

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="text-4xl font-bold">{count}</div>
			<div className="flex gap-2">
				<Button onClick={decrement} variant="outline">
					-
				</Button>
				<Button onClick={increment}>+</Button>
			</div>
		</div>
	)
}
