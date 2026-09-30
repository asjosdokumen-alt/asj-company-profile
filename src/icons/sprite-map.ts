// Icon manifest — bare icon name -> sprite symbol id.
//
// PRUNED 2026-09-30: 155 -> 46 entries, matching `sprite.svg`. The generator
// that produced this file (`scripts/build-icon-sprite.mjs`, per its original
// header) is NOT in this repo — it stayed in the portal — so `npm run icons`
// will not work here. Edit this file and `sprite.svg` together, and re-run the
// pruner (`.tmp-sprite-prune.mjs`, kept as the `svg-sprite-prune` skill) if you
// need to re-derive which entries are still reachable.
//
// Every entry here must have a matching `<symbol id="…">` in `sprite.svg`, or
// `Icon.tsx` resolves the id, renders nothing, and warns only in dev — a silent
// blank icon in production.

/**
 * Bare icon name -> sprite symbol id.
 *
 * The prefix is part of the value on purpose: brand glyphs (whatsapp, instagram, tiktok) live under `fab-`, everything else under `fas-`.
 */
export const SPRITE_IDS: Record<string, string> = {
  "times": "fas-times",
  "whatsapp": "fab-whatsapp",
  "spinner": "fas-spinner",
  "file-alt": "fas-file-alt",
  "check-circle": "fas-check-circle",
  "graduation-cap": "fas-graduation-cap",
  "edit": "fas-edit",
  "id-card": "fas-id-card",
  "paper-plane": "fas-paper-plane",
  "info-circle": "fas-info-circle",
  "language": "fas-language",
  "exclamation-triangle": "fas-exclamation-triangle",
  "envelope": "fas-envelope",
  "map-marker-alt": "fas-map-marker-alt",
  "wallet": "fas-wallet",
  "search": "fas-search",
  "user-plus": "fas-user-plus",
  "image": "fas-image",
  "arrow-right": "fas-arrow-right",
  "bars": "fas-bars",
  "upload": "fas-upload",
  "filter": "fas-filter",
  "bullhorn": "fas-bullhorn",
  "comments": "fas-comments",
  "sun": "fas-sun",
  "clipboard-check": "fas-clipboard-check",
  "user-check": "fas-user-check",
  "building": "fas-building",
  "phone": "fas-phone",
  "hotel": "fas-hotel",
  "tshirt": "fas-tshirt",
  "laptop-code": "fas-laptop-code",
  "mobile-alt": "fas-mobile-alt",
  "key": "fas-key",
  "instagram": "fab-instagram",
  "tiktok": "fab-tiktok",
  "hand-holding-usd": "fas-hand-holding-usd",
  "bed": "fas-bed",
  "wifi": "fas-wifi",
  "utensils": "fas-utensils",
  "motorcycle": "fas-motorcycle",
  "futbol": "fas-futbol",
  "passport": "fas-passport",
  "info": "fas-info",
  "exclamation-circle": "fas-exclamation-circle",
  "location-arrow": "fas-location-arrow",
};
