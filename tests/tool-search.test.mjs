import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { matchesSearch } from '../src/utils/tool-search.mjs';

const qr = ['Generador de Códigos QR', 'Crea códigos QR personalizados', 'https://qr.devcito.org'];
const json = ['Formateador, Stringificador y Desstringificador JSON', 'Formateá y validá JSON', '/tools/json-formatter'];

test('encuentra coincidencias sin distinguir tildes o mayúsculas', () => {
  assert.equal(matchesSearch('CODIGOS qr', ...qr), true);
  assert.equal(matchesSearch('  formatea  ', ...json), true);
});

test('encuentra palabras en cualquier orden y en distintos campos', () => {
  assert.equal(matchesSearch('json validá formateador', ...json), true);
  assert.equal(matchesSearch('json qr', ...json), false);
});

test('busca en rutas y normaliza separadores', () => {
  assert.equal(matchesSearch('json formatter', ...json), true);
  assert.equal(matchesSearch('.gitignore', 'Generador de .gitignore'), true);
  assert.equal(matchesSearch('gitignore', 'Generador de .gitignore'), true);
});

test('muestra todo para consultas vacías y rechaza términos inexistentes', () => {
  assert.equal(matchesSearch('   ', ...json), true);
  assert.equal(matchesSearch('inexistente', ...json), false);
});
