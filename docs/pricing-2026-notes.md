# GHC Nutrition · reglas de precios 2026

Fuente de trabajo: tarifa profesional Beverly 2026 facilitada por GHC.

## Reglas públicas

- El catálogo muestra el PVP 2026 de cada referencia.
- Los costes profesionales, precios de compra y márgenes NO se almacenan en este repositorio público.
- Las promociones profesionales de reposición (5+1, 10+1, 15+1, 16+1, etc.) son información interna de compras y no se publican como promociones al cliente.
- Si una variante tiene un PVP diferente y el carrito todavía no soporta precio por variante, se publica únicamente la variante cuyo precio coincide con el producto configurado.
- Una referencia que no figure en la tarifa profesional vigente no se deja vendible hasta disponer de coste/PVP confirmados.

## Entrenadores colaboradores

- Sistema distinto de `Recomienda GHC` (cliente -> cliente).
- Enlace de atribución: `?coach=CODIGO`.
- Comisión por defecto: 10% del PVP de los productos.
- La comisión excluye portes.
- Cupones y descuentos al comprador no reducen la base de comisión del entrenador.
- Si GHC vende un pack por debajo de su PVP conjunto, se conserva el PVP de referencia para calcular la comisión.
- La comisión solo pasa a `earned` cuando SumUp confirma el pedido como `PAID`.
- El sistema conserva PVP unitario, base, porcentaje e importe para poder auditar cada liquidación.

## Pendiente de infraestructura

Las tablas `trainer_partners` y `trainer_commissions` están definidas en `docs/supabase-schema.sql`, pero no se aplicarán hasta disponer del proyecto Supabase independiente `GHC Nutrition`.
