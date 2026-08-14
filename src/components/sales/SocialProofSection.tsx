import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ImageWithPlaceholder } from "@/components/ui/ImageWithPlaceholder";
import { testimonials } from "@/config/testimonials";

export function SocialProofSection() {
  return (
    <section className="bg-cream-dark py-14 sm:py-20">
      <Container>
        <SectionTitle
          title="O que os pais contam depois da primeira leitura"
          subtitle="Histórias de quem já viu a reação do filho ao se reconhecer no livro."
        />

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <figure
              key={index}
              className="flex flex-col rounded-card bg-white p-5 shadow-sm shadow-ink/5"
            >
              <Quote className="h-5 w-5 shrink-0 text-accent" />

              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                {testimonial.quote}
              </blockquote>

              <figcaption className="mt-4 flex items-center gap-3 border-t border-ink/10 pt-4">
                <ImageWithPlaceholder
                  src={testimonial.photoUrl}
                  alt={`Foto de ${testimonial.authorName}`}
                  placeholderLabel="Foto"
                  className="h-11 w-11 shrink-0 rounded-full"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{testimonial.authorName}</p>
                  <p className="truncate text-xs text-ink-soft">{testimonial.authorContext}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
