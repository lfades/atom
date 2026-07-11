import { AdvancedPatterns } from "@/components/advanced-patterns"
import { API } from "@/components/api-reference"
import { FAQ } from "@/components/faq"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Installation } from "@/components/installation"
import { Navigation } from "@/components/navigation"

export default function Home() {
	return (
		<div className="min-h-screen bg-pane">
			<Navigation />
			<main>
				<Hero />
				<Features />
				<Installation />
				<API />
				<AdvancedPatterns />
				<FAQ />
			</main>
			<Footer />
		</div>
	)
}
