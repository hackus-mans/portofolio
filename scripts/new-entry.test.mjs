import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createEntry } from './new-entry.mjs';

test('publication: validates inputs, preserves text and refuses overwrites', async () => {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-entry-'));
  try {
    const entry = {category:'notes', title:'Permissions : "Linux" / ../test', summary:'Une ligne\navec "guillemets"', body:'## Test\n\n`$(echo example)`\n\nRésultat réel.', tags:'Linux, SOC',status:'published'};
    const file = await createEntry(entry, root);
    assert.match(file, /^src\/content\/notes\/\d{4}-\d{2}-\d{2}-permissions-linux-test\.md$/);
    const text = await readFile(join(root, file), 'utf8');
    assert.ok(text.endsWith(entry.body+'\n'));
    assert.ok(text.includes('summary: '+JSON.stringify(entry.summary)));
    await assert.rejects(createEntry(entry,root), {code:'EEXIST'});
    await assert.rejects(createEntry({...entry,category:'../../public'},root));
    await assert.rejects(createEntry({...entry,body:''},root));
    for(const category of ['labs','writeups']) {
      const file=await createEntry({...entry,category},root);
      const text=await readFile(join(root,file),'utf8');
      assert.ok(text.includes(category==='labs'?'domain:':'platform:'));
    }
    const draft=await createEntry({title:'Brouillon',summary:'À compléter'},root);
    assert.ok((await readFile(join(root,draft),'utf8')).includes('status: "draft"'));
  } finally {await rm(root,{recursive:true,force:true});}
});
