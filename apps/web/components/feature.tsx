import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as motion from "./motion"

type Props = { order: number; title: string; children: ReactNode }

export function Feature({ order, title, children }: Props) {
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
