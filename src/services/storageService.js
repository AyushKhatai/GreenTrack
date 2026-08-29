// Persistent Storage & Data Management Service
import { INITIAL_TREES } from '../data/initialTrees';

const STORAGE_KEY = 'greentrack_trees_v2';
const USER_PROFILE_KEY = 'greentrack_user_profile_v2';

/**
 * Loads all trees from LocalStorage or seeds with rich initial records
 */
export function loadTrees() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load trees from storage:", e);
  }
  // Initialize with pre-seeded data
  saveTrees(INITIAL_TREES);
  return INITIAL_TREES;
}

/**
 * Saves trees to LocalStorage
 */
export function saveTrees(trees) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
  } catch (e) {
    console.error("Failed to save trees to storage:", e);
  }
}

/**
 * Adds a new tree record
 */
export function addTree(newTreeData) {
  const trees = loadTrees();
  const tree = {
    id: `gt-${Date.now()}`,
    qrCodeToken: `GT-TREE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    datePlanted: new Date().toISOString(),
    status: "Healthy",
    healthScore: 95,
    co2OffsetKg: 0,
    history: [
      {
        id: `ev-${Date.now()}`,
        date: new Date().toISOString(),
        type: "Plantation",
        title: "Tree Planted & Registered",
        note: `Registered at ${newTreeData.address || "GPS Coordinates"} by ${newTreeData.planter || "Eco Guardian"}.`,
        icon: "Sprout",
        health: "Healthy",
        author: newTreeData.planter || "Eco Guardian",
        aiVerified: false
      }
    ],
    ...newTreeData
  };

  trees.unshift(tree);
  saveTrees(trees);
  return tree;
}

/**
 * Updates an existing tree
 */
export function updateTree(treeId, updates) {
  const trees = loadTrees();
  const index = trees.findIndex(t => t.id === treeId);
  if (index !== -1) {
    trees[index] = { ...trees[index], ...updates };
    saveTrees(trees);
    return trees[index];
  }
  return null;
}

/**
 * Adds a timeline event / log (e.g. AI Scan, Watering, Pruning)
 */
export function addTreeEvent(treeId, eventData) {
  const trees = loadTrees();
  const tree = trees.find(t => t.id === treeId);
  if (tree) {
    const newEvent = {
      id: `ev-${Date.now()}`,
      date: new Date().toISOString(),
      ...eventData
    };
    tree.history = tree.history || [];
    tree.history.push(newEvent);

    if (eventData.health) {
      tree.status = eventData.health;
    }
    if (eventData.healthScore !== undefined) {
      tree.healthScore = eventData.healthScore;
    }
    if (eventData.type === "Watering") {
      tree.lastWatered = new Date().toISOString();
    }

    saveTrees(trees);
    return tree;
  }
  return null;
}

/**
 * Deletes a tree record
 */
export function deleteTree(treeId) {
  const trees = loadTrees().filter(t => t.id !== treeId);
  saveTrees(trees);
  return trees;
}

/**
 * Resets storage back to initial pre-seeded state
 */
export function resetToDemoData() {
  saveTrees(INITIAL_TREES);
  return INITIAL_TREES;
}

/**
 * Exports data as downloadable JSON
 */
export function exportDataAsJSON() {
  const trees = loadTrees();
  const blob = new Blob([JSON.stringify(trees, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `GreenTrack_Export_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Exports data as downloadable CSV
 */
export function exportDataAsCSV() {
  const trees = loadTrees();
  const headers = ["ID", "Name", "Species", "Planter", "Status", "HealthScore", "Lat", "Lng", "Address", "DatePlanted", "CO2_Kg"];
  const rows = trees.map(t => [
    t.id,
    `"${(t.name || "").replace(/"/g, '""')}"`,
    `"${(t.speciesName || "").replace(/"/g, '""')}"`,
    `"${(t.planter || "").replace(/"/g, '""')}"`,
    t.status,
    t.healthScore || 90,
    t.lat,
    t.lng,
    `"${(t.address || "").replace(/"/g, '""')}"`,
    t.datePlanted,
    t.co2OffsetKg || 0
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const a = document.createElement("a");
  a.href = encodedUri;
  a.download = `GreenTrack_Trees_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
}
