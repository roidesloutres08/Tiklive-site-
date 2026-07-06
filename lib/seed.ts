import type {
  Conversation,
  LiveStream,
  Notification,
  Post,
  User,
} from "./types";

// Palette de dégradés utilisée pour les avatars et les fonds de live.
export const GRADIENTS = [
  "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)",
  "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
];

const VIDEO_BUCKET =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";

export const SEED_USERS: User[] = [
  { handle: "maya.dance", name: "Maya Laurent", bio: "Danseuse 💃 | Paris | Chorées tous les jours", gradient: 0, followers: 2400000, following: 312, verified: true },
  { handle: "leo_gaming", name: "Léo Moreau", bio: "Gamer pro 🎮 Lives tous les soirs à 20h", gradient: 1, followers: 890000, following: 154, verified: true },
  { handle: "chef.amelie", name: "Amélie Rousseau", bio: "Recettes faciles en 60 secondes 🍳", gradient: 2, followers: 1200000, following: 87 },
  { handle: "nico.travel", name: "Nicolas Petit", bio: "🌍 47 pays visités | Vidéaste voyage", gradient: 3, followers: 560000, following: 430, verified: true },
  { handle: "sofia.fit", name: "Sofia Martins", bio: "Coach sportive 💪 Programme gratuit en bio", gradient: 4, followers: 780000, following: 201 },
  { handle: "tom.humour", name: "Tom Lefèvre", bio: "Je fais des sketchs. Parfois drôles. 😅", gradient: 5, followers: 3100000, following: 98, verified: true },
  { handle: "lina.art", name: "Lina Nguyen", bio: "Dessins & speedpaints 🎨 Commandes ouvertes", gradient: 6, followers: 340000, following: 512 },
  { handle: "dj.karim", name: "Karim Benali", bio: "DJ & producteur 🎧 Nouveau single dispo", gradient: 7, followers: 1500000, following: 76, verified: true },
  { handle: "emma.mode", name: "Emma Dubois", bio: "Mode & lifestyle ✨ Collabs : DM", gradient: 8, followers: 920000, following: 645 },
  { handle: "alex.tech", name: "Alex Fontaine", bio: "Tech, gadgets & IA 🤖 Tests honnêtes", gradient: 9, followers: 450000, following: 233 },
];

export const SEED_POSTS: Post[] = [
  {
    id: "p1",
    author: "maya.dance",
    type: "video",
    src: `${VIDEO_BUCKET}/ForBiggerFun.mp4`,
    poster: `${VIDEO_BUCKET}/images/ForBiggerFun.jpg`,
    caption: "Nouvelle chorée sur le son du moment 🔥 Qui relève le défi ?",
    hashtags: ["danse", "choré", "pourtoi"],
    music: "Son original — maya.dance",
    likes: 245300,
    shares: 12400,
    comments: [
      { id: "c1", author: "emma.mode", text: "Incroyable !! Je teste ce soir 😍", likes: 1200, time: "il y a 2 h" },
      { id: "c2", author: "tom.humour", text: "Moi qui essaie : 💀", likes: 8900, time: "il y a 1 h" },
      { id: "c3", author: "sofia.fit", text: "Le niveau 🔥🔥", likes: 430, time: "il y a 45 min" },
    ],
  },
  {
    id: "p2",
    author: "chef.amelie",
    type: "video",
    src: `${VIDEO_BUCKET}/ForBiggerJoyrides.mp4`,
    poster: `${VIDEO_BUCKET}/images/ForBiggerJoyrides.jpg`,
    caption: "Pâtes carbonara en 60 secondes chrono ⏱️🍝 La vraie recette italienne !",
    hashtags: ["cuisine", "recette", "food"],
    music: "Cooking Vibes — Kitchen Beats",
    likes: 98200,
    shares: 5600,
    comments: [
      { id: "c4", author: "nico.travel", text: "Testée hier, une tuerie 👌", likes: 340, time: "il y a 3 h" },
      { id: "c5", author: "dj.karim", text: "SANS CRÈME enfin quelqu'un qui respecte 🙏", likes: 2100, time: "il y a 2 h" },
    ],
  },
  {
    id: "p3",
    author: "nico.travel",
    type: "photo",
    src: "https://picsum.photos/seed/tiklive-bali/720/1080",
    caption: "Lever de soleil sur les rizières de Bali 🌅 Ça valait le réveil à 4h du matin",
    hashtags: ["voyage", "bali", "sunrise"],
    likes: 156700,
    shares: 8900,
    comments: [
      { id: "c6", author: "emma.mode", text: "Magnifique 😍 c'est où exactement ?", likes: 89, time: "il y a 5 h" },
      { id: "c7", author: "maya.dance", text: "Ajouté à ma bucket list ✈️", likes: 156, time: "il y a 4 h" },
    ],
  },
  {
    id: "p4",
    author: "tom.humour",
    type: "video",
    src: `${VIDEO_BUCKET}/ForBiggerBlazes.mp4`,
    poster: `${VIDEO_BUCKET}/images/ForBiggerBlazes.jpg`,
    caption: "Quand ta mère te demande de ranger ta chambre 😂 (fin inattendue)",
    hashtags: ["humour", "sketch", "drole"],
    music: "Funny Moments — Comedy Sounds",
    likes: 512800,
    shares: 45200,
    comments: [
      { id: "c8", author: "leo_gaming", text: "MDRRR la fin 😭😭", likes: 12000, time: "il y a 6 h" },
      { id: "c9", author: "lina.art", text: "Je suis morte 💀", likes: 3400, time: "il y a 5 h" },
      { id: "c10", author: "sofia.fit", text: "C'est tellement moi ptdr", likes: 890, time: "il y a 3 h" },
    ],
  },
  {
    id: "p5",
    author: "sofia.fit",
    type: "video",
    src: `${VIDEO_BUCKET}/ForBiggerEscapes.mp4`,
    poster: `${VIDEO_BUCKET}/images/ForBiggerEscapes.jpg`,
    caption: "5 exercices pour des abdos en béton 💪 Sauvegarde pour plus tard !",
    hashtags: ["fitness", "sport", "motivation"],
    music: "Workout Energy — Gym Beats",
    likes: 187400,
    shares: 23100,
    comments: [
      { id: "c11", author: "maya.dance", text: "Le 3ème est terrible 🥵", likes: 560, time: "il y a 8 h" },
    ],
  },
  {
    id: "p6",
    author: "lina.art",
    type: "photo",
    src: "https://picsum.photos/seed/tiklive-art/720/1080",
    caption: "Speedpaint terminé après 12h de travail 🎨 Swipe pour voir les étapes",
    hashtags: ["art", "dessin", "digitalart"],
    likes: 89300,
    shares: 4200,
    comments: [
      { id: "c12", author: "alex.tech", text: "Le talent 😮 Quelle tablette tu utilises ?", likes: 45, time: "il y a 1 j" },
      { id: "c13", author: "emma.mode", text: "J'achète direct si tu vends des prints !", likes: 230, time: "il y a 22 h" },
    ],
  },
  {
    id: "p7",
    author: "dj.karim",
    type: "video",
    src: `${VIDEO_BUCKET}/ForBiggerMeltdowns.mp4`,
    poster: `${VIDEO_BUCKET}/images/ForBiggerMeltdowns.jpg`,
    caption: "Extrait de mon set d'hier soir 🎧 L'ambiance était FOLLE. Merci Paris ❤️",
    hashtags: ["dj", "musique", "electro"],
    music: "Midnight Drop — DJ Karim",
    likes: 324600,
    shares: 18700,
    comments: [
      { id: "c14", author: "maya.dance", text: "J'y étais !! Soirée de fou 🔥", likes: 780, time: "il y a 12 h" },
      { id: "c15", author: "tom.humour", text: "Le drop à 0:32 🤯", likes: 1500, time: "il y a 10 h" },
    ],
  },
  {
    id: "p8",
    author: "emma.mode",
    type: "photo",
    src: "https://picsum.photos/seed/tiklive-mode/720/1080",
    caption: "Tenue du jour : total look vintage 🤎 Tout est chiné en friperie !",
    hashtags: ["mode", "ootd", "vintage"],
    likes: 143200,
    shares: 6800,
    comments: [
      { id: "c16", author: "lina.art", text: "La veste est sublime 😍", likes: 340, time: "il y a 7 h" },
    ],
  },
  {
    id: "p9",
    author: "alex.tech",
    type: "video",
    src: `${VIDEO_BUCKET}/BigBuckBunny.mp4`,
    poster: `${VIDEO_BUCKET}/images/BigBuckBunny.jpg`,
    caption: "J'ai testé le nouveau casque VR pendant 7 jours. Verdict complet 🤖",
    hashtags: ["tech", "vr", "test"],
    music: "Tech Review — Synthwave",
    likes: 76500,
    shares: 9300,
    comments: [
      { id: "c17", author: "leo_gaming", text: "Il vaut le coup pour le gaming ?", likes: 120, time: "il y a 1 j" },
      { id: "c18", author: "nico.travel", text: "Super review, très complet 👏", likes: 67, time: "il y a 20 h" },
    ],
  },
  {
    id: "p10",
    author: "leo_gaming",
    type: "video",
    src: `${VIDEO_BUCKET}/Sintel.mp4`,
    poster: `${VIDEO_BUCKET}/images/Sintel.jpg`,
    caption: "Le clutch le plus fou de ma carrière 😱 1v5 en finale de tournoi",
    hashtags: ["gaming", "esport", "clutch"],
    music: "Epic Gaming — Victory Sounds",
    likes: 428900,
    shares: 31200,
    comments: [
      { id: "c19", author: "alex.tech", text: "LE GOAT 🐐", likes: 4500, time: "il y a 2 j" },
      { id: "c20", author: "tom.humour", text: "Moi je meurs au spawn 🙃", likes: 8900, time: "il y a 2 j" },
    ],
  },
  {
    id: "p11",
    author: "maya.dance",
    type: "photo",
    src: "https://picsum.photos/seed/tiklive-studio/720/1080",
    caption: "Nouveau studio de danse 🩰 Les cours reprennent lundi, lien en bio !",
    hashtags: ["danse", "studio", "cours"],
    likes: 67800,
    shares: 2100,
    comments: [
      { id: "c21", author: "sofia.fit", text: "Trop hâte 🙌", likes: 89, time: "il y a 3 j" },
    ],
  },
  {
    id: "p12",
    author: "nico.travel",
    type: "video",
    src: `${VIDEO_BUCKET}/TearsOfSteel.mp4`,
    poster: `${VIDEO_BUCKET}/images/TearsOfSteel.jpg`,
    caption: "Road trip en Islande : 10 jours résumés en 1 minute 🇮🇸❄️",
    hashtags: ["voyage", "islande", "roadtrip"],
    music: "Northern Lights — Ambient Trip",
    likes: 234500,
    shares: 15600,
    comments: [
      { id: "c22", author: "emma.mode", text: "Les paysages 😍😍", likes: 450, time: "il y a 4 j" },
      { id: "c23", author: "chef.amelie", text: "J'y vais cet été grâce à toi !", likes: 210, time: "il y a 3 j" },
    ],
  },
];

export const SEED_LIVES: LiveStream[] = [
  { id: "l1", host: "leo_gaming", title: "Ranked jusqu'au top 1 🏆 !giveaway à 10k viewers", category: "Gaming", viewers: 12483, gradient: 1 },
  { id: "l2", host: "dj.karim", title: "Mix live du vendredi 🎧 Vos requêtes dans le chat", category: "Musique", viewers: 8921, gradient: 7 },
  { id: "l3", host: "chef.amelie", title: "On cuisine ensemble : menu du soir 🍳", category: "Cuisine", viewers: 3456, gradient: 2 },
  { id: "l4", host: "maya.dance", title: "Cours de danse en direct 💃 Niveau débutant", category: "Danse", viewers: 5672, gradient: 0 },
  { id: "l5", host: "lina.art", title: "Je dessine vos idées en direct 🎨", category: "Art", viewers: 1893, gradient: 6 },
  { id: "l6", host: "sofia.fit", title: "Séance full body 30 min, tous ensemble 💪", category: "Sport", viewers: 4210, gradient: 4 },
];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: "conv1",
    with: "maya.dance",
    messages: [
      { id: "m1", from: "maya.dance", text: "Salut ! Merci pour ton abonnement 💕", time: "hier, 18:32" },
      { id: "m2", from: "me", text: "Avec plaisir, tes chorées sont incroyables !", time: "hier, 18:40" },
      { id: "m3", from: "maya.dance", text: "Ça me touche 🥰 Nouveau tuto demain, reste connecté(e) !", time: "hier, 19:02" },
    ],
  },
  {
    id: "conv2",
    with: "leo_gaming",
    messages: [
      { id: "m4", from: "leo_gaming", text: "GG pour le game d'hier, bien joué 🎮", time: "lun., 21:15" },
      { id: "m5", from: "me", text: "Merci ! On refait ça quand tu veux", time: "lun., 21:20" },
    ],
  },
  {
    id: "conv3",
    with: "chef.amelie",
    messages: [
      { id: "m6", from: "chef.amelie", text: "La recette que tu m'as demandée est en ligne ! 🍝", time: "sam., 12:05" },
    ],
  },
  {
    id: "conv4",
    with: "tom.humour",
    messages: [
      { id: "m7", from: "tom.humour", text: "Merci pour ton commentaire mdr 😂", time: "ven., 16:44" },
      { id: "m8", from: "me", text: "Ton sketch m'a tué, franchement bravo", time: "ven., 17:01" },
      { id: "m9", from: "tom.humour", text: "Le prochain sera encore pire 😈", time: "ven., 17:15" },
    ],
  },
];

export const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n1", kind: "like", from: "maya.dance", text: "a aimé ta publication", time: "il y a 12 min" },
  { id: "n2", kind: "follow", from: "leo_gaming", text: "s'est abonné à ton compte", time: "il y a 1 h" },
  { id: "n3", kind: "comment", from: "tom.humour", text: "a commenté : « Excellent 😂 »", time: "il y a 2 h" },
  { id: "n4", kind: "live", from: "dj.karim", text: "est en direct : Mix live du vendredi 🎧", time: "il y a 3 h" },
  { id: "n5", kind: "like", from: "emma.mode", text: "a aimé ton commentaire", time: "il y a 5 h" },
  { id: "n6", kind: "mention", from: "sofia.fit", text: "t'a mentionné dans un commentaire", time: "il y a 8 h" },
  { id: "n7", kind: "follow", from: "lina.art", text: "s'est abonnée à ton compte", time: "hier" },
  { id: "n8", kind: "comment", from: "nico.travel", text: "a commenté : « Superbe photo 👏 »", time: "hier" },
  { id: "n9", kind: "like", from: "alex.tech", text: "a aimé ta publication", time: "il y a 2 j" },
];

// Messages générés dans le chat des lives pour simuler l'activité.
export const LIVE_CHAT_POOL: { author: string; text: string }[] = [
  { author: "emma.mode", text: "Coucou tout le monde 👋" },
  { author: "alex.tech", text: "La qualité du stream 🔥" },
  { author: "nico.travel", text: "Salut depuis Bali 🌴" },
  { author: "sofia.fit", text: "Enfin le live !!" },
  { author: "tom.humour", text: "mdrrr 😂" },
  { author: "lina.art", text: "Trop fort 👏👏" },
  { author: "chef.amelie", text: "J'adore ce que tu fais ❤️" },
  { author: "maya.dance", text: "Le niveau 😍" },
  { author: "dj.karim", text: "Gros son 🎧" },
  { author: "leo_gaming", text: "GG !" },
  { author: "emma.mode", text: "Quelqu'un de Lyon ici ? 🙋" },
  { author: "alex.tech", text: "Question : tu utilises quoi comme matos ?" },
  { author: "sofia.fit", text: "Motivation à 100% 💪" },
  { author: "nico.travel", text: "Incroyable 🤩" },
  { author: "tom.humour", text: "Je reste jusqu'à la fin !" },
];

// Réponses automatiques envoyées dans les messages privés.
export const DM_REPLIES: string[] = [
  "Merci pour ton message ! 😊",
  "Haha excellent 😂",
  "Carrément d'accord avec toi !",
  "Je te réponds plus en détail ce soir 🙌",
  "Trop gentil, merci ❤️",
  "On en reparle très vite !",
  "Bien vu 👀",
  "😍😍",
];

export const TRENDING_HASHTAGS: { tag: string; views: string }[] = [
  { tag: "pourtoi", views: "128,4 Mds" },
  { tag: "danse", views: "45,2 Mds" },
  { tag: "humour", views: "38,9 Mds" },
  { tag: "cuisine", views: "22,1 Mds" },
  { tag: "voyage", views: "19,7 Mds" },
  { tag: "gaming", views: "17,3 Mds" },
  { tag: "fitness", views: "12,8 Mds" },
  { tag: "art", views: "9,4 Mds" },
];
