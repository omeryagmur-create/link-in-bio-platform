-- BU SQL KODUNU SUPABASE SQL EDITOR ÜZERİNDE ÇALIŞTIRIN --
-- Bu script, kullanıcı kayıt olduğunda otomatik profil oluşturulmasını sağlar --

-- 1. Profil oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger'ı temizle ve yeniden oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Geliştirme Kolaylığı: Email onayını devre dışı bırakmak için manuel onay --
-- (Supabase Dashboard'da Auth > Settings > Confirm Email ayarını kapatmak en iyisidir)
-- Eğer kapatamıyorsanız, şu komutla mevcut tüm kullanıcıları onaylayabilirsiniz:
-- UPDATE auth.users SET confirmed_at = now(), last_sign_in_at = now();
