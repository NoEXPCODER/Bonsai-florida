alter table public.bonsai_trees
  add column if not exists sold_image_url text,
  add column if not exists sold_note text,
  add column if not exists sold_at timestamptz;

create index if not exists bonsai_trees_sold_at_idx
  on public.bonsai_trees (sold_at desc)
  where is_active = false;
