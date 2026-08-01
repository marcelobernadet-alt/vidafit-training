@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    @apply bg-base text-ink;
  }
  body {
    @apply bg-base text-ink antialiased;
    -webkit-tap-highlight-color: transparent;
  }
  ::selection {
    @apply bg-lime text-black;
  }
}

@layer components {
  .card {
    @apply bg-base-soft border border-base-border rounded-xl2 p-5;
  }
  .eyebrow {
    @apply text-xs font-semibold tracking-widest text-lime uppercase;
  }
  .btn-primary {
    @apply bg-lime text-black font-semibold rounded-full px-5 py-3 text-sm tracking-wide
           active:scale-[0.98] transition-transform disabled:opacity-40 disabled:pointer-events-none;
  }
  .btn-secondary {
    @apply bg-base-soft border border-base-border text-ink font-medium rounded-full px-5 py-3 text-sm
           active:scale-[0.98] transition-transform;
  }
  .input-field {
    @apply w-full bg-base-soft border border-base-border rounded-xl px-4 py-3 text-sm text-ink
           placeholder:text-ink-faint focus:outline-none focus:border-lime transition-colors;
  }
}
