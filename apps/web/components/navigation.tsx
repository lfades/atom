import type { ReactNode } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import * as motion from "./motion"
import { Button } from "@/components/ui/button"
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeSwitcher } from "./theme-switcher"

export function Navigation() {
	return (
		<motion.nav
			className="sticky top-0 z-50 border-b bg-pane-1/80 backdrop-blur-sm"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<Link href="/" className="text-xl font-bold">
						@lfades/atom
					</Link>

					<div className="flex items-center">
						<ul className="hidden md:flex items-center space-x-8">
							<NavLink id="features">Features</NavLink>
							<NavLink id="installation">Installation</NavLink>
							<NavLink id="api">API</NavLink>
							<NavLink id="advanced-patterns">Advanced</NavLink>
							<NavLink id="faq">FAQ</NavLink>
						</ul>
						<a
							href="https://github.com/lfades/atom"
							target="_blank"
							rel="noopener noreferrer"
							className="ml-8 mr-4 space-x-8 hidden md:block text-sm font-medium transition-colors hover:text-link-hover"
						>
							GitHub
						</a>
						<ThemeSwitcher />
						<div className="md:hidden">
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon" aria-label="Open menu">
										<Menu size={20} />
									</Button>
								</SheetTrigger>
								<SheetContent side="right">
									<SheetTitle className="sr-only">Header navigation</SheetTitle>
									<div className="flex flex-col py-4">
										<ul className="flex flex-col space-y-4 mx-4">
											<NavLink id="features">Features</NavLink>
											<NavLink id="installation">Installation</NavLink>
											<NavLink id="api">API</NavLink>
											<NavLink id="advanced-patterns">Advanced</NavLink>
											<NavLink id="faq">FAQ</NavLink>
											<NavLink id="contributing">Contributing</NavLink>
											<li className="flex">
												<a
													href="https://github.com/lfades/atom"
													target="_blank"
													rel="noopener noreferrer"
													className="block text-sm font-medium hover:text-link-hover"
												>
													GitHub
												</a>
											</li>
										</ul>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</div>
		</motion.nav>
	)
}

function NavLink({ id, children }: { id: string; children: ReactNode }) {
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
