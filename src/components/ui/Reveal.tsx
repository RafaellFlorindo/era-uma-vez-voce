"use client";

import { ElementType, ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  /** Atraso em ms — use para escalonar itens de uma mesma lista. */
  delay?: number;
  as?: ElementType;
  className?: string;
  id?: string;
}

/**
 * Revela o conteúdo quando ele entra na viewport.
 *
 * O estado inicial invisível só é ligado depois que o JS monta e confirma
 * que há IntersectionObserver: sem isso, quem cai na página com JS quebrado
 * veria uma página em branco, o que custaria a venda inteira. O CSS que faz
 * o trabalho está em `globals.css` (`[data-reveal]`).
 */
export function Reveal({ children, delay = 0, as, className, id }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      // Dispara um pouco antes de entrar de fato: quando o usuário chega,
      // a animação já está no meio e a página parece responder ao scroll.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      data-reveal=""
      data-reveal-armed={armed ? "true" : "false"}
      className={cn(revealed && "is-revealed", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
