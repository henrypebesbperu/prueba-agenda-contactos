// Pruebas E2E de index.html (requiere Node y Playwright con Chromium). Uso: node _agente/pruebas/e2e.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  let res=[]; const ok=(n,c)=>res.push((c?'✔ ':'✖ ')+n);
  await p.goto(require('url').pathToFileURL(require('path').join(__dirname,'..','..','index.html')).href);
  const add=async(n,c,t)=>{await p.fill('#nombre',n);await p.fill('#correo',c);await p.fill('#telefono',t);await p.click('button[type=submit]');};
  await add('Ana Pérez','ana@x.com','987654321'); await add('Luis Soto','luis@y.pe','912345678'); await add('María Ríos','maria@x.com','998877665');
  ok('alta de 3 contactos', await p.locator('#lista tr').count()===3);
  // P3 duplicado (mayúsculas)
  await add('Otra Ana','ANA@X.com','911111111');
  ok('duplicado bloqueado', await p.locator('#lista tr').count()===3);
  ok('aviso duplicado', (await p.textContent('#aviso')).includes('ana@x.com'));
  // P1 búsqueda
  await p.fill('#buscar','X.COM'); ok('búsqueda por correo sin mayúsculas → 2', await p.locator('#lista tr').count()===2);
  await p.fill('#buscar','luis'); ok('búsqueda por nombre → 1', await p.locator('#lista tr').count()===1);
  await p.fill('#buscar','zzz'); ok('sin coincidencias muestra mensaje', (await p.textContent('#lista')).includes('Ningún contacto'));
  ok('contador con filtro', (await p.textContent('#contador')).includes('0 coinciden'));
  await p.fill('#buscar','');
  // P2 baja: cancelar y aceptar
  p.once('dialog',d=>d.dismiss()); await p.locator('#lista tr').first().locator('.btn-baja').click();
  ok('cancelar no da de baja', await p.locator('#lista tr').count()===3);
  p.once('dialog',d=>d.accept()); await p.locator('#lista tr').first().locator('.btn-baja').click();
  ok('aceptar da de baja', await p.locator('#lista tr').count()===2);
  const st=await p.evaluate(()=>JSON.parse(localStorage.getItem('agenda-contactos.v1')));
  ok('baja lógica: 3 registros guardados, 1 INACTIVO con fechaBaja', st.length===3 && st.filter(c=>c.estado==='INACTIVO'&&c.fechaBaja).length===1);
  // correo dado de baja puede reutilizarse
  await add('Ana Nueva','ana@x.com','922222222'); ok('correo de un inactivo se puede reutilizar', await p.locator('#lista tr').count()===3);
  await p.reload(); ok('persistencia tras recargar', await p.locator('#lista tr').count()===3);
  // XSS
  await add('<img src=x onerror=alert(1)>','h@h.com','933333333'); ok('nombre con HTML se muestra como texto', await p.locator('#lista img').count()===0);
  // Edición
  const filaDe=(t)=>p.locator('#lista tr',{hasText:t});
  await filaDe('luis@y.pe').locator('.btn-editar').click();
  ok('editar carga los datos en el formulario', await p.inputValue('#correo')==='luis@y.pe' && (await p.textContent('#btn-guardar'))==='Guardar cambios' && await p.isVisible('#btn-cancelar'));
  ok('fila en edición resaltada', await filaDe('luis@y.pe').getAttribute('class')==='editando');
  await p.fill('#correo','MARIA@x.com'); await p.click('#btn-guardar');
  ok('editar a correo de otro activo se bloquea', (await p.textContent('#aviso')).includes('maria@x.com') && await filaDe('luis@y.pe').count()===1);
  await p.fill('#correo','luis@y.pe'); await p.fill('#telefono','955555555'); await p.click('#btn-guardar');
  ok('guardar conservando su propio correo', await filaDe('955555555').count()===1 && (await p.textContent('#btn-guardar'))==='Agregar' && !(await p.isVisible('#btn-cancelar')));
  await filaDe('luis@y.pe').locator('.btn-editar').click(); await p.fill('#nombre','Luis Cambiado'); await p.click('#btn-cancelar');
  ok('cancelar no modifica', await filaDe('Luis Soto').count()===1 && await p.inputValue('#nombre')==='');
  await filaDe('luis@y.pe').locator('.btn-editar').click(); await p.fill('#telefono','12345'); await p.click('#btn-guardar');
  ok('teléfono inválido no se guarda', await filaDe('955555555').count()===1);
  await p.click('#btn-cancelar');
  const total=(await p.evaluate(()=>JSON.parse(localStorage.getItem('agenda-contactos.v1')))).length;
  await filaDe('luis@y.pe').locator('.btn-editar').click(); await p.fill('#nombre','Luis Editado'); await p.fill('#correo','luis.nuevo@y.pe'); await p.click('#btn-guardar');
  await p.reload();
  const st2=await p.evaluate(()=>JSON.parse(localStorage.getItem('agenda-contactos.v1')));
  const luis=st2.find(c=>c.correo==='luis.nuevo@y.pe');
  ok('edición persiste, no crea registros y marca fechaModificacion', st2.length===total && luis && luis.nombre==='Luis Editado' && !!luis.fechaModificacion);
  await filaDe('luis.nuevo@y.pe').locator('.btn-editar').click();
  p.once('dialog',d=>d.accept()); await filaDe('luis.nuevo@y.pe').locator('.btn-baja').click();
  ok('dar de baja el contacto en edición sale del modo edición', (await p.textContent('#btn-guardar'))==='Agregar' && await p.inputValue('#correo')==='');
  await filaDe('maria@x.com').locator('.btn-editar').click(); await p.fill('#nombre','María Fantasma');
  await p.evaluate(()=>{ contactos.find(c=>c.correo==='maria@x.com').estado='INACTIVO'; });
  await p.click('#btn-guardar');
  ok('guardar un contacto que ya no está activo avisa y no guarda', (await p.textContent('#aviso')).includes('ya no existe') && (await p.textContent('#btn-guardar'))==='Agregar' && await p.locator('#lista tr',{hasText:'María Fantasma'}).count()===0);
  ok('sin errores de consola', errs.length===0);
  await p.setViewportSize({width:390,height:800}); ok('sin scroll horizontal en móvil', !(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth)));
  console.log(res.join('\n')); await b.close();
})();
