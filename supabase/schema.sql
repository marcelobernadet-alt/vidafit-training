-- =========================================================
-- VIDAFIT TRAINING — Esquema de base de datos (Supabase/Postgres)
-- Etapa 1: Base de datos
-- =========================================================
-- Ejecutar en el SQL Editor de Supabase (proyecto nuevo).
-- Requiere la extensión pgcrypto para gen_random_uuid() (viene activada por defecto en Supabase).

-- ---------------------------------------------------------
-- ENUM TYPES
-- ---------------------------------------------------------
create type user_role as enum ('student', 'coach');
create type workout_status as enum ('draft', 'published');
create type block_type as enum (
  'warmup', 'strength', 'skill', 'conditioning', 'accessory', 'cooldown', 'coach_notes'
);
create type assignment_state as enum ('scheduled', 'completed', 'rest');

-- ---------------------------------------------------------
-- PROFILES
-- Extiende auth.users (tabla nativa de Supabase Auth).
-- Se crea automáticamente vía trigger al registrarse un usuario.
-- ---------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role user_role not null default 'student',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- GROUPS
-- Ej: VIDAFIT GENERAL, CROSSFIT RX, CROSSFIT SCALED, HYBRID, COMPETITORS
-- ---------------------------------------------------------
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  color text default '#C6FF3D',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------
-- GROUP_MEMBERS
-- Relación N:N alumno <-> grupo
-- ---------------------------------------------------------
create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, profile_id)
);

-- ---------------------------------------------------------
-- WORKOUTS
-- Un entrenamiento "maestro" (título, fecha, estado, grupo).
-- ---------------------------------------------------------
create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  scheduled_date date not null,
  group_id uuid not null references public.groups(id) on delete cascade,
  status workout_status not null default 'draft',
  is_rest_day boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workouts_group_date_idx on public.workouts (group_id, scheduled_date);
create index workouts_date_idx on public.workouts (scheduled_date);

-- ---------------------------------------------------------
-- WORKOUT_SECTIONS
-- Bloques dinámicos y reordenables dentro de un workout.
-- ---------------------------------------------------------
create table public.workout_sections (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  block_type block_type not null,
  title text not null,
  description text,          -- ej: "3 rounds", "AMRAP 15'", "5 x 5 @ 75%"
  content text not null,     -- cuerpo del bloque (lista de movimientos, texto libre)
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index workout_sections_workout_idx on public.workout_sections (workout_id, position);

-- ---------------------------------------------------------
-- WORKOUT_ASSIGNMENTS
-- Estado del entrenamiento por alumno (para futuro: completado, resultados, PRs).
-- En el MVP se deriva mayormente del grupo, pero se deja la tabla lista
-- para registrar progreso individual (etapa futura).
-- ---------------------------------------------------------
create table public.workout_assignments (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  state assignment_state not null default 'scheduled',
  completed_at timestamptz,
  result_text text,          -- futuro: resultado libre ("18 rounds + 5 reps")
  result_value numeric,      -- futuro: valor numérico para leaderboard
  created_at timestamptz not null default now(),
  unique (workout_id, profile_id)
);

create index workout_assignments_profile_idx on public.workout_assignments (profile_id);

-- ---------------------------------------------------------
-- TRIGGER: crear perfil automáticamente al registrarse
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- TRIGGER: updated_at automático
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_workouts_updated_at before update on public.workouts
  for each row execute procedure public.set_updated_at();

-- ---------------------------------------------------------
-- ARQUITECTURA FUTURA (tablas ya previstas, no se crean todavía):
-- memberships, payments, class_bookings, push_subscriptions,
-- chat_messages, strava_tokens, garmin_tokens, personal_records
-- Todas podrán referenciar profiles.id y/o workouts.id sin
-- romper el esquema actual.
-- ---------------------------------------------------------
