"use client"

import { useMobileSimulator } from "@/components/comp/MobileSimulator/provider/MobileSimulatorContext"
import { Button } from "@/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const { setShowMobile } = useMobileSimulator()

  const handleCtaClick = () => {
    if (session?.user) {
      router.push("/dashboard")
    } else {
      setShowMobile((prev) => !prev)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">
            The most comprehensive
            <br />
            User Management Platform
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Need more than just a sign-in box? Clerk is a complete suite of embeddable UIs, flexible APIs, and admin
            dashboards to authenticate and manage your users.
          </p>
          <Button size="lg" className="rounded-full px-8" onClick={handleCtaClick}>
            Get Started
          </Button>
        </section>

        {/* Start Now Section */}
        <section className="bg-muted py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold mb-4">
                Start now,
                <br />
                no strings attached
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Integrate complete user management in minutes.
                <br />
                Free open-source library. No credit cards required.
              </p>
              <Button size="lg" variant="outline" className="rounded-full px-8" onClick={handleCtaClick}>
                Start Building
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Components
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Feature requests
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Developer</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Documents
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Discord server
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Terms and Conditions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Privacy policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-muted-foreground hover:text-foreground">
                      Cookie manager
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}

