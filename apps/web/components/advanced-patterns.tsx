import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { CodeBlock } from "./code-block"
import { CopyButton } from "./copy-button"
import * as motion from "./motion"

export function AdvancedPatterns() {
	return (
		<section id="advanced-patterns" className="py-24 bg-pane-1">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<motion.h2
						className="text-3xl font-bold tracking-tight sm:text-4xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						Advanced patterns
					</motion.h2>
					<motion.p
						className="mt-4 text-lg"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						Pick the setup that matches your app: a shared provider for many
						atoms, or a single-atom context.
					</motion.p>
					<motion.div
						className="mt-8"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Accordion type="single" collapsible className="w-full space-y-4">
							<AccordionItem
								value="multi-atom"
								className="rounded-xl border shadow-lg bg-pane"
							>
								<AccordionTrigger className="px-6 py-4 text-lg font-medium items-center">
									Multiple atoms in one provider
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-4 space-y-4">
									<p>
										Keep many atoms in a single context provider and expose
										focused hooks for each slice of state.
									</p>
									<Card className="bg-pane">
										<CardContent className="relative pt-6 sm:pt-0">
											<CodeBlock
												lang="tsx"
												data-id="advanced-patterns"
												className="text-sm overflow-x-auto"
											>
												{`import { atom, useAtom } from "@lfades/atom"
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react"

type AppConfig = {
  userId: string
  theme: "light" | "dark"
  showHints: boolean
}

const createAtoms = (config: AppConfig) => ({
  userIdAtom: atom(config.userId),
  themeAtom: atom(config.theme),
  showHintsAtom: atom(config.showHints),
})

const AppAtomsContext =
  createContext<ReturnType<typeof createAtoms> | null>(null)

export function AppAtomsProvider({
  children,
  config,
}: {
  children: ReactNode
  config: AppConfig
}) {
  const atoms = useMemo(() => createAtoms(config), [])

  // Optionally subscribe to atoms here to trigger side effects from changes.
  useEffect(() => {
    const { themeAtom, showHintsAtom } = atoms
    const unsubs = [
      themeAtom.sub((theme) => {
        console.log("theme changed", theme)
      }),
      showHintsAtom.sub((showHints) => {
        console.log("show hints changed", showHints)
      }),
    ]

    return () => {
      for (const unsub of unsubs) {
        unsub()
      }
    }
  }, [atoms])

  return (
    <AppAtomsContext.Provider value={atoms}>
      {children}
    </AppAtomsContext.Provider>
  )
}

function useAppAtoms() {
  const atoms = useContext(AppAtomsContext)
  if (!atoms) {
    throw new Error("useAppAtoms must be used within AppAtomsProvider")
  }
  return atoms
}

export function useTheme() {
  return useAtom(useAppAtoms().themeAtom)
}

export function useShowHints() {
  return useAtom(useAppAtoms().showHintsAtom)
}`}
											</CodeBlock>
											<CopyButton
												id="advanced-patterns"
												className="absolute right-4 -top-2"
											/>
										</CardContent>
									</Card>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value="single-atom"
								className="rounded-xl border shadow-lg bg-pane"
							>
								<AccordionTrigger className="px-6 py-4 text-lg font-medium items-center">
									Single atom provider
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-4 space-y-4">
									<p>
										Prefer a single atom provider? Use{" "}
										<code className="text-secondary">createAtomContext</code> to
										generate a provider and hooks in one place.
									</p>
									<Card className="bg-pane">
										<CardContent className="relative pt-6 sm:pt-0">
											<CodeBlock
												lang="tsx"
												data-id="advanced-patterns-single"
												className="text-sm overflow-x-auto"
											>
												{`import { createAtomContext } from "@lfades/atom/utils"

const [CounterProvider, useCounter] =
  createAtomContext<number>()

export function CounterRoot({ initial, children }) {
  // \`sync\` keeps the atom value in sync with \`initial\`.
  return (
    <CounterProvider value={initial} sync>
      {children}
    </CounterProvider>
  )
}

export function CounterButton() {
  const [count, setCount] = useCounter()
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}`}
											</CodeBlock>
											<CopyButton
												id="advanced-patterns-single"
												className="absolute right-4 -top-2"
											/>
										</CardContent>
									</Card>
								</AccordionContent>
							</AccordionItem>
							<AccordionItem
								value="complex-mutations"
								className="rounded-xl border shadow-lg bg-pane"
							>
								<AccordionTrigger className="px-6 py-4 text-lg font-medium items-center">
									Complex state mutations
								</AccordionTrigger>
								<AccordionContent className="px-6 pb-4 space-y-4">
									<p>
										Create a hook that returns mutation handlers that update one
										or multiple atoms. This helps share mutations with multiple
										components.{" "}
									</p>
									<p>
										For example, this hook updates multiple atoms while keeping
										renders scoped to the subscriptions that matter:
									</p>
									<Card className="bg-pane">
										<CardContent className="relative pt-6 sm:pt-0">
											<CodeBlock
												lang="tsx"
												data-id="advanced-patterns-mutations"
												className="text-sm overflow-x-auto"
											>
												{`export function useCartActions(cartAtom: Atom<CartItem[]>) {
  // This reads multiple atoms from React Context.
  //
  // Note that we're not subscribing to them here, so \`useCartActions\`
  // does not cause re-renders when they change.
  const { totalAtom, discountAtom } = useShopStore();

  return useMemo(
    () => ({
      addItem(item: CartItem) {
        const nextCart = [...cartAtom.get(), item];
        cartAtom.set(nextCart);
        totalAtom.set(calculateTotal(nextCart, discountAtom.get()));
      },
      removeItem(id: string) {
        const nextCart = cartAtom.get().filter((item) => item.id !== id);
        cartAtom.set(nextCart);
        totalAtom.set(calculateTotal(nextCart, discountAtom.get()));
      },
      applyDiscount(code: string) {
        discountAtom.set(code);
        totalAtom.set(calculateTotal(cartAtom.get(), code));
      },
    }),
    [cartAtom, discountAtom, totalAtom]
  );
}`}
											</CodeBlock>
											<CopyButton
												id="advanced-patterns-mutations"
												className="absolute right-4 -top-2"
											/>
										</CardContent>
									</Card>
									<p>
										The <code className="text-secondary">useCartActions</code>{" "}
										hook returns multiple handlers that update atoms together.
										You can mutate atoms directly without subscribing, and only
										components subscribed to updated atoms will re-render.
									</p>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
