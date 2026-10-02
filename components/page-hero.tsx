export function PageHero({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return <section className="page-hero"><div className="container-shell"><span className="page-kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div></section>;
}
