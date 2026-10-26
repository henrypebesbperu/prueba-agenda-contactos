# Proyecto: prueba-agenda-contactos

## Perfil
- Rol: desarrollo · Tipo: FrontEnd + Base de datos · Estado: en desarrollo (sin terminar)
- Stack: HTML + CSS + JavaScript puro (un archivo) · PostgreSQL 16 para el modelo de datos
- Objetivo: completar los pendientes de `BITACORA.md` y publicar el proyecto en local
- Terminado: los pendientes funcionan y están verificados, el script SQL está escrito y revisado (sin ejecutar), el repositorio está clonado en local, `INDICE.md` está actualizado y los cambios están en una rama con su pull request
- Autonomía: b · Documentos .docx: ninguno
- Responsable: Henry Pebe · SoftBrillianceGroup

## Mapa del proyecto
- `index.html`: formulario (nombre, correo, teléfono peruano de 9 dígitos), tabla y contador.
- Los contactos se guardan en `localStorage` (clave `agenda-contactos.v1`); si los datos están dañados, se arranca con la lista vacía.
- Cada contacto tiene `estado` (`ACTIVO`/`INACTIVO`) y `fechaBaja`; la tabla muestra solo los activos.
- `_agente/sql/001_crear_tabla_contactos.sql`: tabla `contacto` (PostgreSQL) con estado, auditoría e índice único de correo entre activos.
- Los pendientes están marcados en el código como `PENDIENTE 1`, `PENDIENTE 2` y `PENDIENTE 3`.

## Convenciones
- Interfaz en español. Colores del estándar: #1F3864, #2E75B6, #D9E2F3, #8EAADB.
- «Eliminar» es siempre una baja lógica (`estado = 'INACTIVO'` más fecha de baja), en la app y en la base de datos.
- Sin dependencias externas.

## Repositorio y publicación local
- Repositorio: GitHub `henrypebesbperu/prueba-agenda-contactos` (privado), rama principal `main`.
- Local: clonar en la ruta estándar del Agente Base (`<Documentos>\Agente base\proyectos\prueba-agenda-contactos\`).
- Flujo: rama `feature/<tema>` → commits pequeños (Conventional Commits, en español) → push y pull request hacia `main` **con confirmación**. Nunca push directo a `main` ni `--force`.
