alter table public.tree_species
  add column if not exists slug text,
  add column if not exists difficulty text,
  add column if not exists indoor_outdoor text,
  add column if not exists care_image_url text;

update public.tree_species
set
  difficulty = coalesce(nullif(difficulty, ''), nullif(level, ''), 'Beginner Friendly'),
  slug = coalesce(
    nullif(slug, ''),
    lower(regexp_replace(regexp_replace(name_en, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
  )
where slug is null
   or slug = ''
   or difficulty is null
   or difficulty = '';

create unique index if not exists tree_species_slug_key
  on public.tree_species (slug)
  where slug is not null;

create index if not exists bonsai_trees_species_id_idx
  on public.bonsai_trees (species_id);
