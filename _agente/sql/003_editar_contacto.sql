-- Motor: PostgreSQL 16 · Entorno: dev (producción es de solo lectura por defecto)
-- Objetivo: editar nombre, correo y teléfono de un contacto ACTIVO
-- Autor: Henry Pebe (Agente Base) · Fecha: 2026-10-27
-- Parámetros: $1 = id_contacto (BIGINT), $2 = nombre (VARCHAR 60), $3 = correo (VARCHAR 80), $4 = telefono (CHAR 9)
-- Filas esperadas: 1 · Reversión: volver a ejecutar el paso 3 con los valores guardados en el paso 1
-- Estado: ESCRITO Y REVISADO, NO EJECUTADO en ninguna base de datos real
-- Reglas: solo se editan contactos ACTIVOS; el correo no puede repetirse entre activos
--         (lo garantiza el índice ux_contacto_correo_activo: un duplicado lanza unique_violation y hay que hacer ROLLBACK).

-- 1) Respaldo de los valores actuales (anotarlos: son la reversión). Debe devolver 1 fila.
SELECT id_contacto, nombre, correo, telefono
FROM contacto
WHERE id_contacto = $1
  AND estado = 'ACTIVO';

-- 2) Verificación previa del correo: debe devolver 0. Si devuelve 1 o más, otro contacto activo ya usa ese correo: no continuar.
SELECT COUNT(*) AS correo_ocupado
FROM contacto
WHERE lower(correo) = lower($3)
  AND estado = 'ACTIVO'
  AND id_contacto <> $1;

-- 3) Edición dentro de una transacción
BEGIN;

UPDATE contacto
SET    nombre   = $2,
       correo   = lower($3),
       telefono = $4
WHERE  id_contacto = $1
  AND  estado      = 'ACTIVO'
RETURNING id_contacto, nombre, correo, telefono;

-- 4) Si RETURNING devolvió exactamente 1 fila → COMMIT; en cualquier otro caso (o con error) → ROLLBACK.
-- COMMIT;
-- ROLLBACK;

-- ---------------------------------------------------------------------------
-- REVERSIÓN: repetir los pasos 2–4 pasando en $2, $3 y $4 los valores del paso 1.
-- Nota: la tabla no tiene columnas de auditoría de modificación (fecha/usuario);
-- ver «Sugerencias» en BITACORA.md.
-- ---------------------------------------------------------------------------
