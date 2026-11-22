export default function PlaceholderPage({ kicker, title, description }) {
  return (
    <section className="rounded-3xl border border-dashed border-line bg-white px-6 py-14 sm:px-10">
      <p className="text-xs tracking-[0.14em] text-gold">{kicker}</p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">{description}</p>
    </section>
  );
}
