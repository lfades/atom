"use client"

import { useState, useEffect } from "react"
import { Menu, Moon, Sun, Laptop } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavLink } from "./nav-link"
import { ThemeSwitcher } from "./theme-switcher"

export function Navigation() {
	const [mounted, setMounted] = useState(false)
	const { theme, setTheme } = useTheme()

	useEffect(() => {
		setMounted(true)
	}, [])

	const sections = [
		{ id: "features", name: "Features" },
		{ id: "installation", name: "Installation" },
		{ id: "faq", name: "FAQ" },
		{ id: "api", name: "API" },
		{ id: "contributing", name: "Contributing" },
	]

	return (
		<motion.nav
			className="sticky top-0 z-50 border-b border-surface-2 bg-pane-1/80 backdrop-blur-sm"
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between text-text">
					<Link href="/" className="text-xl font-bold">
						@lfades/atom
					</Link>

					<div className="flex items-center">
						<ul className="hidden md:flex items-center space-x-8">
							<NavLink id="features">Features</NavLink>
							<NavLink id="installation">Installation</NavLink>
							<NavLink id="faq">FAQ</NavLink>
							<NavLink id="api">API</NavLink>
							<NavLink id="contributing">Contributing</NavLink>
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
									<Button
										variant="ghost"
										size="icon"
										className="rounded-md border-surface-2 hover:border hover:bg-pane-2 cursor-pointer"
										aria-label="Open menu"
									>
										<Menu size={20} />
									</Button>
								</SheetTrigger>
								<SheetContent side="right">
									<div className="flex flex-col py-4">
										<ul className="flex flex-col space-y-4">
											{sections.map((section) => (
												<li key={section.id}>
													<a
														href={`#${section.id}`}
														className="block py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
													>
														{section.name}
													</a>
												</li>
											))}
											<Separator />
											<li>
												<a
													href="https://github.com/lfades/atom"
													target="_blank"
													rel="noopener noreferrer"
													className="block py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
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
