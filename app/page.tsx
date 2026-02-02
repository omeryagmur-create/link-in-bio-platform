'use client'

import Link from "next/link";
import Image from "next/image";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Particles } from "@/components/ui/particles";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useTranslation } from "@/lib/i18n/provider";
import {
  Link2,
  Palette,
  BarChart3,
  Smartphone,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const features = [
    {
      Icon: Link2,
      name: t('landing.feat1_title'),
      description: t('landing.feat1_desc'),
      href: "/signup",
      cta: t('landing.feat1_cta'),
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />,
    },
    {
      Icon: BarChart3,
      name: t('landing.feat2_title'),
      description: t('landing.feat2_desc'),
      href: "/analytics",
      cta: t('landing.feat2_cta'),
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent" />,
    },
    {
      Icon: Smartphone,
      name: t('landing.feat3_title'),
      description: t('landing.feat3_desc'),
      href: "/signup",
      cta: t('landing.hero_cta'),
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />,
    },
    {
      Icon: ShieldCheck,
      name: t('landing.feat4_title'),
      description: t('landing.feat4_desc'),
      href: "/signup",
      cta: t('landing.feat4_cta'),
      className: "col-span-3 lg:col-span-3",
      background: <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent" />,
    },
  ];

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
          <Link href="#features" className="hover:text-primary transition-colors">{t('landing.nav_features')}</Link>
          <Link href="/login" className="hover:text-primary transition-colors">{t('common.login')}</Link>
        </div>
        <Link href="/signup">
          <ShimmerButton className="text-sm font-semibold px-6 py-2">
            {t('landing.hero_cta')}
          </ShimmerButton>
        </Link>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center pt-24 pb-32 px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 max-w-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent leading-[1.1]">
            {t('landing.hero_title')}
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
            {t('landing.hero_desc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <ShimmerButton className="px-8 py-3 text-lg font-bold">
                {t('landing.hero_cta')}
              </ShimmerButton>
            </Link>
            <Link href="/login">
              <button className="px-8 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-semibold backdrop-blur-md">
                {t('common.login')}
              </button>
            </Link>
          </div>

          {/* Mockup Preview */}
          <div className="mt-20 relative w-full max-w-5xl mx-auto px-4 group">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] skew-y-1 group-hover:skew-y-0 transition-all duration-700 bg-slate-900/50 backdrop-blur-sm">
              <Image
                src="/landing_hero_mockup.png"
                alt="Platform Mockup"
                width={1200}
                height={675}
                className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            </div>

            {/* Ambient Glows */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] -z-10" />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 -z-10" />
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-slate-900">{t('landing.nav_features')}</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">{t('landing.hero_desc')}</p>
            </div>

            <BentoGrid className="lg:grid-rows-3">
              {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
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
          <p className="text-sm text-muted-foreground mb-4">© 2024 LinkInBio Platform. {t('public.powered_by')}</p>
        </footer>
      </main>
    </div>
  );
}
