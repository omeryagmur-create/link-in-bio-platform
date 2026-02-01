import Link from "next/link";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Particles } from "@/components/ui/particles";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import {
  Link2,
  Palette,
  BarChart3,
  Smartphone,
  Globe,
  ShieldCheck
} from "lucide-react";

const features = [
  {
    Icon: Link2,
    name: "Tüm Linkler Tek Bir Yerde",
    description: "Sosyal medya hesaplarınızı, portfolyonuzu ve önemli bağlantılarınızı tek bir sayfada toplayın.",
    href: "/signup",
    cta: "Hemen Başla",
    className: "col-span-3 lg:col-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />,
  },
  {
    Icon: Palette,
    name: "Kişiselleştirilebilir Tasarım",
    description: "Markanıza özel renkler, fontlar ve buton stilleri ile sayfanızı saniyeler içinde özelleştirin.",
    href: "/signup",
    cta: "Temaları Keşfet",
    className: "col-span-3 lg:col-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />,
  },
  {
    Icon: BarChart3,
    name: "Detaylı Analizler",
    description: "Kimlerin tıkladığını, hangi linkin daha popüler olduğunu gerçek zamanlı istatistiklerle görün.",
    href: "/signup",
    cta: "İncele",
    className: "col-span-3 lg:col-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />,
  },
  {
    Icon: Smartphone,
    name: "Önce Mobil",
    description: "Her ekran boyutunda kusursuz görünen, ultra hızlı ve hafif bir deneyim sunun.",
    href: "/signup",
    cta: "Deneyin",
    className: "col-span-3 lg:col-span-1",
    background: <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />,
  },
  {
    Icon: ShieldCheck,
    name: "Güvenli ve Hızlı",
    description: "Supabase ve Next.js altyapısı ile verileriniz güvende, sayfanız her zaman yayında.",
    href: "/signup",
    cta: "Kayıt Ol",
    className: "col-span-3 lg:col-span-2",
    background: <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background font-sans selection:bg-primary/20">
      {/* Background Effects */}
      <RetroGrid className="opacity-30" />
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        ease={80}
        color="#000000"
        refresh
      />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="text-xl font-bold tracking-tight">LinkInBio</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Özellikler</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Fiyatlandırma</Link>
          <Link href="/login" className="hover:text-primary transition-colors">Giriş Yap</Link>
        </div>
        <Link href="/signup">
          <ShimmerButton className="text-sm font-semibold px-6 py-2">
            Ücretsiz Başla
          </ShimmerButton>
        </Link>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center pt-24 pb-32 px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Yeni Nesil Link-in-Bio Platformu
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 max-w-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Tüm Dijital Varlıklılarınızı <br className="hidden md:block" />
            <span className="text-primary italic">Tek Bir Bağlantıda</span> Buluşturun
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
            Kitlenizi tek bir link ile istediğiniz yere yönlendirin.
            Saniyeler içinde profesyonel bir sayfa oluşturun, temanızı seçin ve analizlerinizi takip edin.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <ShimmerButton className="px-8 py-3 text-lg font-bold">
                Hemen Ücretsiz Sayfanı Kur
              </ShimmerButton>
            </Link>
            <Link href="/login">
              <button className="px-8 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold backdrop-blur-md">
                Giriş Yap
              </button>
            </Link>
          </div>

          {/* Mockup Preview */}
          <div className="mt-20 relative w-full max-w-5xl mx-auto px-4 overflow-hidden rounded-2xl border border-white/10 shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700">
            <div className="w-full aspect-[16/9] bg-slate-900 flex items-center justify-center text-slate-700 font-bold text-4xl">
              PREVIEW MOCKUP
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 md:px-12 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Neden LinkInBio?</h2>
              <p className="text-muted-foreground text-lg">Platformumuzun sunduğu güçlü özelliklerle tanışın.</p>
            </div>

            <BentoGrid className="lg:grid-rows-3">
              {features.map((feature) => (
                <BentoCard key={feature.name} {...feature} />
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">L</div>
            <span className="text-lg font-bold tracking-tight">LinkInBio</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">© 2024 LinkInBio Platform. Tüm hakları saklıdır.</p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Kullanım Şartları</Link>
            <Link href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
