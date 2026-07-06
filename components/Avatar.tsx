"use client";

import { GRADIENTS } from "@/lib/seed";

export default function Avatar({
  name,
  gradient,
  size = 40,
}: {
  name: string;
  gradient: number;
  size?: number;
}) {
  const initials = name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: GRADIENTS[gradient % GRADIENTS.length],
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
