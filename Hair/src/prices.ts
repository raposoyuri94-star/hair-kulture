// Prices in MT, transcribed from the three supplied Kulture price lists.
// Rows are lengths; columns follow each category's options. null = dash in source.
export const priceLists = [
  {
    name: 'Half Wigs', optionLabel: 'Densidade',
    options: ['150%', '180%', '200%', '210%', '230%', '250%', '300%'],
    lengths: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
    note: 'Preço por 1 half wig, para uma cabeça completa com volume natural.',
    rows: [
      [5000,5300,5600,5800,6100,6400,7000],
      [5300,5600,5900,6200,6500,6800,7300],
      [5700,6000,6300,6600,6900,7200,7800],
      [6000,6300,6700,6900,7300,7600,8200],
      [6500,6900,7200,7600,7900,8300,8800],
      [7100,7500,7800,8200,8500,8900,10100],
      [8100,8500,8900,9300,9700,10100,11700],
      [9200,9600,10100,10500,10900,11300,12000],
      [10100,11200,11700,12100,13000,14000,15700],
      [12700,13700,14700,15100,16300,17000,18700],
      [14500,15500,16800,17200,18700,19700,21300],
    ],
  },
  {
    name: 'Saias', optionLabel: 'Textura',
    options: ['Liso / Kinky liso', 'Ondulado / Encaracolado / Crespo'],
    lengths: [10,12,14,16,18,20,22,24,26,28,30,32],
    note: 'Preço por 2 saias, para uma cabeça completa com volume natural.',
    rows: [
      [4800,5300],[5350,5850],[6000,6500],[6700,7200],
      [7400,7900],[7900,8400],[8700,9200],[9500,10000],
      [10300,10800],[11400,11900],[12500,13000],[13750,14250],
    ],
  },
  {
    name: 'Closure / Frontal Laces', optionLabel: 'Tipo de lace',
    options: ['2x6','2x6 HD','4x4','4x4 HD','5x5','5x5 HD','6x6','6x6 HD','7x7','7x7 HD','13x4','13x4 HD','13x6','13x6 HD','360','360 HD','9x6 HD','7x5 HD'],
    lengths: [10,12,14,16,18,20,22,24],
    note: 'Preço conforme o comprimento e o tipo de closure ou frontal lace.',
    rows: [
      [3400,4200,3400,4200,3800,4700,4900,5400,null,null,3900,5600,5100,6400,null,null,null,null],
      [3400,4200,3400,4200,3800,4700,4900,5500,5400,6500,4000,5800,5200,6600,null,7400,6900,5700],
      [3500,4200,3500,4300,3900,4800,4900,5600,5600,6600,4200,5900,5200,6700,5500,7600,7200,5800],
      [3600,4300,3700,4500,4200,5000,5100,5900,5700,6700,4500,6100,5600,7000,5700,7700,7400,5900],
      [3800,4500,3900,4700,4600,5200,5400,6200,6200,7200,4900,6500,6000,7400,5900,8100,7700,6200],
      [4000,4500,4200,4900,4900,5600,5800,6500,6800,7900,5400,6800,6700,8100,6400,8800,8100,6600],
      [4300,4700,4500,5200,5200,6000,6300,7000,7400,8500,6000,7400,7300,8700,7100,9500,8400,6800],
      [null,4900,5100,5400,6100,6600,7200,8200,null,null,7200,8300,8300,9500,null,null,null,null],
    ],
  },
];

export function getHairPrice(category: number, length: number, option: number): number | null {
  const list = priceLists[category];
  return list?.rows[list.lengths.indexOf(length)]?.[option] ?? null;
}
