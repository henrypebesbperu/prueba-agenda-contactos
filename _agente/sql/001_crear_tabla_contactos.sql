-- Motor: PostgreSQL 16 · Entorno: dev
-- Objetivo: crear la tabla de contactos con columnas de estado y auditoría para la baja lógica
-- Autor: Henry Pebe · Fecha: 2026-10-23
-- Filas esperadas: 0 (solo estructura) · Reversión: DROP TABLE IF EXISTS contacto; (solo en dev, con confirmación)

CREATE TABLE IF NOT EXISTS contacto (
    id_contacto        BIGSERIAL    PRIMARY KEY,
    nombre             VARCHAR(60)  NOT NULL,
    correo             VARCHAR(80)  NOT NULL,
    telefono           CHAR(9)      NOT NULL CHECK (telefono ~ '^9[0-9]{8}$'),
    estado             VARCHAR(10)  NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO')),
    fecha_creacion     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    usuario_creacion   VARCHAR(60)  NOT NULL,
    fecha_baja         TIMESTAMPTZ  NULL,
    usuario_baja       VARCHAR(60)  NULL
);

-- Un mismo correo no puede repetirse entre contactos activos
CREATE UNIQUE INDEX IF NOT EXISTS ux_contacto_correo_activo
    ON contacto (lower(correo)) WHERE estado = 'ACTIVO';
