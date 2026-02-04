'use client'

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Particles } from "@/components/ui/particles";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useTranslation } from "@/lib/i18n/provider";
import {
  Link2,
  Palette,
  BarChart3,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  Share2,
  Zap,
  ArrowRight,
  ChevronDown,
  Globe,
  Users,
  Layers,
  Layout,
  MousePointer2,
  AlertCircle
} from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import IsoLevelWarp from "@/components/ui/isometric-wave-grid-background";
import { Logo } from "@/components/ui/logo";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";


const faqData = [
  { q: "faq_q1", a: "faq_a1" },
  { q: "faq_q2", a: "faq_a2" },
  { q: "faq_q3", a: "faq_a3" },
];

export default function Home() {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [particleColor, setParticleColor] = useState("#ffffff");

  useEffect(() => {
    setParticleColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  const features = [
    {
      Icon: Palette,
      name: t('landing.feat1_title'),
      description: t('landing.feat1_desc'),
      href: "/signup",
      cta: t('landing.hero_cta'),
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />,
    },
    {
      Icon: Link2,
      name: t('landing.feat2_title'),
      description: t('landing.feat2_desc'),
      href: "/signup",
      cta: t('landing.hero_cta'),
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />,
    },
    {
      Icon: BarChart3,
      name: t('landing.feat3_title'),
      description: t('landing.feat3_desc'),
      href: "/signup",
      cta: t('landing.hero_cta'),
      className: "col-span-3 lg:col-span-1",
      background: <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />,
    },
    {
      Icon: Smartphone,
      name: t('landing.feat4_title'),
      description: t('landing.feat4_desc'),
      href: "/signup",
      cta: t('landing.hero_cta'),
      className: "col-span-3 lg:col-span-3",
      background: <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-background font-sans selection:bg-primary/20 text-foreground overflow-x-hidden">
      <Particles
        className={`fixed inset-0 z-0 pointer-events-none ${resolvedTheme === "dark" ? "opacity-20" : "opacity-60"}`}
        quantity={130}
        staticity={40}
        ease={50}
        size={0.4}
        color={particleColor}
        refresh
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-white/5 bg-background/60">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground mr-4">
            <Link href="#features" className="hover:text-primary transition-colors">{t('landing.nav_features')}</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">{t('landing.how_title')}</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">{t('landing.pricing_title')}</Link>
            <Link href="/login" className="hover:text-primary transition-colors">{t('common.login')}</Link>
          </div>
          <ThemeToggle />
          <LanguageSwitcher />
          <Link href="/signup">
            <ShimmerButton className="text-sm font-semibold px-5 py-2">
              {t('landing.hero_cta')}
            </ShimmerButton>
          </Link>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative pt-24 overflow-hidden">

        <ContainerScroll
          titleComponent={
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full border border-primary/20">
                {t('landing.hero_support')}
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-5 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent leading-[0.95] max-w-3xl mx-auto">
                {t('landing.hero_title')}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto mb-6 leading-relaxed font-medium">
                {t('landing.hero_desc')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
                <Link href="/signup">
                  <ShimmerButton className="px-6 py-2.5 text-base font-bold shadow-xl shadow-primary/20">
                    {t('landing.hero_cta')}
                  </ShimmerButton>
                </Link>
                <Link href="/demo">
                  <button className="px-6 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold backdrop-blur-md text-base flex items-center gap-2 group">
                    {t('landing.hero_example')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>
          }
        >
          <div className="relative h-full w-full bg-neutral-900/50 rounded-2xl overflow-hidden">
            <Image
              src="/landing_hero_mockup.png"
              alt="Dashboard Preview"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </ContainerScroll>
      </section>


      {/* Solution Section */}
      <section className="mt-8 py-12 px-6 relative overflow-hidden">


        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="text-center mb-8 max-w-lg">
            <h2 className="text-2xl md:text-4xl font-black mb-4 tracking-tighter">{t('landing.solution_title')}</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{t('landing.solution_desc')}</p>
          </div>

          {/* Bento Features */}
          <BentoGrid className="max-w-4xl mx-auto">
            {features.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 relative overflow-hidden">


        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black mb-12 text-center tracking-tight">{t('landing.how_title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[4.5rem] left-0 w-full h-0.5 border-t-2 border-dashed border-primary/20 -z-0" />

            {[1, 2, 3].map((step) => (
              <div key={step} className="relative z-10 space-y-6 text-center group">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-3xl font-black mx-auto shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
                  {step}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{t(`landing.how_step${step}_title` as any)}</h3>
                <p className="text-muted-foreground font-medium text-lg px-6">{t(`landing.how_step${step}_desc` as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-6 relative overflow-hidden">


        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">{t('landing.usecases_title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 'creators', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
              { id: 'founders', icon: Layers, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { id: 'freelancers', icon: Layout, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { id: 'students', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' }
            ].map((usecase) => (
              <div key={usecase.id} className="p-8 rounded-3xl border border-white/5 bg-muted/30 hover:bg-muted/50 transition-all hover:-translate-y-2 group">
                <div className={`w-14 h-14 ${usecase.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <usecase.icon className={`w-8 h-8 ${usecase.color}`} />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{t(`landing.usecase_${usecase.id}_title` as any)}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{t(`landing.usecase_${usecase.id}_desc` as any)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-6 relative overflow-hidden">


        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black mb-3 tracking-tighter">{t('landing.pricing_title')}</h2>
          </div>

          <div className="flex flex-col items-center justify-center py-16 px-6 bg-muted/10 rounded-[2.5rem] border border-white/10 backdrop-blur-md max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent mb-6 text-center">
              Şimdilik her şey ücretsiz.
            </h3>
            <p className="text-muted-foreground text-lg md:text-xl font-medium text-center max-w-lg mb-8 leading-relaxed">
              Erken erişim sürecinde tüm premium özellikleri hiçbir ücret ödemeden sınırsızca kullanabilirsiniz.
            </p>
            <Link href="/signup">
              <ShimmerButton className="px-10 py-4 text-lg font-bold shadow-xl shadow-primary/20">
                {t('landing.hero_cta')}
              </ShimmerButton>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-background -z-20" />

        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-12 text-center uppercase tracking-tight">{t('landing.faq_title')}</h2>

          <div className="space-y-4">
            {faqData.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-white/5 bg-muted/30 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center group"
                >
                  <span className="text-xl font-bold">{t(faq.q as any)}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 pt-0 text-muted-foreground font-medium border-t border-white/5">
                        {t(faq.a as any)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 px-6 relative">
        <div className="max-w-4xl mx-auto bg-primary rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-primary/20">

          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black mb-8 tracking-tighter leading-[0.9]">{t('landing.final_cta_title')}</h2>
            <Link href="/signup">
              <button className="px-8 py-3.5 bg-white text-black rounded-xl text-lg font-black hover:scale-105 transition-transform shadow-xl">
                {t('landing.final_cta_button')}
              </button>
            </Link>
            <p className="mt-6 text-white/60 font-medium tracking-wide uppercase text-[10px]">{t('landing.hero_support')}</p>
          </div>
          {/* Abstract blobs */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-black/10 rounded-full blur-[100px]" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-background -z-20" />

        <div className="max-w-6xl mx-auto px-12 lg:px-24 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-center md:text-left">
            <div className="space-y-4">
              <Logo />
              <p className="text-muted-foreground font-medium leading-relaxed text-sm">
                Connect all your online presence with one powerful link.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="font-black uppercase tracking-widest text-sm">Product</h4>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-primary transition-colors">Examples</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-black uppercase tracking-widest text-sm">Company</h4>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-black uppercase tracking-widest text-sm">Legal</h4>
              <ul className="space-y-4 text-muted-foreground font-medium">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            <p>© 2026 The Infinite Link. All rights reserved.</p>
            <p className="flex items-center gap-2">Built for creators by creators</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
