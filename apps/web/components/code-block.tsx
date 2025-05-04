import "server-only"
import { createCssVariablesTheme, createHighlighter } from "shiki"

type Props = Omit<React.HTMLProps<HTMLDivElement>, "children"> & {
	lang: "tsx"
	children: string
}

const theme = createCssVariablesTheme({
	name: "css-variables",
	variablePrefix: "--shiki-",
	variableDefaults: {},
	fontStyle: true,
})

const highlighterPromise = createHighlighter({
	themes: [theme],
	langs: ["tsx"],
})

export async function CodeBlock({ children, lang, ...rest }: Props) {
	const highlighter = await highlighterPromise
	const html = highlighter.codeToHtml(children, {
		lang,
		theme: "css-variables",
	})

	// biome-ignore lint/security/noDangerouslySetInnerHtml: This is fine.
	return <div {...rest} dangerouslySetInnerHTML={{ __html: html }} />
}
