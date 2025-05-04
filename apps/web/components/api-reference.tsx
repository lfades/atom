import { Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "./code-block"
import { CopyButton } from "./copy-button"
import * as motion from "./motion"

export function API() {
	return (
		<section id="api" className="py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<motion.h2
						className="text-3xl font-bold tracking-tight sm:text-4xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						API Reference
					</motion.h2>
					<motion.p
						className="mt-4 text-lg"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						A complete reference to the{" "}
						<code className="text-secondary">@lfades/atom</code> API
					</motion.p>

					<div className="mt-12 space-y-12">
						<ApiSection
							name="atom"
							description="Creates an atom with the given initialValue."
							code={`import { atom } from '@lfades/atom';

const counterAtom = atom(0);

// Read the value
counterAtom.get(); // 0

// Update the value
counterAtom.set(1);
counterAtom.get(); // 1`}
						/>
						<ApiSection
							name="useAtom"
							description="Returns the current value of the atom and a setter function to update it. This also subscribes the component to the atom, so it will re-render when the atom value changes."
							code={`import { useAtom } from '@lfades/atom';

const [count, setCount] = useAtom(counterAtom);
// ..
setCount(1);
setCount === counterAtom.set; // true

// Creating an atom inside a component
const localAtom = useMemo(() => atom(0), []);
const [localCount, setLocalCount] = useAtom(localAtom);`}
						/>
						<ApiSection
							name="useSubscribe"
							description="Subscribes to the atom and calls the callback function with the new value whenever it changes."
							code={`import { useSubscribe } from '@lfades/atom';

useSubscribe(counterAtom, (value) => {
  console.log(value);
});

// With dependencies
useSubscribe(
  counterAtom,
  (value) => {
    console.log(value, dep);
  },
  [dep]
);`}
						/>
						<ApiSection
							name="useHydrate"
							description="Allows you to hydrate atoms, useful for updating atoms with data from the server."
							code={`// atoms-context.tsx
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
    <atomsContext.Provider value={atoms}>
      {children}
    </atomsContext.Provider>
  );
}`}
						/>
					</div>
				</div>
			</div>
		</section>
	)
}

function ApiSection({
	name,
	description,
	code,
}: {
	name: string
	description: string
	code: string
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 1 }}
		>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">{name}</CardTitle>
					<p>{description}</p>
				</CardHeader>
				<CardContent>
					<div className="overflow-hidden rounded-xl">
						<div className="relative">
							<Card className="bg-pane">
								<CardContent className="relative pt-6 sm:pt-0">
									<CodeBlock
										lang="tsx"
										data-id="install-command"
										className="text-sm overflow-x-auto"
									>
										{code}
									</CodeBlock>
									<CopyButton
										id="install-command"
										className="absolute right-4 -top-2"
									/>
								</CardContent>
							</Card>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}
