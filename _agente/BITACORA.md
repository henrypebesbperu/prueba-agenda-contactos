# Bitácora de operaciones

| Fecha | Quién | Acción | Resultado | Decisión o nota |
|---|---|---|---|---|
| 2026-10-23 | Henry (Agente Base, Claude Code) | Creó `index.html` (alta de contactos, persistencia, contador) y `sql/001_crear_tabla_contactos.sql` | ✔ Alta y persistencia funcionan | Proyecto entregado sin terminar a propósito, para probar el traspaso por GitHub |

## Pendientes para quien continúe
1. **Búsqueda:** campo que filtre por nombre o correo mientras se escribe, sin distinguir mayúsculas.
2. **Dar de baja:** botón por fila, con confirmación, que marque `estado = 'INACTIVO'` y `fechaBaja` (baja lógica; nunca borrar del arreglo).
3. **Correo duplicado:** impedir agregar un correo que ya tenga otro contacto activo y mostrar un aviso.
4. **SQL de baja:** escribir `_agente/sql/002_baja_contacto.sql` para PostgreSQL, con cabecera, `COUNT` previo, transacción, `RETURNING` y su reversión. **No ejecutarlo** (no hay base de datos).
5. **Trabajar en local:** clonar el repositorio en la ruta estándar (ver `PROYECTO.md`), verificar los puntos 1 a 3 en el navegador y actualizar `INDICE.md`.
6. **Cerrar:** registrar una fila nueva en esta tabla, hacer commit en una rama `feature/` y, con confirmación, push y pull request hacia `main`.
