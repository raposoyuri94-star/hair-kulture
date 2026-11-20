import { siteUrl } from './urls';
import { getHairPrice, priceLists } from './prices';

export const catalog = priceLists.map((list, id) => ({
  id, name: list.name,
  image: siteUrl(['/images/wigs.png', '/images/bundles.png', '/images/campaign.png'][id]),
  photoClass: ['wigs', 'bundles', 'campaign'][id],
  description: [
    'Escolha o comprimento e a densidade da sua half wig.',
    'Escolha o comprimento e a textura. Cada conjunto inclui 2 saias.',
    'Escolha o comprimento e o tipo de closure ou frontal lace.',
  ][id],
  startingPrice: Math.min(...list.rows.flat().filter((value): value is number => value !== null)),
}));

export type BagItem = { category: number; length: number; option: number; quantity: number };
export const variantKey = (item: Omit<BagItem, 'quantity'>) => `${item.category}:${item.length}:${item.option}`;
export const money = (value: number) => `${new Intl.NumberFormat('pt-MZ', { maximumFractionDigits: 0 }).format(value)} MT`;

export function restoreBag(value: unknown): BagItem[] {
  if (!Array.isArray(value)) return [];
  const result: BagItem[] = [];
  for (const item of value) {
    if (!item || !Number.isInteger(item.category) || !Number.isInteger(item.length) || !Number.isInteger(item.option) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20 || getHairPrice(item.category, item.length, item.option) === null) continue;
    const existing = result.find(row => variantKey(row) === variantKey(item));
    if (existing) existing.quantity = Math.min(20, existing.quantity + item.quantity);
    else result.push({ category: item.category, length: item.length, option: item.option, quantity: item.quantity });
  }
  return result;
}
