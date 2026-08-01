-- =========================================================
-- VIDAFIT TRAINING — Row Level Security (RLS)
-- Ejecutar DESPUÉS de schema.sql
-- =========================================================

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sections enable row level security;
alter table public.workout_assignments enable row level security;

-- Helper: ¿el usuario actual es coach?
create or replace function public.is_coach()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'coach'
  );
$$ language sql security definer stable;

-- Helper: ¿el usuario actual pertenece al grupo g?
create or replace function public.in_group(g uuid)
returns boolean as $$
  select exists (
    select 1 from public.group_members
    where group_id = g and profile_id = auth.uid()
  );
$$ language sql security definer stable;

-- ---------------- PROFILES ----------------
create policy "profiles: ver el propio" on public.profiles
  for select using (id = auth.uid());

create policy "profiles: coach ve todos" on public.profiles
  for select using (public.is_coach());

create policy "profiles: actualizar el propio" on public.profiles
  for update using (id = auth.uid());

-- ---------------- GROUPS ----------------
create policy "groups: alumno ve sus grupos" on public.groups
  for select using (public.in_group(id) or public.is_coach());

create policy "groups: coach administra" on public.groups
  for all using (public.is_coach()) with check (public.is_coach());

-- ---------------- GROUP_MEMBERS ----------------
create policy "group_members: ver propia membresía o coach" on public.group_members
  for select using (profile_id = auth.uid() or public.is_coach());

create policy "group_members: coach administra" on public.group_members
  for all using (public.is_coach()) with check (public.is_coach());

-- ---------------- WORKOUTS ----------------
create policy "workouts: alumno ve publicados de su grupo" on public.workouts
  for select using (
    (status = 'published' and public.in_group(group_id))
    or public.is_coach()
  );

create policy "workouts: coach administra" on public.workouts
  for all using (public.is_coach()) with check (public.is_coach());

-- ---------------- WORKOUT_SECTIONS ----------------
create policy "sections: visibles si el workout es visible" on public.workout_sections
  for select using (
    exists (
      select 1 from public.workouts w
      where w.id = workout_id
        and ((w.status = 'published' and public.in_group(w.group_id)) or public.is_coach())
    )
  );

create policy "sections: coach administra" on public.workout_sections
  for all using (public.is_coach()) with check (public.is_coach());

-- ---------------- WORKOUT_ASSIGNMENTS ----------------
create policy "assignments: alumno ve/edita lo propio" on public.workout_assignments
  for select using (profile_id = auth.uid() or public.is_coach());

create policy "assignments: alumno marca su propio estado" on public.workout_assignments
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy "assignments: coach administra" on public.workout_assignments
  for all using (public.is_coach()) with check (public.is_coach());

create policy "assignments: alumno crea su propio registro" on public.workout_assignments
  for insert with check (profile_id = auth.uid());
