import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "./code-block"
import { CopyButton } from "./copy-button"
import * as motion from "./motion"

export function Installation() {
	return (
		<section id="installation" className="py-24 bg-pane-1">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<motion.h2
						className="text-3xl font-bold tracking-tight sm:text-4xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						Installation
					</motion.h2>
					<motion.p
						className="mt-4 text-lg"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						Install the package with your package manager of choice
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mt-8"
					>
						<Tabs defaultValue="pnpm" className="gap-2">
							<TabsList>
								<PackageTrigger value="pnpm" />
								<PackageTrigger value="npm" />
								<PackageTrigger value="yarn" />
								<PackageTrigger value="bun" />
							</TabsList>
							<CommandCard value="pnpm">pnpm add @lfades/atom</CommandCard>
							<CommandCard value="npm">npm install @lfades/atom</CommandCard>
							<CommandCard value="yarn">yarn add @lfades/atom</CommandCard>
							<CommandCard value="bun">bun add @lfades/atom</CommandCard>
						</Tabs>
					</motion.div>
					<motion.p
						className="mt-4"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						Or just{" "}
						<a
							href="https://github.com/lfades/atom/blob/main/packages/atom/src/atom.ts"
							target="_blank"
							rel="noopener noreferrer"
							className="text-link hover:text-link-hover underline underline-offset-2"
						>
							copy the code
						</a>
						.
					</motion.p>
				</div>
			</div>
		</section>
	)
}

function PackageTrigger({ value }: { value: string }) {
	return (
		<TabsTrigger value={value} className="text-sm font-medium px-4">
			{value.toUpperCase()}
		</TabsTrigger>
	)
}

function CommandCard({ value, children }: { value: string; children: string }) {
	return (
		<TabsContent value={value}>
			<Card className="bg-pane">
				<CardContent className="relative">
					<CodeBlock
						lang="bash"
						data-id="install-command"
						className="text-sm overflow-x-auto"
					>
						{children}
					</CodeBlock>
					<CopyButton
						id="install-command"
						className="absolute right-4 -top-2"
					/>
				</CardContent>
			</Card>
		</TabsContent>
	)
}
