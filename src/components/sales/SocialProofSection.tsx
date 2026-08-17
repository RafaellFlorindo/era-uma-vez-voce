import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import { whatsappTestimonials } from "@/config/testimonials";

export function SocialProofSection() {
  return (
    <section className="paper-panel py-16 sm:py-24">
      <Container>
        <SectionTitle
          title="O que os pais contam depois da primeira leitura"
          subtitle="Prints reais de conversa de quem já viu a reação do filho ao se reconhecer no livro."
        />

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {whatsappTestimonials.map((testimonial) => (
            <div
              key={testimonial.imageUrl}
              className="overflow-hidden rounded-card bg-white p-1.5 shadow-sm shadow-ink/5 ring-1 ring-ink/5"
            >
              <ImageWithPlaceholder
                src={testimonial.imageUrl}
                alt={`Conversa de WhatsApp com ${testimonial.authorName} sobre o livro`}
                placeholderLabel="Print de conversa"
                className="aspect-[9/16] w-full rounded-md"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
