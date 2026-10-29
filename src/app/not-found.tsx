import { ButtonLink, Container } from '@/components/ui'

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="text-sm font-semibold tracking-[0.14em] text-accent-ink uppercase">Page not found</p>
      <h1 className="mt-3 text-4xl">We couldn&apos;t find that page</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">The page may have moved, or the link may be incorrect.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/contact" variant="secondary">
          Contact us
        </ButtonLink>
      </div>
    </Container>
  )
}
