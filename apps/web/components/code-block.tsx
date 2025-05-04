import type { CSSProperties } from "react"
import "server-only"
import { createCssVariablesTheme, createHighlighter } from "shiki"

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

const highlighterPromise = createHighlighter({
	themes: [theme],
	langs: ["tsx", "bash"],
})

export async function CodeBlock({ children, lang, card, ...rest }: Props) {
	const highlighter = await highlighterPromise
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
