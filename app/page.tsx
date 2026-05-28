import Navbar from "@/components/Navbar";
import Faq from "@/components/Faq";

const features = [
  {
    icon: "🎁",
    title: "Automatisation des cadeaux",
    desc: "Chaque cadeau déclenche l'action de votre choix : animation, son, message ou enchaînement complet. Vous définissez vos règles une seule fois.",
  },
  {
    icon: "✨",
    title: "Actions & overlays",
    desc: "Des overlays animés en temps réel, synchronisés avec OBS, Streamlabs ou TikTok LIVE Studio via une simple source navigateur.",
  },
  {
    icon: "🔊",
    title: "Text-to-Speech (TTS)",
    desc: "Les messages et donateurs sont lus à voix haute, avec plusieurs voix, plusieurs langues et des filtres de modération intégrés.",
  },
  {
    icon: "🎮",
    title: "Modes interactifs",
    desc: "Défis, votes, objectifs et mini-jeux streamer vs viewers, pilotés par les événements de votre LIVE pour une audience active.",
  },
  {
    icon: "🛡️",
    title: "Modération intelligente",
    desc: "Filtres de mots, anti-spam et blacklist pour garder un LIVE propre, même quand l'audience s'emballe.",
  },
  {
    icon: "⚡",
    title: "Mise en place express",
    desc: "Reliez votre compte TikTok et vos logiciels de stream en quelques clics. Aucune compétence technique requise.",
  },
];

const steps = [
  {
    title: "Connectez votre LIVE",
    desc: "Liez votre compte TikTok et votre logiciel de stream. Tiklive écoute aussitôt les événements en temps réel.",
  },
  {
    title: "Configurez vos déclencheurs",
    desc: "Associez cadeaux, likes, follows et partages à des actions : overlays, sons, TTS, modes interactifs…",
  },
  {
    title: "Lancez votre LIVE",
    desc: "Tiklive réagit automatiquement. Vous animez, votre audience interagit, le reste tourne tout seul.",
  },
];

const modes = [
  {
    icon: "⚔️",
    title: "Streamer vs Viewers",
    desc: "Vos viewers vous défient en envoyant des cadeaux. Plus ils participent, plus le défi monte d'un cran.",
  },
  {
    icon: "📊",
    title: "Votes & sondages",
    desc: "L'audience vote en direct via les commentaires ou les cadeaux et fait basculer le déroulé du LIVE.",
  },
  {
    icon: "🎯",
    title: "Objectifs de cadeaux",
    desc: "Affichez une barre d'objectif qui se remplit en temps réel et débloque une récompense une fois atteinte.",
  },
  {
    icon: "🎲",
    title: "Mini-jeux & roue",
    desc: "Roue de la chance, tirages et mini-jeux déclenchés par cadeau pour récompenser votre communauté.",
  },
];

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    period: "/ pour toujours",
    sub: "Idéal pour découvrir l'automatisation de vos LIVE.",
    features: [
      "Automatisations de base",
      "1 overlay alerte cadeau",
      "TTS avec voix standard",
      "Liaison du compte TikTok",
    ],
    cta: "Commencer",
    featured: false,
  },
  {
    name: "Pro",
    price: "9€",
    period: "/ mois",
    sub: "Pour les streamers réguliers qui veulent tout débloquer.",
    features: [
      "Automatisations illimitées",
      "Overlays & actions personnalisés",
      "TTS multi-voix & multilingue",
      "Tous les modes interactifs",
      "Modération avancée",
    ],
    cta: "Passer Pro",
    featured: true,
  },
  {
    name: "Équipe",
    price: "Sur devis",
    period: "",
    sub: "Pour les agences et créateurs gérant plusieurs comptes.",
    features: [
      "Tout le plan Pro",
      "Multi-comptes",
      "Branding personnalisé",
      "Support prioritaire",
    ],
    cta: "Nous contacter",
    featured: false,
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="container hero-inner">
            <span className="badge">
              <span className="dot" />
              Système d&apos;automatisation TikTok LIVE
            </span>
            <h1>
              Transformez vos LIVE TikTok en{" "}
              <span className="gradient-text">expériences interactives</span>
            </h1>
            <p className="lead">
              Tiklive automatise vos cadeaux, déclenche des overlays animés, lit
              les messages en Text-to-Speech et propose des modes interactifs —
              pour des LIVE plus vivants, sans rien gérer à la main.
            </p>
            <div className="hero-actions">
              <a
                className="btn btn-primary"
                href="https://tiklive.eu"
                target="_blank"
                rel="noopener noreferrer"
              >
                Découvrir Tiklive
              </a>
              <a className="btn btn-ghost" href="#fonctionnalites">
                Explorer les fonctions
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <div className="num gradient-text">Temps réel</div>
                <div className="label">Réaction aux événements</div>
              </div>
              <div className="stat">
                <div className="num gradient-text">+20</div>
                <div className="label">Actions automatisables</div>
              </div>
              <div className="stat">
                <div className="num gradient-text">Multilingue</div>
                <div className="label">Text-to-Speech</div>
              </div>
            </div>
          </div>

          {/* HUD console */}
          <div className="container">
            <div className="hud">
              <span className="hud-corner tl" />
              <span className="hud-corner tr" />
              <span className="hud-corner bl" />
              <span className="hud-corner br" />

              <div className="hud-bar">
                <span className="hud-status">
                  <span className="dot" />
                  Système en ligne
                </span>
                <span className="hud-tag">● LIVE · TikTok</span>
                <span>Latence 12 ms</span>
              </div>

              <div className="hud-body">
                <div className="reactor">
                  <span className="sweep" />
                  <span className="ring ring-1" />
                  <span className="ring ring-2" />
                  <span className="ring ring-3" />
                  <span className="reactor-core" />
                  <span className="reactor-cap">TIKLIVE&nbsp;OS</span>
                </div>

                <div className="readouts">
                  <div className="readout">
                    <div className="r-top">
                      <span className="r-k">Cadeaux traités</span>
                      <span className="r-v">1&nbsp;204</span>
                    </div>
                    <span className="r-bar">
                      <i style={{ width: "78%" }} />
                    </span>
                  </div>
                  <div className="readout">
                    <div className="r-top">
                      <span className="r-k">Objectif cadeaux</span>
                      <span className="r-v">68%</span>
                    </div>
                    <span className="r-bar">
                      <i style={{ width: "68%" }} />
                    </span>
                  </div>
                  <div className="readout">
                    <div className="r-top">
                      <span className="r-k">Mode actif</span>
                      <span className="r-v cyan">VS Viewers</span>
                    </div>
                  </div>
                  <div className="readout log">
                    <span className="r-k">Flux d&apos;événements</span>
                    <p>▸ @julie · Rose → overlay + TTS</p>
                    <p>▸ @max · Follow → alerte sonore</p>
                    <p className="muted">▸ TTS en lecture…</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS */}
        <section className="logos">
          <div className="container">
            <p>Compatible avec vos outils de stream</p>
            <div className="logos-row">
              <span>OBS Studio</span>
              <span>Streamlabs</span>
              <span>TikTok LIVE Studio</span>
              <span>Navigateur</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="section" id="fonctionnalites">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Fonctionnalités</span>
              <h2>Tout ce qu'il faut pour animer vos LIVE</h2>
              <p>
                Une boîte à outils complète pour réagir à chaque interaction de
                votre audience, automatiquement.
              </p>
            </div>
            <div className="features-grid">
              {features.map((f) => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" id="fonctionnement">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Comment ça marche</span>
              <h2>Opérationnel en 3 étapes</h2>
              <p>
                Pas de configuration interminable. Branchez, paramétrez, lancez.
              </p>
            </div>
            <div className="steps">
              {steps.map((s, i) => (
                <div className="step" key={s.title}>
                  <div className="step-num">0{i + 1}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODES */}
        <section className="section" id="modes">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Modes interactifs</span>
              <h2>Faites participer votre audience</h2>
              <p>
                Donnez du pouvoir à vos viewers : leurs interactions changent le
                cours du LIVE en direct.
              </p>
            </div>
            <div className="modes-grid">
              {modes.map((m) => (
                <div className="mode-card" key={m.title}>
                  <div className="m-icon">{m.icon}</div>
                  <div>
                    <h3>{m.title}</h3>
                    <p>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="section" id="tarifs">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Tarifs</span>
              <h2>Une offre pour chaque créateur</h2>
              <p>
                Commencez gratuitement, évoluez quand votre communauté grandit.
              </p>
            </div>
            <div className="pricing-grid">
              {plans.map((p) => (
                <div
                  className={`price-card${p.featured ? " featured" : ""}`}
                  key={p.name}
                >
                  {p.featured && <span className="tag">Populaire</span>}
                  <h3>{p.name}</h3>
                  <div className="price">
                    {p.price}
                    {p.period && <small> {p.period}</small>}
                  </div>
                  <p className="sub">{p.sub}</p>
                  <ul>
                    {p.features.map((feat) => (
                      <li key={feat}>
                        <span className="check">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <a
                    className={`btn ${p.featured ? "btn-primary" : "btn-ghost"}`}
                    href="https://tiklive.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {p.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">FAQ</span>
              <h2>Questions fréquentes</h2>
            </div>
            <Faq />
          </div>
        </section>

        {/* CTA */}
        <section className="section cta">
          <div className="container">
            <div className="cta-box">
              <h2>Prêt à dynamiser vos LIVE TikTok ?</h2>
              <p>
                Rejoignez Tiklive et laissez l'automatisation s'occuper du
                spectacle pendant que vous animez.
              </p>
              <a
                className="btn btn-primary"
                href="https://tiklive.eu"
                target="_blank"
                rel="noopener noreferrer"
              >
                Démarrer maintenant
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="brand">
                <span className="brand-logo">▶</span>
                Tiklive
              </a>
              <p>
                L'automatisation et l'interactivité pour vos LIVE TikTok :
                cadeaux, overlays, TTS et modes interactifs.
              </p>
            </div>
            <div className="footer-col">
              <h4>Produit</h4>
              <ul>
                <li>
                  <a href="#fonctionnalites">Fonctionnalités</a>
                </li>
                <li>
                  <a href="#modes">Modes interactifs</a>
                </li>
                <li>
                  <a href="#tarifs">Tarifs</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Ressources</h4>
              <ul>
                <li>
                  <a href="#fonctionnement">Comment ça marche</a>
                </li>
                <li>
                  <a href="#tarifs">Tarifs</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a
                    href="https://tiklive.eu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Accéder à l&apos;application
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Tiklive. Tous droits réservés.</span>
            <span>Non affilié à TikTok.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
