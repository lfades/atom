import { Separator } from "@/components/ui/separator"

export function Footer() {
	return (
		<footer className="border-t py-12 bg-pane-1">
			<div className="flex flex-col mx-auto max-w-7xl px-4 items-center sm:px-6 lg:px-8">
				<p className="text-sm">
					@lfades/atom - Straightforward state management library for React
				</p>
				<div className="w-3xs">
					<Separator className="mx-auto my-4" />
				</div>
				<p className="text-sm">
					Made with <span className="text-danger">❤</span> by{" "}
					<a
						href="https://github.com/lfades"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-link hover:text-link-hover underline underline-offset-2"
					>
						Luis Alvarez
					</a>
				</p>
			</div>
		</footer>
	)
}
