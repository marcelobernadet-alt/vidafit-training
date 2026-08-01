# VIDAFIT TRAINING

MVP funcional de app/PWA para que un coach publique entrenamientos diarios y los alumnos los vean desde su celular.

## Stack

Next.js 14 (App Router) · React · TypeScript · Supabase (DB + Auth + RLS) · Tailwind CSS · PWA.

## 1. Crear el proyecto en Supabase

1. Creá un proyecto nuevo en [supabase.com](https://supabase.com).
2. Andá a **SQL Editor** y ejecutá, en este orden:
   - `supabase/schema.sql` (tablas, tipos, triggers).
   - `supabase/policies.sql` (Row Level Security por rol/grupo).
3. Copiá la **Project URL** y la **anon key** desde Settings → API.

## 2. Configurar el proyecto local

```bash
cp .env.local.example .env.local
# completar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY

npm install
npm run dev
```

Abrí `http://localhost:3000`.

## 3. Crear el primer usuario coach

Por defecto, cualquier usuario que se registra queda con rol `student` (ver trigger `handle_new_user` en `schema.sql`). Para tener tu primer coach:

1. Registrá un usuario (podés usar temporalmente un formulario de registro, o crearlo desde **Authentication → Users → Add user** en el dashboard de Supabase).
2. En el **SQL Editor**, actualizá su rol:
   ```sql
   update public.profiles set role = 'coach' where id = 'UUID_DEL_USUARIO';
   ```
3. Iniciá sesión con ese usuario: te va a llevar directo a `/admin`.

> Nota: este MVP no incluye una pantalla de registro pública (según el brief, el acceso lo gestiona el coach). Para dar de alta alumnos rápido en desarrollo, podés crearlos desde **Authentication → Users** en Supabase y después asignarlos a un grupo desde `/admin/grupos`.

## 4. Datos de ejemplo (opcional)

Editá `supabase/seed.sql`, reemplazá `COACH_USER_ID` por el id de tu coach, y ejecutalo para crear los 5 grupos del brief (VIDAFIT GENERAL, CROSSFIT RX, CROSSFIT SCALED, HYBRID, COMPETITORS).

## 5. Instalar como PWA

`public/manifest.json` ya está configurado. Solo falta agregar los íconos reales en `public/icons/` (192px, 512px y 512px maskable, fondo `#0B0D0C`). Con eso, "Agregar a pantalla de inicio" funciona en iPhone y Android.

## Estructura

```
app/
  login/                 → login (Supabase Auth)
  (student)/             → HOY, CALENDARIO, PROGRESO, PERFIL (bottom nav)
  (admin)/admin/         → dashboard, entrenamientos, calendario, alumnos, grupos
components/
  ui/                    → Card, Badge, Button
  nav/                   → BottomNav (alumno), AdminNav (coach)
  workout/                → WorkoutBlockCard
  calendar/              → WeekCalendar
  admin/                 → WorkoutBuilder, WorkoutRow, CreateGroupForm, GroupMembersEditor
lib/
  supabase/              → client.ts, server.ts, middleware.ts
  types.ts               → tipos de dominio
middleware.ts            → protección de rutas por rol
supabase/
  schema.sql             → tablas y triggers
  policies.sql            → RLS
  seed.sql                → grupos de ejemplo (opcional)
```

## Roadmap ya previsto en la arquitectura

`workout_assignments` ya tiene columnas `result_text` / `result_value` / `completed_at` listas para:
resultados, PRs, leaderboard, historial y progreso. Para lo demás (membresías, pagos, reservas,
push notifications, chat, Strava, Garmin) se recomienda agregar tablas nuevas que referencien
`profiles.id`, sin tocar el esquema actual.

## Próximos pasos sugeridos

1. Pantalla de registro de alumnos (o invitación por email desde el panel admin).
2. Marcar entrenamiento como completado desde "Hoy" (ya existe `workout_assignments`).
3. Subir íconos reales de PWA.
4. Deploy en Vercel + variables de entorno de producción.
