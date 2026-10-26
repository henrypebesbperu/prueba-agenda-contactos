-- Motor: PostgreSQL 16 · Entorno: dev (producción es de solo lectura por defecto)
-- Objetivo: dar de baja lógica un contacto activo (estado = 'INACTIVO' + fecha y usuario de baja)
-- Autor: Henry Pebe (Agente Base) · Fecha: 2026-10-26
-- Parámetros: $1 = id_contacto (BIGINT), $2 = usuario_baja (VARCHAR 60)
-- Filas esperadas: 1 · Reversión: bloque «REVERSIÓN» al final de este archivo
-- Estado: ESCRITO Y REVISADO, NO EJECUTADO (no hay base de datos conectada)
-- Uso sugerido (psql):  \set id 123  \set usuario 'hpebe'  y reemplazar $1/$2 por :id/:'usuario',
--                       o ejecutarlo desde la aplicación como consulta parametrizada.

-- 1) Verificación previa: debe devolver 1. Si devuelve 0, el contacto no existe o ya está dado de baja: no continuar.
SELECT COUNT(*) AS filas_a_afectar
FROM contacto
WHERE id_contacto = $1
  AND estado = 'ACTIVO';

-- 2) Baja lógica dentro de una transacción
BEGIN;

UPDATE contacto
SET    estado       = 'INACTIVO',
       fecha_baja   = now(),
       usuario_baja = $2
WHERE  id_contacto  = $1
  AND  estado       = 'ACTIVO'
RETURNING id_contacto, estado, fecha_baja, usuario_baja;

-- 3) Si RETURNING devolvió exactamente 1 fila → COMMIT; en cualquier otro caso → ROLLBACK.
-- COMMIT;
-- ROLLBACK;

-- ---------------------------------------------------------------------------
-- REVERSIÓN (reactivar el contacto dado de baja). Ejecutar solo con confirmación.
-- Fallará con unique_violation si ya existe otro contacto ACTIVO con el mismo correo
-- (índice ux_contacto_correo_activo); en ese caso, resolver el duplicado antes.
-- ---------------------------------------------------------------------------
-- SELECT COUNT(*) FROM contacto WHERE id_contacto = $1 AND estado = 'INACTIVO';  -- debe ser 1
-- BEGIN;
-- UPDATE contacto
-- SET    estado = 'ACTIVO', fecha_baja = NULL, usuario_baja = NULL
-- WHERE  id_contacto = $1 AND estado = 'INACTIVO'
-- RETURNING id_contacto, estado;
-- COMMIT;  -- o ROLLBACK si no devolvió 1 fila
