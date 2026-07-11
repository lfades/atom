import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "@lfades/atom - Straightforward state management for React",
	description:
		"A minimal state management library for React with a simple API.",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider attribute="data-theme" enableSystem>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
