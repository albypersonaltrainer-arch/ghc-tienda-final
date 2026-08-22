import Link from 'next/link'
import { notFound } from 'next/navigation'
import GHCNutritionLogo from '@/app/components/GHCNutritionLogo'

type LegalSection = {
  title: string
  paragraphs: string[]
}

type LegalPage = {
  title: string
  intro: string
  notice?: string
  sections: LegalSection[]
}

const UPDATED = '22 de agosto de 2026'

const SELLER = {
  name: 'Alby Aguiar Campos',
  nif: '44713992Z',
  address: 'Calle Los Madroños 9, Cubas de la Sagra, Madrid',
  email: 'info@ghcacademy.net',
} as const

const pages: Record<string, LegalPage> = {
  faq: {
    title: 'Preguntas frecuentes',
    intro: 'Compra, entrega, devoluciones y uso de la tienda explicados de forma clara.',
    sections: [
      { title: '¿Dónde entregáis?', paragraphs: ['Actualmente la tienda valida direcciones con código postal 28xxx, correspondientes a la Comunidad de Madrid. La cobertura puede limitarse por operativa logística y se confirma antes del pago.'] },
      { title: '¿Cuánto cuesta el envío?', paragraphs: ['El envío estándar cuesta 10 € cuando el subtotal es inferior a 70 €. A partir de 70 € el envío estándar es gratuito, salvo que se indique expresamente otra cosa antes de pagar.'] },
      { title: '¿Cómo se paga?', paragraphs: ['El pago se deriva a un checkout seguro de SumUp. GHC Nutrition no almacena los datos completos de la tarjeta. El pedido solo se considera pagado cuando el proveedor de pago confirma la operación.'] },
      { title: '¿Puedo comprar varios productos?', paragraphs: ['Sí. El carrito permite acumular referencias, sabores y cantidades y realizar un único pedido.'] },
      { title: '¿Puedo devolver un suplemento?', paragraphs: ['Con carácter general existe un derecho de desistimiento de 14 días naturales. En productos precintados que no sean aptos para devolución por razones de protección de la salud o higiene, el derecho de desistimiento deja de ser aplicable cuando el precinto haya sido abierto tras la entrega. Consulta la Política de devoluciones para todos los detalles.'] },
      { title: '¿Qué pasa si llega dañado o equivocado?', paragraphs: ['Comunícanos la incidencia cuanto antes. Si existe una falta de conformidad, producto incorrecto o daño imputable a la entrega, se aplicarán los derechos legales correspondientes sin coste para el consumidor.'] },
      { title: '¿La información del producto puede cambiar?', paragraphs: ['El fabricante puede actualizar fórmulas, presentación, sabores o etiquetado. Cuando exista una diferencia material respecto de las características contratadas se aplicarán los derechos legales de conformidad. En materia de ingredientes, alérgenos, dosis y advertencias, debe comprobarse siempre la etiqueta de la unidad física recibida antes de consumirla.'] },
    ],
  },
  envios: {
    title: 'Política de envíos',
    intro: 'Condiciones de entrega diseñadas para que cada pedido tenga trazabilidad y reglas claras.',
    sections: [
      { title: 'Zona de entrega', paragraphs: ['Actualmente se aceptan pedidos para códigos postales 28xxx de la Comunidad de Madrid, sujeto a validación logística. La tienda podrá rechazar una dirección fuera de cobertura antes de formalizar el pedido.'] },
      { title: 'Gastos de envío', paragraphs: ['El envío estándar cuesta 10 € para pedidos con subtotal inferior a 70 €. Es gratuito desde 70 €. Cualquier coste adicional aplicable deberá mostrarse antes de que el cliente quede obligado al pago.'] },
      { title: 'Plazo de entrega', paragraphs: ['Se aplicará el plazo informado durante el proceso de compra. Si no se hubiera pactado un plazo específico, el pedido se ejecutará sin demora indebida y, en todo caso, dentro del máximo legal de 30 días naturales desde la celebración del contrato, salvo acuerdo distinto con el cliente.'] },
      { title: 'Dirección y datos correctos', paragraphs: ['El comprador debe facilitar una dirección completa y correcta, así como un teléfono y correo que permitan gestionar la entrega. Cuando una segunda expedición resulte necesaria por una dirección incorrecta, ausencia reiterada o causa imputable al destinatario, podrán repercutirse los costes directos razonables de la nueva expedición, siempre que la ley lo permita y se informe antes de realizarla.'] },
      { title: 'Riesgo durante el transporte', paragraphs: ['Cuando el comprador sea consumidor, el riesgo de pérdida o deterioro se transmite cuando él o un tercero indicado por él, distinto del transportista, adquiere la posesión material de los bienes, salvo las excepciones previstas legalmente.'] },
      { title: 'Retrasos y fuerza mayor', paragraphs: ['Las incidencias de transporte, fenómenos meteorológicos, interrupciones de servicios esenciales u otros acontecimientos fuera del control razonable de GHC Nutrition podrán retrasar la entrega. Estas circunstancias no limitan los derechos imperativos del consumidor, incluidos los relativos a falta de ejecución o retraso injustificado.'] },
    ],
  },
  devoluciones: {
    title: 'Devoluciones y desistimiento',
    intro: 'Aplicamos el derecho de desistimiento cuando corresponde y protegemos especialmente la integridad de productos destinados al consumo.',
    sections: [
      { title: 'Plazo de desistimiento', paragraphs: ['Salvo las excepciones legales, el consumidor dispone de 14 días naturales desde la recepción del producto —o del último producto cuando un mismo pedido se entregue por separado— para comunicar de forma inequívoca que desiste de la compra. No es necesario indicar un motivo.'] },
      { title: 'Suplementos precintados: protección de salud e higiene', paragraphs: ['Por razones de protección de la salud, higiene, seguridad alimentaria e imposibilidad de verificar la integridad del contenido una vez roto el cierre, no se aceptará el desistimiento de productos precintados que no sean aptos para ser devueltos por dichas razones cuando hayan sido desprecintados tras la entrega, conforme al artículo 103.e) del texto refundido de la Ley General para la Defensa de los Consumidores y Usuarios.', 'Para que un producto susceptible de desistimiento pueda ser devuelto, debe mantenerse sin abrir, con sus precintos de seguridad intactos y sin manipulaciones que excedan de las necesarias para comprobar su naturaleza y características. Esta regla no afecta a los derechos derivados de un producto defectuoso, incorrecto o no conforme.'] },
      { title: 'Cómo comunicar el desistimiento', paragraphs: [`El consumidor puede utilizar el modelo incluido en esta página o cualquier declaración inequívoca que identifique el pedido y exprese su decisión de desistir. La comunicación debe enviarse dentro del plazo legal a ${SELLER.email}. La carga de probar que la comunicación se realizó dentro de plazo corresponde al consumidor.`] },
      { title: 'Devolución física', paragraphs: ['Tras comunicar el desistimiento, el consumidor deberá devolver los bienes sin demora indebida y, como máximo, dentro de los 14 días naturales siguientes. Salvo que GHC Nutrition se ofrezca expresamente a asumirlos, los costes directos de devolución por desistimiento corresponden al consumidor. El producto debe embalarse de forma razonablemente segura para evitar daños durante el transporte.'] },
      { title: 'Reembolso', paragraphs: ['Cuando proceda el desistimiento, se reembolsarán los pagos exigidos legalmente utilizando el mismo medio de pago, salvo acuerdo expreso distinto que no genere costes al consumidor. Si el comprador eligió una modalidad de entrega más costosa que la estándar ofrecida, no se reembolsará el sobrecoste de esa modalidad.', 'GHC Nutrition podrá retener el reembolso hasta haber recibido los bienes o hasta que el consumidor aporte prueba suficiente de su devolución, según qué ocurra primero, salvo que GHC Nutrition se haya ofrecido a recogerlos.'] },
      { title: 'Producto incorrecto, dañado o no conforme', paragraphs: ['Si el producto recibido no corresponde con el pedido, presenta daños de transporte o existe una falta de conformidad, el cliente debe comunicarlo tan pronto como sea razonablemente posible. Pedir fotografías del embalaje, precintos, etiqueta, lote o daño puede ser necesario para tramitar la incidencia con el operador logístico o fabricante, pero esa solicitud no elimina ni reduce los derechos legales del consumidor.', 'Cuando legalmente proceda una puesta en conformidad, reparación, sustitución, reducción del precio o resolución, se aplicará sin costes que deban soportarse por el consumidor en los términos legalmente previstos.'] },
      { title: 'Garantía legal', paragraphs: ['Para bienes nuevos, el empresario responde de las faltas de conformidad que existan en el momento de la entrega y se manifiesten dentro del plazo legal vigente, actualmente tres años desde la entrega. La naturaleza consumible del producto y su fecha de caducidad pueden ser relevantes para determinar si una incidencia constituye realmente una falta de conformidad.'] },
      { title: 'Prevención de fraude y abuso', paragraphs: ['Podrán rechazarse solicitudes cuando existan indicios objetivos de manipulación, alteración del producto, sustitución del contenido, fraude, abuso reiterado o discrepancias incompatibles con la trazabilidad del pedido. Esta previsión se aplicará de forma proporcionada y nunca servirá para excluir derechos imperativos del consumidor.'] },
      { title: 'Modelo de desistimiento', paragraphs: [`A la atención de ${SELLER.name}, GHC Nutrition, NIF ${SELLER.nif}, ${SELLER.address}, ${SELLER.email}: Por la presente comunico que desisto de mi contrato de venta del siguiente bien o bienes: [producto]. Pedido: [número]. Recibido el: [fecha]. Nombre del consumidor: [nombre]. Dirección: [dirección]. Fecha: [fecha]. Firma: únicamente si se presenta en papel.`] },
    ],
  },
  terminos: {
    title: 'Aviso legal y condiciones de contratación',
    intro: 'Reglas de uso y compra de GHC Nutrition conforme a la normativa española y europea aplicable al comercio electrónico y a consumidores.',
    sections: [
      { title: '1. Titular y prestador del servicio', paragraphs: [`GHC Nutrition es una marca comercial operada por ${SELLER.name}, NIF ${SELLER.nif}, con domicilio profesional en ${SELLER.address}. Correo electrónico de contacto: ${SELLER.email}. El titular actúa como persona física, por lo que no procede indicar datos de inscripción en el Registro Mercantil salvo que cambie la forma jurídica de la actividad.`] },
      { title: '2. Objeto y ámbito', paragraphs: ['Estas condiciones regulan el acceso al sitio y la contratación a distancia de los productos mostrados en GHC Nutrition. Las disposiciones de consumo se aplican cuando el comprador actúa como consumidor o usuario. Si compra en el marco de una actividad empresarial o profesional, se aplicarán además las reglas civiles y mercantiles correspondientes y no aquellas normas reservadas exclusivamente a consumidores.'] },
      { title: '3. Información precontractual', paragraphs: ['Antes de quedar vinculado por un pedido, el comprador tendrá acceso a las características esenciales del producto, precio total, impuestos incluidos cuando proceda, gastos de envío, medios de pago, restricciones de entrega, derecho de desistimiento y sus excepciones, datos del empresario, condiciones de ejecución y demás información exigible.'] },
      { title: '4. Formación del contrato', paragraphs: ['La selección de productos y su incorporación al carrito no constituye por sí sola aceptación del pedido por GHC Nutrition. El comprador debe revisar el resumen, completar los datos de entrega, aceptar estas condiciones y confirmar expresamente que el pedido implica una obligación de pago.', 'El pedido se considera recibido cuando el sistema genera una referencia y el proveedor de pago confirma la operación. GHC Nutrition podrá rechazar o cancelar, reembolsando en su caso cualquier cantidad cobrada, pedidos imposibles de ejecutar por falta de stock, error técnico manifiesto, imposibilidad logística, sospecha fundada de fraude, uso abusivo de promociones o incumplimiento de estas condiciones, siempre respetando la normativa imperativa.'] },
      { title: '5. Precios, impuestos y errores manifiestos', paragraphs: ['Los precios se expresan en euros e incluirán los impuestos legalmente aplicables cuando así corresponda. Los gastos de envío se muestran separadamente cuando proceden.', 'Si un precio o característica contiene un error técnico manifiesto y objetivamente reconocible, GHC Nutrition podrá corregirlo antes de ejecutar el pedido. Si ya se hubiera cobrado una cantidad y el pedido no pudiera cumplirse en los términos contratados, se informará al cliente y se devolverá sin demora indebida lo que corresponda. No se utilizará esta cláusula para modificar unilateralmente un contrato válido en perjuicio del consumidor.'] },
      { title: '6. Disponibilidad y sustituciones', paragraphs: ['El catálogo está sujeto a disponibilidad. No se enviará un producto distinto al contratado sin consentimiento del cliente cuando ese cambio altere las características esenciales del pedido. Si no pudiera suministrarse un producto, se informará y se aplicarán los derechos legales de reembolso o solución alternativa aceptada por el cliente.'] },
      { title: '7. Pago', paragraphs: ['El cobro se procesa mediante SumUp u otro proveedor que se identifique antes de pagar. GHC Nutrition no almacena los datos completos de tarjeta. La autorización inicial de un medio de pago no equivale necesariamente a confirmación definitiva hasta que el proveedor de pagos registre la operación como completada.'] },
      { title: '8. Entrega', paragraphs: ['La cobertura, costes, plazos, incidencias de dirección y transferencia del riesgo se regulan en la Política de envíos, que forma parte de estas condiciones. La restricción actual se limita a la zona validada por el checkout.'] },
      { title: '9. Desistimiento y devoluciones', paragraphs: ['El consumidor dispone del derecho legal de desistimiento durante 14 días naturales salvo las excepciones previstas en la ley. En particular, los bienes precintados no aptos para devolución por razones de protección de la salud o higiene quedan fuera del derecho de desistimiento una vez desprecintados tras la entrega. Los detalles y el modelo de comunicación figuran en la Política de devoluciones.'] },
      { title: '10. Conformidad y garantía legal', paragraphs: ['Nada de lo previsto en estas condiciones limita los derechos legales relativos a bienes defectuosos o no conformes. Para bienes nuevos, el plazo legal general de responsabilidad por faltas de conformidad es actualmente de tres años desde la entrega, sin perjuicio de la naturaleza del bien, su vida útil y las reglas específicas legalmente aplicables.'] },
      { title: '11. Uso responsable de suplementos', paragraphs: ['Los productos de GHC Nutrition son complementos alimenticios o productos de nutrición deportiva, no medicamentos. La información de la web tiene finalidad comercial e informativa y no sustituye diagnóstico, prescripción ni consejo sanitario individualizado.', 'El comprador debe leer antes del consumo la etiqueta, ingredientes, alérgenos, dosis, advertencias, población destinataria, condiciones de conservación y fecha de consumo preferente o caducidad. Ante embarazo, lactancia, patología, alergias, intolerancias, tratamiento farmacológico o dudas clínicas, debe consultar a un profesional sanitario cualificado antes de usar el producto.', 'GHC Nutrition no responde de daños derivados de un uso contrario al etiquetado, manipulación posterior, conservación inadecuada o consumo pese a una advertencia conocida, salvo cuando exista una responsabilidad que legalmente no pueda excluirse.'] },
      { title: '12. Promociones, cupones y referidos', paragraphs: ['Las promociones estarán sujetas a las condiciones mostradas en cada caso. Salvo indicación expresa, los cupones no son canjeables por dinero, no pueden utilizarse para generar saldo en efectivo y pueden estar sujetos a fecha de caducidad, uso único, pedido mínimo, limitación de productos o no acumulación.', 'GHC Nutrition podrá anular beneficios obtenidos mediante auto-referidos, identidades duplicadas, cuentas coordinadas, devoluciones abusivas, fraude, manipulación técnica o cualquier uso contrario a la finalidad de la promoción. La anulación no afectará a derechos imperativos del consumidor sobre una compra válida.'] },
      { title: '13. Cantidades, reventa y prevención de fraude', paragraphs: ['La tienda está orientada a venta minorista. GHC Nutrition puede establecer límites razonables por producto, cliente, dirección o pedido y revisar operaciones que presenten indicios de reventa no autorizada, fraude, suplantación o uso automatizado abusivo. Si se cancela un pedido ya cobrado por estos motivos antes de su ejecución, se devolverá la cantidad que legalmente corresponda.'] },
      { title: '14. Propiedad intelectual', paragraphs: ['La marca GHC, diseño, textos propios, estructura visual, software y otros contenidos protegibles pertenecen a sus respectivos titulares. La compra de un producto no concede derechos para reproducir, explotar, revender contenidos digitales del sitio, suplantar la marca ni utilizar signos distintivos de forma que genere confusión.'] },
      { title: '15. Responsabilidad y límites legales', paragraphs: ['GHC Nutrition responderá en los supuestos exigidos por la legislación aplicable. Cuando la ley lo permita, no responderá por pérdidas indirectas o consecuencias que no fueran previsibles al contratar, interrupciones causadas por terceros, fuerza mayor, uso indebido del producto o información falsa facilitada por el usuario.', 'Ninguna cláusula excluye o limita responsabilidad por dolo, lesiones o daños cuando la ley prohíba su exclusión, responsabilidad por producto defectuoso, ni derechos imperativos de consumidores.'] },
      { title: '16. Legislación y jurisdicción', paragraphs: ['La contratación se rige por la legislación española, sin privar al consumidor de la protección imperativa que le corresponda. Cuando el comprador sea consumidor, serán competentes los juzgados y tribunales determinados por la normativa imperativa, incluido en su caso el domicilio del consumidor. Para relaciones no sujetas a reglas imperativas de consumo, las partes podrán someterse a los juzgados y tribunales que legalmente correspondan.'] },
      { title: '17. Resolución alternativa de litigios', paragraphs: ['Si una reclamación directa no se resuelve, se facilitará al consumidor, cuando resulte exigible, información sobre una entidad de resolución alternativa competente y sobre si GHC Nutrition participa o está obligada a participar en ese procedimiento, de acuerdo con la Ley 7/2017.', 'No se incluye el antiguo enlace europeo de resolución de litigios en línea, ya que la plataforma ODR de la Unión Europea fue discontinuada y el Reglamento (UE) 524/2013 quedó derogado con efectos de 20 de julio de 2025.'] },
      { title: '18. Modificaciones', paragraphs: ['Las condiciones aplicables a un pedido son las vigentes y puestas a disposición del comprador en el momento de contratar. Las modificaciones posteriores no alterarán retroactivamente un contrato ya celebrado salvo cuando la ley lo exija o exista acuerdo válido entre las partes.'] },
    ],
  },
  privacidad: {
    title: 'Política de privacidad',
    intro: 'Tratamos únicamente los datos necesarios para operar la tienda, cumplir obligaciones legales, prevenir fraude y atender al cliente.',
    sections: [
      { title: '1. Responsable del tratamiento', paragraphs: [`Responsable: ${SELLER.name}. NIF: ${SELLER.nif}. Domicilio profesional: ${SELLER.address}. Correo de contacto para privacidad y ejercicio de derechos: ${SELLER.email}.` ] },
      { title: '2. Datos que podemos tratar', paragraphs: ['Datos identificativos y de contacto: nombre, apellidos, correo electrónico y teléfono. Datos de entrega: dirección, municipio, provincia y código postal. Datos transaccionales: productos, cantidades, importe, descuentos, referencia de pedido, estado de pago y devolución. Datos de promociones: código de referido, cupón o colaborador cuando el usuario los utilice. Datos técnicos mínimos: registros de seguridad, dirección IP o información similar cuando resulte necesaria para proteger el servicio, prevenir fraude o diagnosticar incidencias.', 'GHC Nutrition no necesita almacenar los datos completos de la tarjeta. El pago se realiza en la infraestructura del proveedor de pagos.'] },
      { title: '3. Finalidades y bases jurídicas', paragraphs: ['Gestionar carrito, pedido, pago, entrega, devoluciones e incidencias: ejecución del contrato o medidas precontractuales solicitadas por el usuario (art. 6.1.b RGPD).', 'Facturación, contabilidad, obligaciones tributarias, consumo y atención de requerimientos legalmente exigibles: cumplimiento de obligaciones legales (art. 6.1.c RGPD).', 'Prevención del fraude, defensa frente a reclamaciones, seguridad del servicio y gestión de usos abusivos: interés legítimo del responsable, ponderado frente a los derechos de los interesados (art. 6.1.f RGPD), cuando esta base resulte aplicable.', 'Comunicaciones comerciales no necesarias para el contrato: solo se realizarán con una base jurídica válida. Cuando se requiera consentimiento, este será específico y podrá retirarse en cualquier momento. La aceptación de las condiciones de compra no se utilizará como consentimiento forzado para publicidad.'] },
      { title: '4. Destinatarios y proveedores', paragraphs: ['Los datos podrán comunicarse a proveedores estrictamente necesarios para la operación: SumUp para el procesamiento del pago; Supabase para infraestructura de base de datos; Vercel para alojamiento y entrega de la aplicación; empresas de transporte para entregar pedidos; y asesores contables, fiscales, jurídicos o autoridades cuando exista una obligación o necesidad legítima.', 'Cada proveedor tratará los datos con el rol jurídico que le corresponda según su servicio y contrato. No vendemos datos personales a anunciantes.'] },
      { title: '5. Transferencias internacionales', paragraphs: ['Algunos proveedores tecnológicos pueden operar desde países fuera del Espacio Económico Europeo. Cuando exista una transferencia internacional de datos, deberá basarse en una decisión de adecuación de la Comisión Europea o en garantías apropiadas previstas en el RGPD, como cláusulas contractuales tipo, según corresponda al proveedor y tratamiento concreto.'] },
      { title: '6. Conservación', paragraphs: ['Los datos de pedidos y documentación mercantil se conservarán durante la relación contractual y, posteriormente, bloqueados o con acceso restringido durante los plazos necesarios para cumplir obligaciones y atender responsabilidades. Como referencia, la documentación mercantil debe conservarse durante seis años conforme al artículo 30 del Código de Comercio, sin perjuicio de otros plazos fiscales o de prescripción que resulten aplicables.', 'Los datos basados exclusivamente en consentimiento se conservarán hasta su retirada o hasta que dejen de ser necesarios. Los registros de seguridad se conservarán únicamente durante el tiempo proporcionado a su finalidad.'] },
      { title: '7. Derechos de las personas', paragraphs: [`El interesado puede ejercer, cuando proceda, los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento sin afectar a la licitud del tratamiento previo, escribiendo a ${SELLER.email}.`, 'La solicitud debe permitir verificar razonablemente la identidad del solicitante y concretar el derecho que desea ejercer. También puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD), www.aepd.es.'] },
      { title: '8. Carácter obligatorio de algunos datos', paragraphs: ['Los datos marcados como necesarios en el checkout son imprescindibles para tramitar y entregar el pedido. Si no se facilitan, no podremos celebrar o ejecutar la compra. Los datos opcionales se identificarán como tales.'] },
      { title: '9. Decisiones automatizadas', paragraphs: ['No se prevén decisiones automatizadas con efectos jurídicos o efectos significativamente similares basadas exclusivamente en perfiles personales. Pueden aplicarse controles técnicos de seguridad o fraude que generen una revisión adicional de un pedido.'] },
      { title: '10. Seguridad y minimización', paragraphs: ['La arquitectura separa el navegador de las credenciales administrativas de la base de datos y limita los permisos de acceso a datos comerciales. Se aplican medidas técnicas y organizativas razonables atendiendo al riesgo, incluyendo control de acceso, minimización y registro de operaciones cuando corresponda. Ningún sistema puede garantizar riesgo cero, por lo que las medidas se revisarán conforme evolucione la tienda.'] },
      { title: '11. Menores', paragraphs: ['La tienda y los productos de nutrición deportiva no están dirigidos específicamente a menores. No se solicitarán de forma intencionada datos de menores para finalidades comerciales ajenas a una compra válida y, cuando sea legalmente necesario, se requerirá la intervención del representante legal.'] },
    ],
  },
  cookies: {
    title: 'Política de cookies y almacenamiento local',
    intro: 'Hemos reducido el rastreo para que la tienda funcione con el mínimo almacenamiento necesario.',
    sections: [
      { title: '1. Qué utiliza actualmente la tienda', paragraphs: ['GHC Nutrition utiliza almacenamiento local del navegador para conservar el carrito y almacenamiento de sesión para recordar, durante la navegación, determinados códigos de referido o colaborador. Estas funciones son técnicas y necesarias para prestar la funcionalidad solicitada por el usuario.'] },
      { title: '2. Analítica y publicidad', paragraphs: ['La versión actual de la tienda no carga analítica opcional de Vercel ni herramientas publicitarias de seguimiento desde la página principal. Si en el futuro se incorporan cookies o tecnologías no necesarias para prestar el servicio, se solicitará consentimiento previo válido y se ofrecerán las opciones de aceptar y rechazar al mismo nivel y con la misma visibilidad.'] },
      { title: '3. Checkout de terceros', paragraphs: ['Al iniciar el pago, el usuario puede ser redirigido a la infraestructura de SumUp. Las cookies o tecnologías que utilice ese proveedor en su propio dominio se regirán por su información de privacidad y cookies.'] },
      { title: '4. Cómo borrar almacenamiento técnico', paragraphs: ['El usuario puede borrar los datos del sitio desde la configuración del navegador. Si elimina el almacenamiento técnico de GHC Nutrition, el carrito o los códigos guardados en la sesión pueden perderse.'] },
      { title: '5. Cambios', paragraphs: ['Esta política se revisará cuando cambien las tecnologías realmente utilizadas. No se describirán categorías de cookies inexistentes ni se instalarán tecnologías no necesarias amparándose en una política genérica.'] },
    ],
  },
  contacto: {
    title: 'Contacto y reclamaciones',
    intro: 'Un canal claro de atención reduce errores y deja constancia de cada incidencia.',
    sections: [
      { title: 'Titular y contacto', paragraphs: [`Titular: ${SELLER.name}. NIF: ${SELLER.nif}. Domicilio profesional: ${SELLER.address}. Correo electrónico: ${SELLER.email}.`] },
      { title: 'Atención al cliente', paragraphs: [`Las consultas sobre pedidos pueden dirigirse a ${SELLER.email} e incluir, cuando sea posible, la referencia de pedido, nombre del comprador y una descripción concreta de la incidencia. Nunca envíes por correo datos completos de tarjeta, claves o contraseñas.`] },
      { title: 'Devoluciones y desistimiento', paragraphs: [`Las comunicaciones de desistimiento pueden enviarse a ${SELLER.email} mediante una declaración inequívoca dentro del plazo legal. Consulta la Política de devoluciones para conocer plazos, costes y excepciones aplicables a productos desprecintados.`] },
      { title: 'Protección de datos', paragraphs: [`Las solicitudes de acceso, rectificación, supresión, oposición, limitación o portabilidad se atenderán a través de ${SELLER.email}.`] },
      { title: 'Reclamaciones de consumo', paragraphs: ['Si una reclamación directa no se resuelve, se facilitará la información exigible sobre una entidad acreditada de resolución alternativa competente y se indicará si el empresario participa o está obligado a participar en ese procedimiento.'] },
    ],
  },
  desistimiento: {
    title: 'Modelo de formulario de desistimiento',
    intro: 'Puedes copiar este texto y enviarlo al canal de atención de GHC Nutrition dentro del plazo legal.',
    sections: [
      { title: 'Formulario', paragraphs: [`A la atención de ${SELLER.name}, GHC Nutrition, NIF ${SELLER.nif}, ${SELLER.address}, ${SELLER.email}:`, 'Por la presente le comunico que desisto de mi contrato de venta del siguiente bien o bienes: [indicar producto/s].', 'Número o referencia del pedido: [indicar].', 'Fecha de pedido: [indicar]. Fecha de recepción: [indicar].', 'Nombre y apellidos del consumidor: [indicar].', 'Dirección del consumidor: [indicar].', 'Fecha de la comunicación: [indicar].', 'Firma del consumidor: únicamente si este formulario se presenta en papel.'] },
      { title: 'Importante', paragraphs: ['No es obligatorio utilizar este modelo: también sirve cualquier declaración inequívoca que permita identificar el pedido y la decisión de desistir.', 'El derecho de desistimiento está sujeto a las excepciones legales. En particular, no resulta aplicable a determinados bienes precintados que no sean aptos para devolución por razones de protección de la salud o higiene cuando hayan sido desprecintados tras la entrega.'] },
    ],
  },
} as const

type InfoSlug = keyof typeof pages

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }))
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!(slug in pages)) notFound()

  const page = pages[slug as InfoSlug]

  return (
    <main className="min-h-screen bg-[#F2F4F1] text-[#050706]">
      <header className="border-b border-black/[0.07] bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5">
          <Link href="/"><GHCNutritionLogo size="md" /></Link>
          <Link href="/" className="border border-black/12 bg-white px-5 py-2.5 text-sm font-black transition hover:border-[#22D65B]">Volver a la tienda</Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#159943]">GHC Nutrition · Información legal</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-black/35">Actualizado: {UPDATED}</p>
        </div>
        <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.055em] md:text-6xl">{page.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-black/58 md:text-lg">{page.intro}</p>

        {page.notice && (
          <div className="mt-10 border-l-4 border-[#22D65B] bg-white px-6 py-5 text-sm font-semibold leading-7 text-black/72">
            {page.notice}
          </div>
        )}

        <div className="mt-12 grid gap-4">
          {page.sections.map((section) => (
            <article key={section.title} className="border border-black/[0.08] bg-white p-6 md:p-8">
              <h2 className="text-xl font-black tracking-[-0.025em]">{section.title}</h2>
              <div className="mt-3 grid gap-3">
                {section.paragraphs.map((text) => (
                  <p key={text} className="max-w-4xl text-sm leading-7 text-black/60">{text}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <nav className="mt-12 grid gap-2 border-t border-black/10 pt-8 text-sm font-black sm:grid-cols-2 md:grid-cols-4">
          <Link href="/info/terminos" className="border border-black/10 bg-white px-4 py-3 hover:border-[#22D65B]">Términos</Link>
          <Link href="/info/privacidad" className="border border-black/10 bg-white px-4 py-3 hover:border-[#22D65B]">Privacidad</Link>
          <Link href="/info/devoluciones" className="border border-black/10 bg-white px-4 py-3 hover:border-[#22D65B]">Devoluciones</Link>
          <Link href="/info/cookies" className="border border-black/10 bg-white px-4 py-3 hover:border-[#22D65B]">Cookies</Link>
        </nav>
      </section>

      <footer className="bg-[#050706] text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <GHCNutritionLogo size="sm" inverse />
          <p>{SELLER.name} · NIF {SELLER.nif} · {SELLER.email}</p>
        </div>
      </footer>
    </main>
  )
}
