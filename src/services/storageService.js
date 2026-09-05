// Persistent Storage & Cloud Supabase Data Management Service
import { INITIAL_TREES } from '../data/initialTrees';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { notifyError, notifyWarning } from '../components/ui';

const STORAGE_KEY = 'greentrack_trees_v2';
const USER_PROFILE_KEY = 'greentrack_user_profile_v2';

/**
 * Loads all trees from LocalStorage or seeds with initial records
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
    notifyError("Couldn't read trees from storage — using the demo dataset.", 'Local cache unavailable');
    console.error("Failed to load trees from storage:", e);
  }
  // Initialize with pre-seeded data
  saveTrees(INITIAL_TREES);
  return INITIAL_TREES;
}

/**
 * Saves trees to LocalStorage cache
 */
export function saveTrees(trees) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trees));
  } catch (e) {
    notifyError("Couldn't write to local storage. Your latest changes may not persist.", 'Save failed');
    console.error("Failed to save trees to storage:", e);
  }
}

/**
 * Asynchronously syncs live trees from Supabase Cloud PostgreSQL
 */
export async function syncTreesFromCloud() {
  if (!isSupabaseConfigured || !supabase) return loadTrees();

  try {
    const { data, error } = await supabase
      .from('trees')
      .select('*, tree_events(*)')
      .order('created_at', { ascending: false });

    if (error) {
      notifyWarning("Cloud sync unavailable — using your local cache.", 'Working offline');
      console.warn("Supabase fetch error, using local cache:", error.message);
      return loadTrees();
    }

    if (data && data.length > 0) {
      const formatted = data.map(row => ({
        id: row.id,
        name: row.name,
        speciesId: row.species_id,
        speciesName: row.species_name,
        scientificName: row.scientific_name,
        category: row.category,
        datePlanted: row.date_planted,
        planter: row.planter_name || "Eco Guardian",
        address: row.address,
        lat: Number(row.latitude),
        lng: Number(row.longitude),
        heightMeters: Number(row.height_meters || 1.0),
        canopyDiameterMeters: Number(row.canopy_diameter_meters || 0.5),
        healthScore: Number(row.health_score || 90),
        status: row.status || "Healthy",
        co2OffsetKg: Number(row.co2_offset_kg || 0),
        qrCodeToken: row.token_id,
        history: row.tree_events?.map(ev => ({
          id: ev.id,
          date: ev.logged_at,
          type: ev.event_type,
          title: ev.title,
          note: ev.note,
          health: ev.health_status,
          healthScore: ev.health_score,
          author: ev.author || "Planter",
          aiVerified: ev.ai_verified
        })) || []
      }));

      saveTrees(formatted);
      return formatted;
    }
  } catch (err) {
    notifyWarning("Cloud sync unavailable — using your local cache.", 'Working offline');
    console.error("Supabase sync error:", err);
  }

  return loadTrees();
}

/**
 * Adds a new tree record and pushes to Supabase Cloud if configured
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

  // Cloud sync if Supabase is active
  if (isSupabaseConfigured && supabase) {
    supabase
      .from('trees')
      .insert({
        token_id: tree.qrCodeToken,
        name: tree.name,
        species_id: tree.speciesId,
        species_name: tree.speciesName,
        scientific_name: tree.scientificName,
        category: tree.category,
        date_planted: tree.datePlanted,
        address: tree.address,
        latitude: tree.lat,
        longitude: tree.lng,
        height_meters: tree.heightMeters || 1.0,
        canopy_diameter_meters: tree.canopyDiameterMeters || 0.5,
        health_score: tree.healthScore || 95,
        status: tree.status || "Healthy",
        co2_offset_kg: tree.co2OffsetKg || 0
      })
      .then(({ error }) => {
        if (error) console.error("Cloud insert error:", error);
      });
  }

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

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('trees')
        .update({
          name: updates.name,
          health_score: updates.healthScore,
          status: updates.status,
          co2_offset_kg: updates.co2OffsetKg
        })
        .eq('token_id', trees[index].qrCodeToken)
        .then(({ error }) => {
          if (error) console.error("Cloud update error:", error);
        });
    }

    return trees[index];
  }
  return null;
}

/**
 * Adds an event / audit log to a specific tree
 */
export function addTreeEvent(treeId, eventData) {
  const trees = loadTrees();
  const tree = trees.find(t => t.id === treeId);
  if (!tree) return null;

  const newEvent = {
    id: `ev-${Date.now()}`,
    date: new Date().toISOString(),
    author: "Eco Guardian",
    aiVerified: false,
    ...eventData
  };

  if (!tree.history) tree.history = [];
  tree.history.unshift(newEvent);

  if (eventData.health) {
    tree.status = eventData.health;
  }
  if (eventData.healthScore) {
    tree.healthScore = eventData.healthScore;
  }

  saveTrees(trees);

  if (isSupabaseConfigured && supabase) {
    supabase
      .from('tree_events')
      .insert({
        event_type: newEvent.type,
        title: newEvent.title,
        note: newEvent.note,
        health_status: newEvent.health,
        health_score: newEvent.healthScore || null,
        ai_verified: Boolean(newEvent.aiVerified)
      })
      .then(({ error }) => {
        if (error) console.error("Cloud event insert error:", error);
      });
  }

  return newEvent;
}

/**
 * Deletes a tree record
 */
export function deleteTree(treeId) {
  const trees = loadTrees();
  const filtered = trees.filter(t => t.id !== treeId);
  saveTrees(filtered);
  return filtered;
}

/**
 * Resets local database to pre-seeded demo records
 */
export function resetToDemoData() {
  saveTrees(INITIAL_TREES);
  return INITIAL_TREES;
}

/**
 * Exports data as CSV string and triggers browser download
 */
export function exportDataAsCSV() {
  const trees = loadTrees();
  const headers = ["ID", "Token", "Name", "Species", "Category", "Date Planted", "Planter", "Address", "Latitude", "Longitude", "Health Status", "Health Score", "CO2 Offset (kg)"];
  const rows = trees.map(t => [
    `"${t.id}"`,
    `"${t.qrCodeToken}"`,
    `"${t.name}"`,
    `"${t.speciesName}"`,
    `"${t.category}"`,
    `"${t.datePlanted}"`,
    `"${t.planter}"`,
    `"${t.address.replace(/"/g, '""')}"`,
    t.lat,
    t.lng,
    `"${t.status}"`,
    t.healthScore || 0,
    t.co2OffsetKg || 0
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `greentrack_trees_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports data as JSON and triggers browser download
 */
export function exportDataAsJSON() {
  const trees = loadTrees();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trees, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", dataStr);
  link.setAttribute("download", `greentrack_trees_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
