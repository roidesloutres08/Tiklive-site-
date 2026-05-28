"use client";

import { useState } from "react";

const links = [
  { href: "#fonctionnalites", label: "Fonctionnalités" },
  { href: "#fonctionnement", label: "Comment ça marche" },
  { href: "#modes", label: "Modes interactifs" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <a href="#top" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-logo">◈</span>
          Tiklive
        </a>

        <ul className={`nav-links${open ? " open" : ""}`}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-cta">
          <a
            className="btn btn-primary"
            href="https://tiklive.eu"
            target="_blank"
            rel="noopener noreferrer"
          >
            Accéder à Tiklive
          </a>
          <button
            className="nav-toggle"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
