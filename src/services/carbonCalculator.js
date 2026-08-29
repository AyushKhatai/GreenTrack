// Scientific Environmental Impact & Carbon Sequestration Engine
import { PLANT_DATABASE } from '../data/plantDatabase';

/**
 * Calculates environmental impact metrics for a single tree
 * Based on species annual baseline, tree age (years), height (m), and canopy diameter (m).
 */
export function calculateTreeImpact(tree) {
  const species = PLANT_DATABASE.find(p => p.id === tree.speciesId) || {
    co2Absorption: 20.0,
    matureHeight: "15 meters"
  };

  const plantedDate = new Date(tree.datePlanted || Date.now());
  const now = new Date();
  const ageYears = Math.max(0.1, (now - plantedDate) / (1000 * 60 * 60 * 24 * 365.25));

  // Growth maturity factor (S-curve sigmoid growth model)
  const maturityFactor = Math.min(1.2, Math.max(0.2, (ageYears / 5) * (tree.heightMeters ? (tree.heightMeters / 4) : 1)));

  // Annual CO2 sequestered by this tree
  const annualCo2Kg = +(species.co2Absorption * maturityFactor).toFixed(2);
  
  // Cumulative CO2 sequestered over tree lifetime since planting
  const cumulativeCo2Kg = +(annualCo2Kg * ageYears + (tree.co2OffsetKg || 0) * 0.1).toFixed(2);

  // Oxygen output (approx 1.07 kg O2 per 1 kg CO2 sequestered via photosynthesis stoichiometry)
  const annualO2Kg = +(annualCo2Kg * 1.07).toFixed(2);

  // Stormwater runoff absorbed (gallons/yr, proportional to canopy area = pi * r^2)
  const canopyRadius = (tree.canopyDiameterMeters || 1.5) / 2;
  const canopyAreaSqM = Math.PI * Math.pow(canopyRadius, 2);
  const annualStormwaterGallons = Math.round(canopyAreaSqM * 180);

  return {
    annualCo2Kg,
    cumulativeCo2Kg,
    annualO2Kg,
    annualStormwaterGallons,
    ageYears: +ageYears.toFixed(1),
    // Real world Equivalencies:
    carKmOffset: Math.round(cumulativeCo2Kg / 0.12), // ~120g CO2 per car km
    smartphoneCharges: Math.round(cumulativeCo2Kg / 0.008), // ~8g CO2 per full phone charge
    flightHoursOffset: +(cumulativeCo2Kg / 90).toFixed(1), // ~90kg CO2 per passenger hour flight
    treesPlantedEquivalent: 1
  };
}

/**
 * Calculates global aggregate metrics across all active trees
 */
export function calculateAggregateImpact(trees = []) {
  const totalTrees = trees.length;
  if (totalTrees === 0) {
    return {
      totalTrees: 0,
      survivalRate: 0,
      healthyCount: 0,
      attentionCount: 0,
      criticalCount: 0,
      totalCo2Kg: 0,
      totalO2Kg: 0,
      totalStormwaterGal: 0,
      carKmOffset: 0,
      guardiansCount: 0,
      healthDistribution: [0, 0, 0]
    };
  }

  let totalCo2 = 0;
  let totalO2 = 0;
  let totalStormwater = 0;
  let healthyCount = 0;
  let attentionCount = 0;
  let criticalCount = 0;
  const uniquePlanters = new Set();

  trees.forEach(tree => {
    const impact = calculateTreeImpact(tree);
    totalCo2 += impact.cumulativeCo2Kg;
    totalO2 += impact.annualO2Kg;
    totalStormwater += impact.annualStormwaterGallons;

    if (tree.status === "Healthy") healthyCount++;
    else if (tree.status === "Needs Attention") attentionCount++;
    else criticalCount++;

    if (tree.planter) uniquePlanters.add(tree.planter.trim().toLowerCase());
  });

  const survivalRate = Math.round(((healthyCount + attentionCount * 0.7) / totalTrees) * 100);

  return {
    totalTrees,
    survivalRate,
    healthyCount,
    attentionCount,
    criticalCount,
    totalCo2Kg: +totalCo2.toFixed(1),
    totalO2Kg: +totalO2.toFixed(1),
    totalStormwaterGal: totalStormwater,
    carKmOffset: Math.round(totalCo2 / 0.12),
    guardiansCount: Math.max(uniquePlanters.size, 1),
    healthDistribution: [healthyCount, attentionCount, criticalCount]
  };
}
