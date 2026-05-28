"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Comment Tiklive se connecte-t-il à mon LIVE TikTok ?",
    a: "Vous reliez votre compte en quelques clics, puis Tiklive écoute en temps réel les événements de votre LIVE (cadeaux, likes, follows, partages, commentaires) pour déclencher les actions que vous avez configurées.",
  },
  {
    q: "Ai-je besoin d'OBS ou de TikTok LIVE Studio ?",
    a: "Les overlays s'intègrent dans OBS, Streamlabs ou TikTok LIVE Studio via une simple source navigateur. Vous pouvez aussi utiliser certains modes interactifs directement, sans logiciel tiers.",
  },
  {
    q: "Le Text-to-Speech gère-t-il le français et plusieurs voix ?",
    a: "Oui. Le TTS lit les messages et les cadeaux à voix haute avec plusieurs voix et langues, dont le français, et des filtres de modération pour éviter les abus.",
  },
  {
    q: "Que sont les modes interactifs ?",
    a: "Ce sont des mini-expériences pilotées par votre audience : défis streamer vs viewers, votes, objectifs de cadeaux, mini-jeux… Vos viewers influencent le LIVE en envoyant des cadeaux ou en interagissant.",
  },
  {
    q: "Puis-je essayer Tiklive gratuitement ?",
    a: "Oui, une offre gratuite permet de tester les automatisations de base. Vous pouvez passer à une offre supérieure à tout moment pour débloquer plus d'actions, de modes et de personnalisation.",
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="faq-list">
      {faqs.map((item, i) => (
        <div key={i} className={`faq-item${openIdx === i ? " open" : ""}`}>
          <button
            className="faq-q"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            aria-expanded={openIdx === i}
          >
            {item.q}
            <span className="sign">+</span>
          </button>
          <div className="faq-a">
            <p>{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
