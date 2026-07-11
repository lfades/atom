"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"

export function CopyButton({
	id,
	variant = "simple",
	className,
}: {
	variant?: "simple" | "complete"
	id: string
	className?: string
}) {
	const [copied, setCopied] = useState(false)
	const copyToClipboard = async () => {
		const text = document.querySelector(`[data-id="${id}"]`)?.textContent
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
			className={cn("flex items-center text-xs font-medium", className)}
		>
			{copied ? (
				<>
					<Check className="h-3.5 w-3.5" />
					{variant === "simple" ? "" : "Copied"}
				</>
			) : (
				<>
					<Copy className="h-3.5 w-3.5" /> {variant === "simple" ? "" : "Copy"}
				</>
			)}
		</Button>
	)
}
