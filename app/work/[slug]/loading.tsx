import { SiteNavbar } from '@/components/site-navbar'
import { ThreeDotsLoader } from '@/components/three-dots-loader'

export default function WorkDetailLoading() {
  return (
    <>
      <SiteNavbar logoHref="/" />
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <ThreeDotsLoader />
      </main>
    </>
  )
}
