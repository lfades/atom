import type { ReactNode } from "react"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import * as motion from "./motion"
import { Code } from "./code"
import { CodeBlock } from "./code-block"
import { CopyButton } from "./copy-button"

export function FAQ() {
	return (
		<section id="faq" className="py-24 bg-pane-1">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<motion.h2
						className="text-3xl font-bold tracking-tight sm:text-4xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						FAQ
					</motion.h2>

					<motion.div
						className="mt-12"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<Accordion type="single" collapsible className="w-full space-y-4">
							<FAQItem id={0} title="Why another state management library?">
								I think handling state should not be a complicated task. Current
								alternatives in React are either using React Context or rely in
								selectors, which you probably don't need.
							</FAQItem>
							<FAQItem id={1} title="How does it compare to React Context?">
								A lot of times all that I want is a shared <Code>useState</Code>{" "}
								between components, and <Code>atom</Code> is exactly that. React
								Context can be overkill in these situations, because depending
								on the complexity of the app, you'll need to add more and more
								providers to handle simple states so it becomes common to end up
								with a long tree of providers, because having a single provider
								for everything can be hard to manage and bad for performance (as
								there's no granularity in updates).
							</FAQItem>
							<FAQItem
								id={2}
								title="How does it compare to other state management libraries?"
							>
								<p>
									This library takes inspiration from Jotai. That's intentional
									because I really enjoy the mental model of Jotai where the
									state works very similarly to React's <Code>useState</Code>{" "}
									and you're encouraged to handle updates inside your
									components, so you don't have no learn anything new, it's just
									React.
								</p>
								<p>
									However, Jotai does more than what I want it to do and it also
									allows for setters and state logic to live outside of your
									components or hooks. Allowing a separation between state and
									components is not a positive outcome, because React is
									powerful enough that you simply don't need that.
								</p>
							</FAQItem>
							<FAQItem
								id={3}
								title="How should I handle complex state mutations?"
							>
								<p>
									Create a hook that returns mutation handlers that update one
									or multiple atoms. This allows you to encapsulate complex
									state logic while keeping your components clean.
								</p>
								<p>
									For example, I'm building an editor where you can select
									multiple components to edit them and this is the hook I
									created to handle the selection:
								</p>
								<Card>
									<CardContent className="relative pt-6 sm:pt-0">
										<CodeBlock
											lang="tsx"
											data-id="install-command"
											className="text-sm overflow-x-auto"
											card
										>
											{`export function useComponentActions(componentAtom: Atom<EditorPageBody>) {
  // This reads multiple atoms from React Context.
  const { importsAtom, selectedComponentAtom } = usePageStore();

  return useMemo(
    () => ({
      selectComponent() {
        if (selectedComponentAtom.get() === componentAtom) return;

        const component = componentAtom.get();
        const imports = importsAtom.get();
        const variantImport = imports[component.tag];
        const componentData = variantImport
          ? getComponentData(imports[component.tag].fileName, component.tag)
          : { commonProps: [], discriminators: {}, props: [] };

        component.selectedAtom.set({ declaration: componentData });
        selectedComponentAtom.set(componentAtom);
      },
    }),
    [componentAtom, importsAtom, selectedComponentAtom]
  );
}`}
										</CodeBlock>
										<CopyButton
											id="install-command"
											className="absolute right-4 -top-2"
										/>
									</CardContent>
								</Card>
								<p>
									The <Code>useComponentActions</Code> hook returns a{" "}
									<Code>selectComponent</Code> function that updates multiple
									atoms at once. You can mutate the atoms directly without
									having to subscribe to changes so whoever calls the function
									doesn't have to re-render, and every update generated here
									will only re-render components subscribed to one of the
									updated atoms.
								</p>
							</FAQItem>
							{/* <FAQItem id={4} title="What about async updates?"> */}
							{/* 	Use <Code>fetch</Code> or something similar (like Server */}
							{/* 	Actions). <Code>atom</Code> is better suited for intermediate */}
							{/* 	states and async operations are not needed there. */}
							{/* </FAQItem> */}
						</Accordion>
					</motion.div>
				</div>
			</div>
		</section>
	)
}

function FAQItem({
	id,
	title,
	children,
}: {
	id: number
	title: string
	children: ReactNode
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: 0.1 * id }}
		>
			<AccordionItem
				value={`item-${id}`}
				className="rounded-xl border shadow-lg bg-pane"
			>
				<AccordionTrigger className="px-6 py-4 text-lg font-medium">
					{title}
				</AccordionTrigger>
				<AccordionContent className="px-6 pb-4 space-y-4">
					{children}
				</AccordionContent>
			</AccordionItem>
		</motion.div>
	)
}
