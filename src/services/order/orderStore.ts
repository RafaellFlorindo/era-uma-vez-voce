import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Order } from "@/types/order";

/**
 * Contrato de persistência de pedidos. Trocar arquivo por Postgres/Supabase
 * depois deve exigir só uma nova implementação daqui, sem tocar nas rotas.
 */
export interface OrderStore {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByToken(token: string): Promise<Order | null>;
  findByTransactionId(transactionId: string): Promise<Order | null>;
  findByEmail(email: string): Promise<Order | null>;
  update(id: string, patch: Partial<Order>): Promise<Order>;
  saveEbook(id: string, bytes: Uint8Array): Promise<string>;
  readEbook(file: string): Promise<Uint8Array>;
}

export function newOrderId(): string {
  return randomUUID();
}

/**
 * 32 bytes de entropia: o token é a única coisa entre um estranho e o livro
 * (com a foto da criança dentro), então precisa ser inadivinhável.
 */
export function newOrderToken(): string {
  return randomBytes(24).toString("base64url");
}

const DATA_ROOT = process.env.ORDER_STORE_DIR
  ? path.resolve(process.env.ORDER_STORE_DIR)
  : path.join(process.cwd(), ".data");

const ORDERS_DIR = path.join(DATA_ROOT, "orders");
const EBOOKS_DIR = path.join(DATA_ROOT, "ebooks");

/**
 * Implementação em arquivo.
 *
 * Serve para desenvolvimento e para um primeiro deploy em máquina única.
 * NÃO serve para serverless com várias instâncias (Vercel): cada instância
 * teria seu próprio disco efêmero e o webhook cairia numa instância que não
 * enxerga o pedido criado por outra. Antes de escalar assim, trocar esta
 * implementação por banco de verdade — o resto do código não muda.
 */
class FileOrderStore implements OrderStore {
  private async ensureDirs() {
    await mkdir(ORDERS_DIR, { recursive: true });
    await mkdir(EBOOKS_DIR, { recursive: true });
  }

  private orderPath(id: string) {
    return path.join(ORDERS_DIR, `${id}.json`);
  }

  private async readAll(): Promise<Order[]> {
    await this.ensureDirs();
    const files = await readdir(ORDERS_DIR).catch(() => [] as string[]);
    const orders = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          try {
            return JSON.parse(await readFile(path.join(ORDERS_DIR, file), "utf8")) as Order;
          } catch {
            return null;
          }
        }),
    );
    return orders.filter((order): order is Order => order !== null);
  }

  async create(order: Order): Promise<Order> {
    await this.ensureDirs();
    await writeFile(this.orderPath(order.id), JSON.stringify(order, null, 2), "utf8");
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    // Sanitiza: `id` chega de webhook externo e vira nome de arquivo.
    if (!/^[a-zA-Z0-9-]+$/.test(id)) return null;
    try {
      return JSON.parse(await readFile(this.orderPath(id), "utf8")) as Order;
    } catch {
      return null;
    }
  }

  async findByToken(token: string): Promise<Order | null> {
    const orders = await this.readAll();
    return orders.find((order) => order.token === token) ?? null;
  }

  async findByTransactionId(transactionId: string): Promise<Order | null> {
    const orders = await this.readAll();
    return orders.find((order) => order.payment?.transactionId === transactionId) ?? null;
  }

  async findByEmail(email: string): Promise<Order | null> {
    const target = email.trim().toLowerCase();
    const orders = await this.readAll();
    // O mais recente ganha: se a pessoa comprou duas vezes, o pedido que
    // acabou de ser criado é o que corresponde a este pagamento.
    return (
      orders
        .filter((order) => order.customer?.email?.toLowerCase() === target)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] ?? null
    );
  }

  async update(id: string, patch: Partial<Order>): Promise<Order> {
    const current = await this.findById(id);
    if (!current) throw new Error(`Pedido ${id} não encontrado.`);

    const next: Order = { ...current, ...patch, id: current.id, updatedAt: new Date().toISOString() };
    await writeFile(this.orderPath(id), JSON.stringify(next, null, 2), "utf8");
    return next;
  }

  async saveEbook(id: string, bytes: Uint8Array): Promise<string> {
    await this.ensureDirs();
    const file = `${id}.pdf`;
    await writeFile(path.join(EBOOKS_DIR, file), bytes);
    return file;
  }

  async readEbook(file: string): Promise<Uint8Array> {
    if (!/^[a-zA-Z0-9-]+\.pdf$/.test(file)) throw new Error("Nome de arquivo inválido.");
    return new Uint8Array(await readFile(path.join(EBOOKS_DIR, file)));
  }
}

const store: OrderStore = new FileOrderStore();

export function getOrderStore(): OrderStore {
  return store;
}
