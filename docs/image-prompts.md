# Prompts das imagens de prévia

Estas são as imagens **fixas** que aparecem na prévia gratuita, antes da compra.
Cada tema tem 4 imagens (1 capa + 3 páginas), sempre as mesmas para todo
visitante. Isso é de propósito: gerar imagem nova para cada visitante custaria
caro em quem nem comprou. A ilustração personalizada de verdade, com o rosto da
criança, só é gerada depois do pagamento.

São **24 imagens no total**: 6 temas x 4 imagens.

## Como gerar

**Faça um tema por conversa no ChatGPT.** Isso é o que mantém o mesmo
personagem nas 4 imagens do tema. Cole o "prompt base" do tema primeiro, gere a
capa, e depois peça as páginas 1, 2 e 3 na mesma conversa, sempre pedindo para
manter o mesmo personagem e o mesmo estilo.

A criança precisa ser **genérica e neutra**: não é a criança de ninguém, é só
uma amostra do estilo. Evite traços muito marcantes.

## Onde salvar

```
public/preview-templates/dinossauros/cover.jpg
public/preview-templates/dinossauros/page-1.jpg
public/preview-templates/dinossauros/page-2.jpg
public/preview-templates/dinossauros/page-3.jpg
```

E o mesmo para as pastas: `espaco`, `piratas`, `magia`, `animais`, `fundo-do-mar`.

Mantenha exatamente esses nomes. É só salvar por cima dos arquivos atuais.

## Tamanhos

| Arquivo | Proporção | Resolução sugerida |
|---|---|---|
| `cover.jpg` | 3:4 retrato | 1024 x 1536 |
| `page-1/2/3.jpg` | 4:3 paisagem | 1536 x 1152 |

---

## Prompt base (cole no início de cada conversa)

```
Vou pedir uma sequência de 4 ilustrações para um livro infantil. Regras que
valem para todas:

- Estilo 3D tipo Pixar/Disney, cores quentes e vibrantes, iluminação suave
- O personagem é uma criança genérica de uns 6 anos, expressão alegre e
  curiosa, aparência neutra e universal
- MUITO IMPORTANTE: a mesma criança e o mesmo companheiro devem aparecer em
  todas as 4 imagens, com o mesmo rosto, o mesmo cabelo e a mesma roupa
- Sem nenhum texto, letra, número ou marca d'água na imagem
- Qualidade alta, acabamento de capa de livro infantil premium

Confirme que entendeu e eu mando a primeira imagem.
```

---

## Dinossauros

**cover.jpg** (3:4 retrato, 1024x1536)
```
Imagem 1 de 4, formato retrato 3:4 (1024x1536). A criança ao lado de um
dinossauro gigante e gentil de pescoço longo, os dois sorrindo para frente,
num vale pré-histórico exuberante com samambaias enormes e uma cachoeira ao
fundo. Enquadramento de capa de livro, criança em destaque.
```

**page-1.jpg** (4:3 paisagem, 1536x1152)
```
Imagem 2 de 4, formato paisagem 4:3 (1536x1152), mesma criança e mesmo
dinossauro. Começo da aventura: a criança agachada, descobrindo com espanto
uma pegada enorme na lama da trilha.
```

**page-2.jpg**
```
Imagem 3 de 4, paisagem 4:3, mesma criança e mesmo dinossauro. Meio da
aventura: os dois atravessando juntos um riacho entre pedras, cheios de
empolgação.
```

**page-3.jpg**
```
Imagem 4 de 4, paisagem 4:3, mesma criança e mesmo dinossauro. Final feliz:
os dois comemorando abraçados numa clareira, com luz dourada de fim de tarde.
```

---

## Espaço

**cover.jpg** (3:4 retrato)
```
Imagem 1 de 4, formato retrato 3:4 (1024x1536). A criança de traje espacial
segurando o capacete, ao lado de um alienígena verde pequeno e simpático que
acena, com planetas coloridos e estrelas ao fundo. Enquadramento de capa.
```

**page-1.jpg** (4:3 paisagem)
```
Imagem 2 de 4, paisagem 4:3, mesma criança e mesmo alienígena. Começo: a
criança encontrando uma nave brilhante pousada no quintal de casa, à noite.
```

**page-2.jpg**
```
Imagem 3 de 4, paisagem 4:3, mesma dupla. Meio: os dois dentro da nave,
diante de um painel cheio de botões luminosos.
```

**page-3.jpg**
```
Imagem 4 de 4, paisagem 4:3, mesma dupla. Final: os dois flutuando felizes
diante de um planeta colorido recém-descoberto.
```

---

## Piratas

**cover.jpg** (3:4 retrato)
```
Imagem 1 de 4, formato retrato 3:4 (1024x1536). A criança vestida de pirata,
com um papagaio colorido no ombro, segurando um mapa do tesouro, no convés de
um navio em mar azul-turquesa. Enquadramento de capa.
```

**page-1.jpg** (4:3 paisagem)
```
Imagem 2 de 4, paisagem 4:3, mesma criança e mesmo papagaio. Começo: a
criança desenrolando um mapa antigo na areia da praia.
```

**page-2.jpg**
```
Imagem 3 de 4, paisagem 4:3, mesma dupla. Meio: o navio navegando entre
recifes, a criança apontando o caminho com uma bússola na mão.
```

**page-3.jpg**
```
Imagem 4 de 4, paisagem 4:3, mesma dupla. Final: o baú do tesouro aberto na
praia, a criança comemorando com o papagaio voando em volta.
```

---

## Magia

**cover.jpg** (3:4 retrato)
```
Imagem 1 de 4, formato retrato 3:4 (1024x1536). A criança ao lado de uma fada
pequena e brilhante, numa floresta encantada com luzes mágicas flutuando no
ar entre árvores antigas. Enquadramento de capa.
```

**page-1.jpg** (4:3 paisagem)
```
Imagem 2 de 4, paisagem 4:3, mesma criança e mesma fada. Começo: a criança
seguindo um caminho de luzinhas douradas entre as árvores.
```

**page-2.jpg**
```
Imagem 3 de 4, paisagem 4:3, mesma dupla. Meio: um portal de luz dourada se
abrindo entre duas árvores enormes, a criança olhando maravilhada.
```

**page-3.jpg**
```
Imagem 4 de 4, paisagem 4:3, mesma dupla. Final: a criança de braços abertos
numa clareira iluminada, cercada de luzinhas mágicas comemorando.
```

---

## Animais

**cover.jpg** (3:4 retrato)
```
Imagem 1 de 4, formato retrato 3:4 (1024x1536). A criança ao lado de uma
raposa fofa e curiosa, numa floresta colorida cheia de flores e pequenos
animais ao fundo. Enquadramento de capa.
```

**page-1.jpg** (4:3 paisagem)
```
Imagem 2 de 4, paisagem 4:3, mesma criança e mesma raposa. Começo: a criança
encontrando a raposa espiando atrás de um tronco.
```

**page-2.jpg**
```
Imagem 4:3 paisagem, imagem 3 de 4, mesma dupla. Meio: a criança sentada numa
roda com vários animais da floresta reunidos, uma coruja sábia num galho.
```

**page-3.jpg**
```
Imagem 4 de 4, paisagem 4:3, mesma dupla. Final: todos os animais em festa
com a criança no centro, luz de fim de tarde entre as árvores.
```

---

## Fundo do Mar

**cover.jpg** (3:4 retrato)
```
Imagem 1 de 4, formato retrato 3:4 (1024x1536). A criança nadando ao lado de
uma tartaruga marinha gentil, num recife de corais coloridos com raios de sol
atravessando a água. Enquadramento de capa.
```

**page-1.jpg** (4:3 paisagem)
```
Imagem 2 de 4, paisagem 4:3, mesma criança e mesma tartaruga. Começo: a
criança encontrando uma concha brilhante na areia do fundo do mar.
```

**page-2.jpg**
```
Imagem 3 de 4, paisagem 4:3, mesma dupla. Meio: os dois atravessando um
cardume colorido de peixes que abre caminho.
```

**page-3.jpg**
```
Imagem 4 de 4, paisagem 4:3, mesma dupla. Final: um portão de corais se
abrindo para um reino submerso brilhante, a criança comemorando.
```

---

## Imagens do topo da página (hero)

Já estão prontas em `public/hero/`, mas se quiser refazer:

- `gabriel-foto.png`: foto real de criança, retrato 3:4, rosto centralizado
- `gabriel-heroi.png`: a mesma criança em versão ilustrada 3D, retrato 3:4

## Imagens do livro de exemplo

Ver instruções em `public/demo/LEIA-ME.txt`. Use os mesmos prompts do tema
Dinossauros, já que o exemplo é "Gabriel e a Jornada no Vale dos Dinossauros".
