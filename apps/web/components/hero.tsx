import "server-only"
import { ArrowRight, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CounterExample } from "./examples/counter"
import { CopyButton } from "./copy-button"
import { CodeBlock } from "./code-block"
import * as motion from "./motion"

export function Hero() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-pane to-pane-2 py-20">
			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
							@lfades/atom
						</h1>
						<p className="mt-6 text-xl leading-8">
							Straightforward state management for React
						</p>
					</motion.div>
					<motion.div
						className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Button asChild size="lg" className="h-12">
							<a href="#installation">
								Get Started <ArrowRight className="ml-2 h-4 w-4" />
							</a>
						</Button>
						<Button asChild variant="outline" size="lg" className="h-12">
							<a
								href="https://github.com/lfades/atom"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="mr-2 h-4 w-4" /> GitHub
							</a>
						</Button>
					</motion.div>
				</div>

				<motion.div
					className="mt-16 grid gap-6 sm:grid-cols-[2fr_1fr]"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<Card className="flex flex-col overflow-hidden pt-0">
						<div className="flex items-center justify-between bg-pane px-4 py-1">
							<div className="text-sm font-medium">counter.tsx</div>
							<CopyButton />
						</div>

						<div className="flex-1 overflow-auto px-4 text-sm">
							<CodeBlock lang="tsx" data-id="code-sample">
								{`import { atom, useAtom } from "@lfades/atom"

const counterAtom = atom(0)

function Counter({ props }: Props) {
	const [count, setCount] = useAtom(counterAtom)
	const increment = () => setCount(count + 1)
	const decrement = () => setCount(count - 1)

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="text-4xl font-bold">{count}</div>
			<div className="flex gap-2">
				<button onClick={decrement}>-</button>
				<button onClick={increment}>+</button>
			</div>
		</div>
	)
}`}
							</CodeBlock>
						</div>
					</Card>

					<div className="flex flex-col">
						<CounterExample />
					</div>
				</motion.div>
			</div>
		</section>
	)
}
