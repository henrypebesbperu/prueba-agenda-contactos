# Bitácora de operaciones

| Fecha | Quién | Acción | Resultado | Decisión o nota |
|---|---|---|---|---|
| 2026-10-23 | Henry (Agente Base, Claude Code) | Creó `index.html` (alta de contactos, persistencia, contador) y `sql/001_crear_tabla_contactos.sql` | ✔ Alta y persistencia funcionan | Proyecto entregado sin terminar a propósito, para probar el traspaso por GitHub |
| 2026-10-26 | Henry (Agente Base, Cowork) | Clonó el repo (se hizo público para poder clonarlo), rama `feature/busqueda-baja-duplicados`: pendientes 1–3 en `index.html`, `sql/002_baja_contacto.sql`, pruebas `pruebas/e2e.js` y tabla con scroll propio en móvil | ✔ 15/15 pruebas E2E en Chromium; 002 validado en un PostgreSQL 16 desechable (1 fila, repetición 0 filas, reversión bloqueada por duplicado activo) | El 002 no se ejecutó en ninguna BD real. Push/PR pendientes: el token de GitHub de la sesión no es válido |
| 2026-10-26 | Henry (Agente Base, Cowork) | Henry subió la rama desde su carpeta local, abrió el PR #1 y lo fusionó en `main` (`c0d8fdc`) | ✔ `main` coincide con lo probado (15/15 E2E) | Proyecto cerrado. Lecciones: la tarea debe crearse con el repo como fuente de GitHub para que el agente pueda hacer push; sin terminal en el PC, la carpeta local se publicó sin `.git` y hubo que enlazarla con `git init` + `git reset origin/main` |

## Pendientes para quien continúe
> Estado al 2026-10-26: **todos completados** (1–6). PR #1 fusionado en `main`. Proyecto cerrado.

1. **Búsqueda:** campo que filtre por nombre o correo mientras se escribe, sin distinguir mayúsculas.
2. **Dar de baja:** botón por fila, con confirmación, que marque `estado = 'INACTIVO'` y `fechaBaja` (baja lógica; nunca borrar del arreglo).
3. **Correo duplicado:** impedir agregar un correo que ya tenga otro contacto activo y mostrar un aviso.
4. **SQL de baja:** escribir `_agente/sql/002_baja_contacto.sql` para PostgreSQL, con cabecera, `COUNT` previo, transacción, `RETURNING` y su reversión. **No ejecutarlo** (no hay base de datos).
5. **Trabajar en local:** clonar el repositorio en la ruta estándar (ver `PROYECTO.md`), verificar los puntos 1 a 3 en el navegador y actualizar `INDICE.md`.
6. **Cerrar:** registrar una fila nueva en esta tabla, hacer commit en una rama `feature/` y, con confirmación, push y pull request hacia `main`.
