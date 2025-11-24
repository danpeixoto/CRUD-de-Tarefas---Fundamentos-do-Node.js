import { parse } from 'csv-parse';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log(path.join(__dirname, 'input.csv'), __dirname);
  const parser = fs.createReadStream(path.join(__dirname, 'input.csv')).pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
    }),
  );
  for await (const record of parser) {
    try {
      const result = await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
      const resultContent = await result.json();
      console.log('Imported record:', { ...record, id: resultContent.id });
      console.debug('result', resultContent);
    } catch (exception) {
      console.error('Error importing record:', record, exception);
    }
  }
})();
