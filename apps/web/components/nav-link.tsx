import type { ReactNode } from "react"

export function NavLink({ id, children }: { id: string; children: ReactNode }) {
	return (
		<li className="flex items-center">
			<a
				href={`#${id}`}
				className="text-sm font-medium transition-colors hover:text-link-hover"
			>
				{children}
			</a>
		</li>
	)
}
