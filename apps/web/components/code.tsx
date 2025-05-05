import type { ReactNode } from "react"

export function Code({ children }: { children: ReactNode }) {
	return <code className="text-secondary">{children}</code>
}
