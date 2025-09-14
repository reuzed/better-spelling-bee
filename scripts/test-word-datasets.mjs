import { listDatasets, iterTextLines } from 'word-datasets';

console.log('Datasets:', listDatasets());
let i = 0;
for await (const w of iterTextLines('words.txt')) {
  if (i++ < 5) console.log('sample:', w);
  else break;
}
