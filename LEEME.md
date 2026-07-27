# Sancho · Tapas y Barra — sitio web

Sitio de [Sancho](https://www.instagram.com/sancho_cb), bar de tapas en City Bell.
Next.js + Tailwind + Supabase.

---

## Arrancar en local

```bash
cd sancho
npm install
npm run dev
```

Abrí <http://localhost:3000>.

**El sitio funciona sin Supabase.** Si no configuraste nada todavía, sirve la carta
real que está en `src/lib/datos-base.ts`. Supabase solo hace falta para poder editar
la carta desde el panel sin tocar código.

---

## Conectar Supabase (para el panel `/admin`)

### 1. Crear el proyecto

1. Entrá a <https://supabase.com/dashboard> y creá una cuenta (el plan gratis alcanza de sobra).
2. **New project**. Ponele `sancho`, elegí una contraseña de base de datos y la región
   **South America (São Paulo)** — es la más cercana.
3. Esperá ~2 minutos a que termine de crearse.

### 2. Crear las tablas

1. En el menú lateral, **SQL Editor** → **New query**.
2. Abrí el archivo `supabase/esquema.sql` de este proyecto, copiá **todo** el contenido
   y pegalo ahí.
3. **Run**. Debería decir *Success*.

Eso crea las tablas, las reglas de seguridad y carga la carta completa con precios.
Podés volver a correrlo cuando quieras: no duplica nada.

### 3. Copiar las claves

1. **Project Settings** (el engranaje) → **API**.
2. Copiá **Project URL** y **anon public**.
3. En la carpeta `sancho/`, creá un archivo llamado `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

> La *anon key* es pública, va en el navegador. No hay problema en que se vea.
> Lo que nunca hay que exponer es la *service_role key* — esa no la usamos.

### 4. Crear tu usuario

1. **Authentication** → **Users** → **Add user** → *Create new user*.
2. Poné tu email y una contraseña. Marcá **Auto Confirm User**.

### 5. Probar

```bash
npm run dev
```

Entrá a <http://localhost:3000/admin>, logueate y ya podés editar todo.

---

## El panel `/admin`

| Solapa | Para qué |
|---|---|
| **Carta** | Cambiar precios y nombres. `Hay` marca algo como agotado (se tacha en la web y no se puede pedir). `Llevar` define si entra en el armador de pedidos. |
| **Mostrador** | Cargar las tapas que hay hoy en la barra y su precio. |
| **Ajustes** | WhatsApp, dirección, horarios, días que abre, happy hour, descuento en efectivo, alias de transferencia, aviso destacado, y apagar/prender los pedidos. |

Los cambios se ven en la web pública en menos de un minuto.

### ⚠️ Lo primero que hay que revisar

El número de WhatsApp que está cargado (`+54 221 660-0777`) lo saqué del listado
público de Google del local. **Confirmá que sea el WhatsApp donde quieren recibir
pedidos** y, si no, cambialo en *Ajustes → WhatsApp*.

---

## Publicar

La forma más simple es [Vercel](https://vercel.com):

1. Subí el proyecto a un repo de GitHub.
2. En Vercel, **Add New → Project**, elegí el repo. Si el repo tiene la carpeta
   `sancho/` adentro, poné `sancho` como **Root Directory**.
3. En **Environment Variables**, agregá `NEXT_PUBLIC_SUPABASE_URL` y
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` con los mismos valores del `.env.local`.
4. **Deploy**.

---

## Cómo llega un pedido

El cliente arma el pedido en la web y toca *Enviar por WhatsApp*. Se abre WhatsApp
con el mensaje ya escrito, así:

```
✳️ *NUEVO PEDIDO — SANCHO*
🔵🔵 *PARA HOY* 🔵🔵
━━━━━━━━━━━━━━━
👤 *Lucía*
📞 221 555 5555
📅 *Miércoles 29 de julio*
🕐 *21:30*
📍 Retiro en el local
💳 Efectivo
━━━━━━━━━━━━━━━
*PEDIDO:*
• 2 × Croquetas de jamón serrano _(4 unidades)_
• 1 × Bocatta Catalunya
━━━━━━━━━━━━━━━
Subtotal: $38.000
Descuento efectivo (10%): -$3.800
💰 *Total: $34.200*
━━━━━━━━━━━━━━━
```

Si el cliente elige transferencia y hay un alias cargado en *Ajustes*, se agregan
también los datos bancarios y el pedido de comprobante.

---

## Decisiones que conviene conocer

- **No hay reservas.** El Instagram de Sancho dice explícitamente *"sin reserva"*, así
  que la web no las ofrece: empuja a caer o a pedir para llevar.
- **Las tapas del mostrador no se pueden pedir online.** Cambian a diario y hay que
  verlas. Se muestran, pero sin botón de agregar — es intencional.
- **Los huevos rotos, las cañas tiradas y los tragos están fuera del take away**
  porque no viajan bien. Se puede cambiar desde el panel con el switch `Llevar`.

## Mapa del proyecto

```
src/
  app/
    page.tsx              la home
    admin/                panel protegido
  componentes/            secciones de la home
  lib/
    datos-base.ts         la carta real (fallback sin Supabase)
    whatsapp.ts           armado del mensaje de pedido
    carta.ts              lectura desde Supabase
supabase/esquema.sql      base de datos + carga inicial
```
