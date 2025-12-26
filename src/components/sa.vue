<script setup>
const features = [
  {
    title: "Design-System",
    desc: "Konsistente Abstände, Farben und Typografie.",
  },
  { title: "Responsive Layout", desc: "Sieht auf Handy und Desktop gut aus." },
  { title: "Schnell startklar", desc: "Copy/paste und anpassen." },
  { title: "Komponenten", desc: "Kleine UI-Teile wiederverwenden." },
  { title: "CTA-fokussiert", desc: "Klarer nächster Schritt für Nutzer." },
  { title: "Modern Look", desc: "Clean, kontrastreich, minimal." },
];

const testimonials = [
  { name: "Mina", quote: "Sieht sofort professionell aus. Genau mein Stil." },
  { name: "Jonas", quote: "Sauberer Startpunkt – ich war in 10 Minuten live." },
  { name: "Aylin", quote: "Die Komponenten sind super leicht anpassbar." },
];

const pricing = [
  {
    plan: "Starter",
    price: "€0",
    perks: ["1 Projekt", "Community Support", "Basis-Features"],
    featured: false,
  },
  {
    plan: "Pro",
    price: "€12",
    perks: ["Unbegrenzt", "Schneller Support", "Pro-Features"],
    featured: true,
  },
  {
    plan: "Team",
    price: "€29",
    perks: ["Teamspaces", "Rollen & Rechte", "Priorität"],
    featured: false,
  },
];

const year = new Date().getFullYear();
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <!-- Header -->
    <header
      class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"
      >
        <div class="flex items-center gap-2">
          <div class="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
            <span class="text-sm font-bold">V</span>
          </div>
          <span class="font-semibold tracking-tight">ViteVue</span>
        </div>

        <nav class="hidden items-center gap-6 text-sm text-white/80 md:flex">
          <a class="hover:text-white" href="#features">Features</a>
          <a class="hover:text-white" href="#testimonials">Stimmen</a>
          <a class="hover:text-white" href="#pricing">Pricing</a>
        </nav>

        <div class="flex items-center gap-3">
          <button
            class="hidden rounded-xl px-4 py-2 text-sm text-white/80 hover:text-white md:inline-flex"
          >
            Login
          </button>
          <button
            class="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-white/90"
          >
            Starten
          </button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="pointer-events-none absolute inset-0 opacity-40">
        <div
          class="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
        ></div>
        <div
          class="absolute -bottom-24 left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        ></div>
      </div>

      <div class="mx-auto max-w-6xl px-4 py-20">
        <div class="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
            >
              <span class="h-2 w-2 rounded-full bg-emerald-400" />
              Neu: Schnell & clean mit Tailwind
            </div>

            <h1 class="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              Baue eine moderne Homepage in
              <span class="text-white/70">Vite + Vue + Tailwind</span>
            </h1>

            <p class="mt-4 leading-relaxed text-white/70">
              Hero, Features, Testimonials und CTA — alles responsiv,
              minimalistisch und direkt einsatzbereit.
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <button
                class="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
              >
                Kostenlos starten
              </button>
              <button
                class="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Demo ansehen
              </button>
            </div>

            <div
              class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60"
            >
              <span>⚡ Schnell</span>
              <span>🧩 Komponentenfähig</span>
              <span>📱 Responsiv</span>
            </div>
          </div>

          <!-- Mock Card -->
          <div
            class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
          >
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold">Dashboard Preview</p>
              <span
                class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
              >
                live
              </span>
            </div>

            <div class="mt-6 grid gap-4">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs text-white/60">Aktive Nutzer</p>
                <p class="mt-2 text-3xl font-bold">12,482</p>
                <p class="mt-1 text-xs text-emerald-300">+14% diese Woche</p>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-xs text-white/60">Umsatz</p>
                  <p class="mt-2 text-xl font-semibold">€ 38.2k</p>
                  <p class="mt-1 text-xs text-white/50">letzte 30 Tage</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-xs text-white/60">Conversion</p>
                  <p class="mt-2 text-xl font-semibold">4.7%</p>
                  <p class="mt-1 text-xs text-white/50">Durchschnitt</p>
                </div>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="flex items-center justify-between">
                  <p class="text-sm font-semibold">Top Pages</p>
                  <p class="text-xs text-white/50">heute</p>
                </div>
                <div class="mt-3 space-y-2 text-sm text-white/70">
                  <div class="flex items-center justify-between">
                    <span>Home</span><span class="text-white/50">4,210</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Docs</span><span class="text-white/50">2,118</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>Pricing</span><span class="text-white/50">1,004</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="border-t border-white/10">
      <div class="mx-auto max-w-6xl px-4 py-16">
        <div class="max-w-2xl">
          <h2 class="text-2xl font-bold">Features</h2>
          <p class="mt-2 text-white/70">
            Ein paar Bausteine, die fast jede Homepage braucht.
          </p>
        </div>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="f in features"
            :key="f.title"
            class="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
          >
            <div
              class="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-sm"
              >✦</div
            >
            <h3 class="mt-4 font-semibold">{{ f.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-white/70">{{
              f.desc
            }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section id="testimonials" class="border-t border-white/10">
      <div class="mx-auto max-w-6xl px-4 py-16">
        <h2 class="text-2xl font-bold">Was Leute sagen</h2>

        <div class="mt-10 grid gap-4 md:grid-cols-3">
          <figure
            v-for="t in testimonials"
            :key="t.name"
            class="rounded-3xl border border-white/10 bg-white/5 p-6"
          >
            <blockquote class="leading-relaxed text-white/80"
              >„{{ t.quote }}“</blockquote
            >
            <figcaption class="mt-4 text-sm text-white/60"
              >— {{ t.name }}</figcaption
            >
          </figure>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="border-t border-white/10">
      <div class="mx-auto max-w-6xl px-4 py-16">
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h2 class="text-2xl font-bold">Pricing</h2>
            <p class="mt-2 text-white/70"
              >Platzhalter — setz hier deine echten Pläne ein.</p
            >
          </div>
          <span class="text-sm text-white/60">14 Tage kostenlos testen</span>
        </div>

        <div class="mt-10 grid gap-4 lg:grid-cols-3">
          <div
            v-for="p in pricing"
            :key="p.plan"
            class="rounded-3xl border p-6"
            :class="
              p.featured
                ? 'border-white/20 bg-white/10'
                : 'border-white/10 bg-white/5'
            "
          >
            <div class="flex items-baseline justify-between">
              <h3 class="font-semibold">{{ p.plan }}</h3>
              <p class="text-2xl font-bold">{{ p.price }}</p>
            </div>

            <ul class="mt-6 space-y-2 text-sm text-white/70">
              <li
                v-for="perk in p.perks"
                :key="perk"
                class="flex items-center gap-2"
              >
                <span class="text-emerald-300">✓</span>
                <span>{{ perk }}</span>
              </li>
            </ul>

            <button
              class="mt-8 w-full rounded-xl px-4 py-2 text-sm font-semibold transition"
              :class="
                p.featured
                  ? 'bg-white text-slate-950 hover:bg-white/90'
                  : 'border border-white/15 bg-white/5 hover:bg-white/10'
              "
            >
              {{ p.featured ? "Pro wählen" : "Auswählen" }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="border-t border-white/10">
      <div class="mx-auto max-w-6xl px-4 py-16">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
          <div
            class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 class="text-2xl font-bold">Bereit loszulegen?</h2>
              <p class="mt-2 text-white/70">
                Ersetze Texte/Links durch deine Inhalte und du bist fertig.
              </p>
            </div>
            <div class="flex flex-wrap gap-3">
              <button
                class="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-white/90"
              >
                Projekt starten
              </button>
              <button
                class="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Kontakt
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-white/10">
      <div class="mx-auto max-w-6xl px-4 py-10 text-sm text-white/60">
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {{ year }} ViteVue</p>
          <div class="flex gap-4">
            <a class="hover:text-white" href="#">Impressum</a>
            <a class="hover:text-white" href="#">Datenschutz</a>
            <a class="hover:text-white" href="#">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  </div>

  <div class="flex flex-col gap-3 mx-auto bg-amber-600">dsads</div>
</template>
