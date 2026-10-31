const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
const { buildRfqWhatsAppUrl } = require('../src/lib/whatsapp.ts');
const { getPrefill, getDimensionLabels, buildItemRemarks } = require('../src/lib/rfqDetails.ts');
const { CANONICAL_PRODUCTS } = require('../src/lib/config.ts');
const message = data => new URL(buildRfqWhatsAppUrl(data)).searchParams.get('text');
test('multi-item handoff retains each line and its specifications', () => {
 const text = message({ name:'Buyer', company:'Works', material:'Steel', quantity:'', items:[
  {material:'Round',grade:'EN8',dimensions:'OD: 100 mm, Length: 500 mm',quantity:'2 NOS',process:'Cut Piece',condition:'Annealed',standard:'BS 970',remarks:'±1 mm'},
  {material:'Plate',grade:'IS 2062',dimensions:'Thickness: 12 mm, Width: 800 mm',quantity:'3 MT',process:'Black Bar',condition:'As rolled',standard:'IS 2062',remarks:'urgent'}
 ],deliveryLocation:'Pune',requirements:'Call first'});
 for (const value of ['1. Round','2. Plate','EN8','IS 2062','Thickness: 12 mm','Width: 800 mm','Annealed','As rolled','BS 970','±1 mm','urgent','Pune','Call first']) assert.ok(text.includes(value), value);
});
test('unusual values remain encoded as one WhatsApp text parameter', () => {
 const text=message({name:'A&B',company:'X?Y',material:'Steel',quantity:'',items:[{material:'Hex & flat',grade:'EN24/4340',quantity:'1.25 MT',remarks:'±0.5 mm & urgent'}]});
 for(const value of ['A&B','X?Y','Hex & flat','EN24/4340','1.25 MT','±0.5 mm & urgent']) assert.ok(text.includes(value));
});
test('product and grade prefill uses only known values', () => {
 const grades=['EN8','EN24'];
 assert.deepEqual(getPrefill('iron-steel-plates','en24',CANONICAL_PRODUCTS,grades),{productType:'Iron & Steel Plates (IS 2062 / Boiler Quality)',materialGrade:'EN24'});
 assert.deepEqual(getPrefill('invalid','<script>',CANONICAL_PRODUCTS,grades),{});
});
test('dimensions adapt to plate and profile forms including mobile-width layout classes', () => {
 assert.equal(getDimensionLabels('Iron & Steel Plates').plate,true);
 assert.match(getDimensionLabels('Hex Profile').primary,/Across flats/);
 assert.match(getDimensionLabels('Round Bar').primary,/diameter/);
 const form=fs.readFileSync(require.resolve('../src/components/sections/RfqForm.tsx'),'utf8');
 assert.match(form,/grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/);
 assert.match(form,/Thickness \(mm\)/);
 assert.match(form,/Width \(mm\)/);
});
test('backend-compatible remarks preserve condition, dimensions, standard and notes',()=>{
 const value=buildItemRemarks({condition:'Quenched and tempered',thickness:'12.5',width:'800',standard:'IS 2062',remarks:'±1 mm'});
 for(const part of ['Quenched and tempered','12.5','800','IS 2062','±1 mm']) assert.ok(value.includes(part));
 assert.ok(value.length<=500);
});
