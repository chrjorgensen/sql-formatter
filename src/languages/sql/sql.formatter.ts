import { expandPhrases } from 'src/expandPhrases';
import Formatter from 'src/formatter/Formatter';
import { DialectFormatOptions } from 'src/formatter/ExpressionFormatter';
import Tokenizer from 'src/lexer/Tokenizer';
import { functions } from './sql.functions';
import { keywords } from './sql.keywords';

const reservedSelect = expandPhrases(['SELECT [ALL | DISTINCT]']);

const reservedClauses = expandPhrases([
  // queries
  'WITH [RECURSIVE]',
  'FROM',
  'WHERE',
  'GROUP BY [ALL | DISTINCT]',
  'HAVING',
  'WINDOW',
  'PARTITION BY',
  'ORDER BY',
  'LIMIT',
  'OFFSET',
  'FETCH {FIRST | NEXT}',
  // Data manipulation
  // - insert:
  'INSERT INTO',
  'VALUES',
  // - update:
  'UPDATE',
  'SET',
  'WHERE CURRENT OF',
  // - delete:
  'DELETE FROM',
  // Data definition
  'CREATE [RECURSIVE] VIEW',
  'CREATE [GLOBAL TEMPORARY | LOCAL TEMPORARY] TABLE',
  'DROP TABLE',
  // - alter table:
  'ALTER TABLE',
  'ADD COLUMN',
  'DROP [COLUMN]',
  'RENAME COLUMN',
  'RENAME TO',
  'ALTER [COLUMN]',
  '{SET | DROP} DEFAULT', // for alter column
  'ADD SCOPE', // for alter column
  'DROP SCOPE {CASCADE | RESTRICT}', // for alter column
  'RESTART WITH', // for alter column
]);

const onelineClauses = expandPhrases([
  // - truncate:
  'TRUNCATE TABLE',
  // other
  'SET SCHEMA',
]);

const reservedSetOperations = expandPhrases([
  'UNION [ALL | DISTINCT]',
  'EXCEPT [ALL | DISTINCT]',
  'INTERSECT [ALL | DISTINCT]',
]);

const reservedJoins = expandPhrases([
  'JOIN',
  '{LEFT | RIGHT | FULL} [OUTER] JOIN',
  '{INNER | CROSS} JOIN',
  'NATURAL [INNER] JOIN',
  'NATURAL {LEFT | RIGHT | FULL} [OUTER] JOIN',
]);

const reservedPhrases = expandPhrases([
  'ON {UPDATE | DELETE} [SET NULL | SET DEFAULT]',
  '{ROWS | RANGE} BETWEEN',
]);

export default class SqlFormatter extends Formatter {
  tokenizer() {
    return new Tokenizer({
      reservedSelect,
      reservedClauses: [...reservedClauses, ...onelineClauses],
      reservedSetOperations,
      reservedJoins,
      reservedPhrases,
      reservedKeywords: keywords,
      reservedFunctionNames: functions,
      stringTypes: [
        { quote: "''-qq-bs", prefixes: ['N', 'U&'] },
        { quote: "''-raw", prefixes: ['X'], requirePrefix: true },
      ],
      identTypes: [`""-qq`, '``'],
      paramTypes: { positional: true },
      operators: ['||'],
    });
  }

  formatOptions(): DialectFormatOptions {
    return {
      onelineClauses,
    };
  }
}
