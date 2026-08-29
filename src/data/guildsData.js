// College Clans & Neighborhood Guilds Dataset
export const INITIAL_GUILDS = [
  {
    id: "guild-iitd",
    name: "IIT Delhi Eco-Warriors",
    type: "College Campus",
    city: "New Delhi",
    avatar: "🏛️",
    badge: "Champion Clan",
    membersCount: 42,
    treesTracked: 64,
    survivalRate: 92,
    totalCo2Kg: 520.4,
    squadXp: 8450,
    rank: 1,
    leader: "Ayush Khatai",
    motto: "Green Engineering for a Cooler Capital",
    accentColor: "#10b981"
  },
  {
    id: "guild-bits",
    name: "BITS Pilani Desert Bloomers",
    type: "College Campus",
    city: "Pilani, Rajasthan",
    avatar: "🏜️",
    badge: "Drought Champions",
    membersCount: 36,
    treesTracked: 51,
    survivalRate: 88,
    totalCo2Kg: 410.2,
    squadXp: 7120,
    rank: 2,
    leader: "Rohan Verma",
    motto: "Transforming Arid Lands into Green Canopies",
    accentColor: "#06b6d4"
  },
  {
    id: "guild-iitb",
    name: "IIT Bombay Lakeside Foresters",
    type: "College Campus",
    city: "Mumbai, Maharashtra",
    avatar: "🌲",
    badge: "Bio-Diversity Guild",
    membersCount: 29,
    treesTracked: 45,
    survivalRate: 94,
    totalCo2Kg: 380.0,
    squadXp: 6890,
    rank: 3,
    leader: "Ananya Deshmukh",
    motto: "Powai Lake Canopy Protection Force",
    accentColor: "#14b8a6"
  },
  {
    id: "guild-blr",
    name: "Indiranagar Green Canopy",
    type: "Neighborhood Colony",
    city: "Bengaluru, Karnataka",
    avatar: "🏡",
    badge: "Urban Stewards",
    membersCount: 24,
    treesTracked: 38,
    survivalRate: 85,
    totalCo2Kg: 295.5,
    squadXp: 5400,
    rank: 4,
    leader: "Priya Sundaram",
    motto: "Every Street A Shaded Corridor",
    accentColor: "#f59e0b"
  },
  {
    id: "guild-du",
    name: "Delhi University Botanical Club",
    type: "College Campus",
    city: "New Delhi",
    avatar: "🌺",
    badge: "Rising Contender",
    membersCount: 18,
    treesTracked: 28,
    survivalRate: 82,
    totalCo2Kg: 210.8,
    squadXp: 4150,
    rank: 5,
    leader: "Vikram Sengupta",
    motto: "Preserving Native Heritage Species",
    accentColor: "#8b5cf6"
  }
];

export const INITIAL_QUESTS = [
  {
    id: "quest-sprint-1",
    title: "Inter-College Green Sprint",
    category: "Campus Challenge",
    description: "Plant & verify 50 native saplings on campus ground or urban greenways within 14 days.",
    target: 50,
    currentProgress: 38,
    unit: "Trees Planted",
    rewardXp: 500,
    badgeReward: "Green Sprint Victor",
    daysLeft: 4,
    icon: "Trophy",
    accent: "text-amber-400 border-amber-500/30 bg-amber-500/10"
  },
  {
    id: "quest-hydration-7",
    title: "7-Day Zero-Drought Streak",
    category: "Survival Quest",
    description: "Log active watering check-ins for all trees in your squad to maintain 100% hydration status.",
    target: 7,
    currentProgress: 5,
    unit: "Days in Streak",
    rewardXp: 350,
    badgeReward: "Hydration Master",
    daysLeft: 2,
    icon: "Droplets",
    accent: "text-blue-400 border-blue-500/30 bg-blue-500/10"
  },
  {
    id: "quest-ai-scout",
    title: "AI Diagnostic Scout Patrol",
    category: "Health Verification",
    description: "Conduct 10 AI camera health checks across neighborhood trees to detect early chlorosis/pests.",
    target: 10,
    currentProgress: 7,
    unit: "AI Scans Completed",
    rewardXp: 400,
    badgeReward: "Botanical Scout",
    daysLeft: 6,
    icon: "Sparkles",
    accent: "text-purple-400 border-purple-500/30 bg-purple-500/10"
  }
];

const GUILD_STORAGE_KEY = 'greentrack_guilds_v1';
const USER_GUILD_KEY = 'greentrack_active_user_guild';

export function loadGuilds() {
  try {
    const raw = localStorage.getItem(GUILD_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveGuilds(INITIAL_GUILDS);
  return INITIAL_GUILDS;
}

export function saveGuilds(guilds) {
  try {
    localStorage.setItem(GUILD_STORAGE_KEY, JSON.stringify(guilds));
  } catch (e) {}
}

export function getUserGuild() {
  return localStorage.getItem(USER_GUILD_KEY) || 'guild-iitd';
}

export function setUserGuild(guildId) {
  localStorage.setItem(USER_GUILD_KEY, guildId);
}

export function addXpToGuild(guildId, xpAmount) {
  const guilds = loadGuilds();
  const guild = guilds.find(g => g.id === guildId);
  if (guild) {
    guild.squadXp += xpAmount;
    guilds.sort((a, b) => b.squadXp - a.squadXp);
    guilds.forEach((g, idx) => g.rank = idx + 1);
    saveGuilds(guilds);
    return guild;
  }
  return null;
}
