-- Optional seed data
insert into public.events (event_name, source, metadata)
values
('page_view', 'marketing', '{"path":"/"}'),
('page_view', 'marketing', '{"path":"/pricing"}');
