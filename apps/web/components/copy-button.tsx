"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "./ui/button"

export function CopyButton() {
	const [copied, setCopied] = useState(false)
	const copyToClipboard = async () => {
		const text = document.querySelector('[data-id="code-sample"]')?.textContent
		if (text) {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		}
	}

	return (
		<Button
			variant="ghost"
			onClick={copyToClipboard}
			className="flex items-center text-xs font-medium"
		>
			{copied ? (
				<>
					<Check className="mr-1 h-3.5 w-3.5" /> Copied
				</>
			) : (
				<>
					<Copy className="mr-1 h-3.5 w-3.5" /> Copy
				</>
			)}
		</Button>
	)
}
