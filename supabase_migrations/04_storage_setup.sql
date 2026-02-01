-- Create a bucket for user uploads
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- Allow public access to files
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'uploads' );

-- Allow authenticated users to upload files
create policy "Allow Authenticated Uploads"
on storage.objects for insert
with check (
  bucket_id = 'uploads' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own files
create policy "Allow Users to Delete Own Files"
on storage.objects for delete
using (
  bucket_id = 'uploads'
  AND auth.uid() = owner
);
