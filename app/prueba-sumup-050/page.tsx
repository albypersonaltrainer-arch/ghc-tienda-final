export const metadata = {
  title: 'Prueba interna SumUp · GHC Nutrition',
  robots: { index: false, follow: false },
}

export default function SumUpTestPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f4f4f0', color: '#111', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section style={{ width: 'min(520px, 100%)', background: '#fff', border: '1px solid #deded8', borderRadius: 24, padding: 32, boxShadow: '0 18px 55px rgba(0,0,0,.08)' }}>
        <p style={{ margin: 0, fontSize: 12, letterSpacing: '.18em', textTransform: 'uppercase', color: '#169646', fontWeight: 800 }}>
          Prueba interna · GHC Nutrition
        </p>
        <h1 style={{ margin: '14px 0 8px', fontSize: 34, lineHeight: 1.05 }}>
          Producto de prueba SumUp
        </h1>
        <p style={{ margin: '0 0 24px', color: '#555', lineHeight: 1.6 }}>
          Pago real de importe mínimo para comprobar checkout, webhook y registro del pedido.
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, padding: '18px 0', borderTop: '1px solid #ecece7', borderBottom: '1px solid #ecece7' }}>
          <strong>Prueba de pago</strong>
          <strong style={{ fontSize: 30 }}>0,50 €</strong>
        </div>
        <p style={{ margin: '18px 0', fontSize: 13, color: '#666' }}>
          Envío: 0,00 € · Total: 0,50 €
        </p>
        <form action="/api/test-sumup-050" method="post">
          <button
            type="submit"
            style={{ width: '100%', border: 0, borderRadius: 999, padding: '16px 20px', background: '#111', color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}
          >
            Pagar 0,50 € con SumUp
          </button>
        </form>
        <p style={{ margin: '16px 0 0', fontSize: 12, color: '#777', textAlign: 'center' }}>
          Página temporal no enlazada al catálogo público.
        </p>
      </section>
    </main>
  )
}
