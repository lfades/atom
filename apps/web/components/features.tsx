import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as motion from "./motion"

export function Features() {
	return (
		<section id="features" className="py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-3xl text-center">
					<motion.h2
						className="text-3xl font-bold tracking-tight sm:text-4xl"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
					>
						Simple by design
					</motion.h2>
					<motion.p
						className="mt-4 text-lg"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						Minimal API with no store, built around React's principles.
					</motion.p>
				</div>

				<div className="mt-16 grid gap-8 md:grid-cols-2">
					<Feature order={1} title="Minimal API">
						The entire source code is just 65 lines long. Feel free to{" "}
						<a
							href="https://github.com/lfades/atom/blob/main/packages/atom/src/atom.ts"
							target="_blank"
							rel="noopener noreferrer"
							className="text-link hover:text-link-hover underline underline-offset-2"
						>
							copy the code
						</a>{" "}
						into your project instead of installing the package.
					</Feature>
					<Feature order={2} title="Less is More">
						<code className="text-secondary">atom</code> does not have a
						underlying store or context, but it integrates easily with one when
						needed, and it encourages updates to happen inside React components
						instead of a library API.
					</Feature>
				</div>
			</div>
		</section>
	)
}

type FeatureProps = { order: number; title: string; children: ReactNode }

function Feature({ order, title, children }: FeatureProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5, delay: 0.1 * order }}
			whileHover={{ y: -5 }}
		>
			<Card className="h-full">
				<CardHeader>
					<CardTitle className="text-xl text-primary">{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<p>{children}</p>
				</CardContent>
			</Card>
		</motion.div>
	)
}
