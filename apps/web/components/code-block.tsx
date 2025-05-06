import "server-only"
import type { CSSProperties } from "react"
import {
	createCssVariablesTheme,
	createHighlighter,
	type HighlighterGeneric,
} from "shiki"

type Props = Omit<React.HTMLProps<HTMLDivElement>, "children"> & {
	lang: "tsx" | "bash"
	children: string
	card?: boolean
}

const theme = createCssVariablesTheme({
	name: "css-variables",
	variablePrefix: "--shiki-",
	variableDefaults: {},
	fontStyle: true,
})

// This function gets initialized in instrumentation.ts to prevent Shiki
// from being initialized multiple times.
export function initHighlighter(): Promise<
	HighlighterGeneric<"tsx" | "bash", string>
> {
	const _global = globalThis as any

	_global.shikiHighlighter =
		_global.shikiHighlighter ||
		createHighlighter({
			themes: [theme],
			langs: ["tsx", "bash"],
		})

	return _global.shikiHighlighter
}

export async function CodeBlock({ children, lang, card, ...rest }: Props) {
	const highlighter = await initHighlighter()
	const html = highlighter.codeToHtml(children, {
		lang,
		theme: "css-variables",
	})
	const style = card
		? ({ "--shiki-background": "var(--card)" } as CSSProperties)
		: {}

	return (
		// biome-ignore lint/security/noDangerouslySetInnerHtml: This is fine.
		<div {...rest} dangerouslySetInnerHTML={{ __html: html }} style={style} />
	)
}
