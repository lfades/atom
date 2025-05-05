import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { Installation } from "@/components/installation"
import { API } from "@/components/api-reference"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function Home() {
	return (
		<div className="min-h-screen bg-pane">
			<Navigation />
			<main>
				<Hero />
				<Features />
				<Installation />
				<API />
				<FAQ />
			</main>
			<Footer />
		</div>
	)
}
