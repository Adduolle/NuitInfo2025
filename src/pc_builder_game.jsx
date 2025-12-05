import React, { useState, useMemo } from "react";
import Header from "./Header";

// PC Builder Game — Single-file React component (Tailwind CSS assumed available)
// Default export a React component

export default function PCBuilderGame() {
  // Objectives configuration
  const OBJECTIVES = [
    {
      id: "bureautique",
      title: "PC bureautique minimal",
      desc: "Pour lire ses mails, naviguer et regarder des photos. Priorité au silence et au budget.",
      constraints: { needGPU: false, targetBudget: 400, quiet: true },
      required: ["cpu", "motherboard", "ram", "storage", "psu", "case"],
    },
    {
      id: "gamer",
      title: "PC gamer (1080p)",
      desc: "Jeux en 1080p/1440p — GPU important, alimentation et refroidissement sérieux.",
      constraints: { needGPU: true, targetBudget: 1200, quiet: false },
      required: ["cpu", "motherboard", "ram", "storage", "psu", "case", "gpu"],
    },
    {
      id: "montage",
      title: "PC montage vidéo",
      desc: "Encodage et travail sur vidéos lourdes — beaucoup de RAM et CPU multicœur.",
      constraints: { needGPU: false, targetBudget: 1400, quiet: false },
      required: ["cpu", "motherboard", "ram", "storage", "psu", "case"],
    },
    {
      id: "mini",
      title: "Mini PC / NUC",
      desc: "Format compact — mini-ITX / low-power components.",
      constraints: { needGPU: false, targetBudget: 600, quiet: true },
      required: ["cpu", "motherboard", "ram", "storage", "psu", "case"],
    },
  ];

  // Inventory: components + intrus. Each item has: id, name, type, price, extra props
  const INVENTORY = [
    // Real components
    { id: "cpu_i3", name: "Intel Core i3 (4c)", type: "cpu", price: 95, tdp: 60 },
    { id: "cpu_i5", name: "Intel Core i5 (6c)", type: "cpu", price: 210, tdp: 95 },
    { id: "cpu_ryzen5", name: "AMD Ryzen 5 (6c)", type: "cpu", price: 180, tdp: 65 },

    { id: "mb_b560", name: "Carte mère ATX (socket LGA)", type: "motherboard", price: 110 },
    { id: "mb_b550", name: "Carte mère AM4 (mATX)", type: "motherboard", price: 120 },

    { id: "ram_8", name: "8GB DDR4", type: "ram", price: 28, size: 8 },
    { id: "ram_16", name: "16GB DDR4 (2x8GB)", type: "ram", price: 65, size: 16 },
    { id: "ram_32", name: "32GB DDR4 (2x16GB)", type: "ram", price: 130, size: 32 },

    { id: "ssd_256", name: "SSD 256GB NVMe", type: "storage", price: 35, size: 256 },
    { id: "ssd_1tb", name: "SSD 1TB NVMe", type: "storage", price: 95, size: 1000 },

    { id: "gpu_3050", name: "GPU NVIDIA RTX 3050", type: "gpu", price: 300, tdp: 130 },
    { id: "gpu_4070", name: "GPU NVIDIA RTX 4070", type: "gpu", price: 700, tdp: 200 },

    { id: "psu_450", name: "Alimentation 450W (bronze)", type: "psu", price: 50, watt: 450 },
    { id: "psu_650", name: "Alimentation 650W (gold)", type: "psu", price: 95, watt: 650 },

    { id: "case_mid", name: "Boîtier moyen tour", type: "case", price: 65 },
    { id: "case_mini", name: "Boîtier mini-ITX compact", type: "case", price: 80 },

    { id: "cooler_stock", name: "Refroidisseur CPU stock", type: "cooler", price: 10 },
    { id: "cooler_air", name: "Ventirad performant", type: "cooler", price: 45 },

    { id: "paste", name: "Pâte thermique", type: "thermal", price: 8 },

    { id: "spatula", name: "Spatule de cuisine", type: "tool", price: 6, intrus: true },
    { id: "screwdriver", name: "Tournevis cruciforme (outil)", type: "tool", price: 8 },
    { id: "car_battery", name: "Batterie de voiture", type: "tool", price: 60, intrus: true },
    { id: "toaster", name: "Grille-pain", type: "tool", price: 25, intrus: true },
    { id: "antistatic", name: "Bracelet antistatique (outil)", type: "tool", price: 7 },
    { id: "sticker", name: "Rouleau de scotch", type: "tool", price: 3, intrus: true },
    { id: "usb_key", name: "Clé USB (installation OS)", type: "tool", price: 12 },

  ];

  // Reference assembly order (logical) — steps shown only if related component selected
  const REF_STEPS = [
    { id: "prep", label: "Préparer le poste de travail" },
    { id: "install_cpu", label: "Installer le CPU sur la carte mère", needs: ["cpu"] },
    { id: "apply_paste", label: "Appliquer la pâte thermique", needs: ["cpu"] },
    { id: "install_cooler", label: "Installer le refroidissement CPU", needs: ["cooler", "cpu"] },
    { id: "install_ram", label: "Installer la RAM", needs: ["ram"] },
    { id: "mount_mobo", label: "Monter la carte mère dans le boîtier", needs: ["motherboard", "case"] },
    { id: "install_psu", label: "Installer l'alimentation", needs: ["psu", "case"] },
    { id: "install_storage", label: "Installer le SSD/HDD", needs: ["storage"] },
    { id: "install_gpu", label: "Installer la carte graphique", needs: ["gpu"] },
    { id: "cable_power", label: "Brancher les câbles d'alimentation", needs: ["psu"] },
    { id: "connect_front", label: "Brancher les câbles du boîtier (USB, power)" },
    { id: "close_case", label: "Fermer le boîtier" },
    { id: "first_boot", label: "Premier allumage (POST)" },
    { id: "install_os", label: "Installer le système d'exploitation", needs: ["tool"] },
  ];

  // State
  const [objective, setObjective] = useState(() =>
    OBJECTIVES[Math.floor(Math.random() * OBJECTIVES.length)]
  );
  const [selected, setSelected] = useState([]); // array of item ids
  const [stage, setStage] = useState("select"); // 'select' | 'order' | 'result'
  const [orderedSteps, setOrderedSteps] = useState([]);

  // Helpers
  const toggleSelect = (id) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  };

  const selectedItems = useMemo(
    () => INVENTORY.filter((it) => selected.includes(it.id)),
    [selected]
  );

  const totalPrice = useMemo(
    () => selectedItems.reduce((sum, it) => sum + (it.price || 0), 0),
    [selectedItems]
  );

  // Steps to show based on selected components
  const visibleSteps = useMemo(() => {
    const types = new Set(selectedItems.map((it) => it.type));
    return REF_STEPS.filter((step) => {
      if (!step.needs) return true;
      // show if ANY of the needs is present
      return step.needs.some((n) => types.has(n) || selectedItems.some((it) => it.type === n));
    });
  }, [selectedItems]);

  // When entering order stage, initialize orderedSteps to visibleSteps in default order
  const goToOrder = () => {
    setOrderedSteps(visibleSteps.map((s) => s.id).sort(() => Math.random() - 0.5));
    setStage("order");
  };

  // Move step up/down
  const moveStep = (index, dir) => {
    setOrderedSteps((arr) => {
      const copy = [...arr];
      const i = index;
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= copy.length) return copy;
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  // Scoring and result calculation
  const computeResult = () => {
    // Required components for objective
    const requiredTypes = objective.required || [];
    const typesPresent = new Set(selectedItems.map((it) => it.type));

    // Selection score
    let selectionScore = 0;
    let missing = [];
    requiredTypes.forEach((rt) => {
      if (typesPresent.has(rt)) {
        selectionScore += 12; // good
      } else {
        selectionScore -= 15;
        missing.push(rt);
      }
    });

    // Penalty for intrus
    const intrusCount = selectedItems.filter((it) => it.intrus).length;
    selectionScore -= intrusCount * 8;

    // Budget bonus: if within targetBudget
    if (totalPrice <= objective.constraints.targetBudget) selectionScore += 15;

    // Order score: compare orderedSteps to REF_STEPS order for visible
    const refIds = visibleSteps.map((s) => s.id);
    let orderScore = 0;
    orderedSteps.forEach((stepId, idx) => {
      const refIdx = refIds.indexOf(stepId);
      if (refIdx === -1) return;
      // reward proportional to closeness
      const distance = Math.abs(refIdx - idx);
      orderScore += Math.max(0, 6 - distance);
    });

    // Diagnostics: will it boot? will it 'burn'?
    // Check essential presence
    const missingEssentials = requiredTypes.filter((rt) => !typesPresent.has(rt));

    let diagnostic = { status: "ok", message: "Le PC semble démarrer correctement." };

    if (missingEssentials.length > 0) {
      diagnostic = {
        status: "no_boot",
        message: `Le PC ne démarre pas : composants essentiels manquants — ${missingEssentials.join(", ")}`,
      };
    }

    // Check PSU wattage vs estimated need
    const psu = selectedItems.find((it) => it.type === "psu");
    const gpu = selectedItems.find((it) => it.type === "gpu");
    const cpu = selectedItems.find((it) => it.type === "cpu");

    const requiredWatt = (gpu?.tdp || 0) + (cpu?.tdp || 0) + 100; // baseline for other components
    if (psu && psu.watt < requiredWatt) {
      diagnostic = {
        status: "burn",
        message: `Attention — votre alimentation (${psu.watt}W) est insuffisante pour la charge estimée (~${requiredWatt}W). Risque de panne ou de "grillage".`,
      };
    }

    // Score total
    const totalScore = Math.max(0, selectionScore + orderScore);

    // Compute minimal cost to satisfy objective (greedy: cheapest of each required type)
    const cheapestForType = (type) => {
      const candidates = INVENTORY.filter((it) => it.type === type && !it.intrus);
      if (!candidates || candidates.length === 0) return null;
      return candidates.reduce((a, b) => (a.price < b.price ? a : b));
    };
    let minCost = 0;
    let minMissing = [];
    requiredTypes.forEach((rt) => {
      const pick = cheapestForType(rt);
      if (pick) minCost += pick.price; else minMissing.push(rt);
    });

    const savings = minCost - totalPrice; // negative means overspent

    return {
      selectionScore,
      orderScore,
      totalScore,
      diagnostic,
      savings,
      minCost,
      totalPrice,
      missingEssentials,
    };
  };

  const result = useMemo(() => computeResult(), [selected, orderedSteps, objective]);

  const resetGame = () => {
    const next = OBJECTIVES[Math.floor(Math.random() * OBJECTIVES.length)];
    setObjective(next);
    setSelected([]);
    setStage("select");
    setOrderedSteps([]);
  };

  return (
    <>
    <Header />
    <div className="max-w-5xl mx-auto p-6 min-h-screen text-gray-200">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Construire son propre PC - Jeu pédagogique</h1>
        <p className="text-sm text-gray-300 mt-1">Objectif tiré : <span className="font-semibold">{objective.title}</span> — {objective.desc}</p>
      </header>

      {stage === "select" && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="font-semibold mb-2">1) Sélectionnez les composants et outils (attention aux intrus)</h2>
            <div className="bg-white text-gray-800 rounded-lg shadow p-4 max-h-[500px] overflow-y-auto">
              <ul className="space-y-2">
                {INVENTORY.map((it) => (
                  <li key={it.id} className="flex items-center justify-between">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(it.id)}
                        onChange={() => toggleSelect(it.id)}
                        className="w-4 h-4"
                      />
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-xs text-gray-500">Type: {it.type}{it.size ? ` • ${it.size}GB` : ""}{it.watt ? ` • ${it.watt}W` : ""}</div>
                      </div>
                    </label>
                    <div className="text-sm font-semibold">{it.price} €</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900">Panier</h3>
            <div className="mt-2 text-sm text-gray-700">
              <div>Articles sélectionnés: <span className="font-medium">{selected.length}</span></div>
              <div className="mt-2">Total estimé: <span className="font-bold">{totalPrice} €</span></div>
              <div className="mt-3">
                <button
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-60"
                  onClick={goToOrder}
                  disabled={selected.length === 0}
                >
                  Passer à l'étape d'assemblage →
                </button>
                <button className="mt-2 w-full border border-gray-200 py-2 rounded" onClick={resetGame}>Tirer un autre objectif</button>
              </div>
            </div>
          </aside>
        </section>
      )}

      {stage === "order" && (
        <section>
          <h2 className="font-semibold mb-2">2) Ordonnez les étapes d'assemblage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white text-gray-800 rounded-lg shadow p-4 max-h-[400px] overflow-y-auto">
              <p className="text-sm text-gray-600">Glissez avec les boutons ↑ ↓ pour ordonner. Seules apparaissent les étapes liées aux composants choisis.</p>
              <ol className="mt-4 space-y-2">
                {orderedSteps.map((sid, idx) => {
                  const step = REF_STEPS.find((s) => s.id === sid);
                  return (
                    <li key={sid} className="flex items-center justify-between p-2 border rounded">
                      <div className="font-medium">{step.label}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => moveStep(idx, 'up')} className="px-2 py-1 border rounded">↑</button>
                        <button onClick={() => moveStep(idx, 'down')} className="px-2 py-1 border rounded">↓</button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <aside className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900">Résumé</h3>
              <div className="mt-2 text-sm text-gray-700">
                <div>Étapes visibles: <span className="font-medium">{visibleSteps.length}</span></div>
                <div className="mt-2">Prix actuel: <span className="font-bold">{totalPrice} €</span></div>
                <div className="mt-2">Objectif budget: <span className="font-medium">{objective.constraints.targetBudget} €</span></div>
                <div className="mt-4">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded" onClick={() => setStage('result')}>Calculer le résultat →</button>
                </div>
                <div className="mt-2">
                  <button className="w-full border py-2 rounded mt-2" onClick={() => setStage('select')}>Revenir à la sélection</button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {stage === "result" && (
        <section>
          <h2 className="font-semibold mb-2">Résultat</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Diagnostic */}
            <div className="bg-white text-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold">Diagnostic</h3>
              <div className="mt-3">
                <div className={`p-3 rounded ${result.diagnostic.status === 'ok' ? 'bg-green-50' : result.diagnostic.status === 'no_boot' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                  <div className="font-medium">
                    Statut: {result.diagnostic.status === 'ok' ? 'Démarrage OK' : result.diagnostic.status === 'no_boot' ? 'Ne démarre pas' : 'Risque de panne / brûle'}
                  </div>
                  <div className="text-sm text-gray-700 mt-2">{result.diagnostic.message}</div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium">Score</h4>
                  <div className="mt-2">Sélection: <span className="font-bold">{result.selectionScore}</span></div>
                  <div>Ordre: <span className="font-bold">{result.orderScore}</span></div>
                  <div className="mt-1">Score total: <span className="text-xl font-extrabold">{result.totalScore}</span></div>
                </div>
              </div>
            </div>

            {/* Correctif & finances */}
            <div className="bg-white text-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold">Correctif & finances</h3>
              <div className="mt-3 text-sm text-gray-700">
                <div>Coût minimal estimé pour l'objectif: <span className="font-bold">{result.minCost} €</span></div>
                <div>Votre coût: <span className="font-bold">{result.totalPrice} €</span></div>
                <div className={`mt-2 ${result.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>Économie potentielle: <span className="font-semibold">{Math.abs(result.savings)} €</span> {result.savings >=0 ? ' (vous avez dépensé moins que le coût minimal estimé)' : ' (vous avez dépensé plus que le coût minimal estimé)'}</div>
                
                <div className="mt-4">
                  <h4 className="font-medium">Suggestions</h4>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {selectedItems.filter(it => it.intrus).length > 0 ? (
                      <li>Retirer les éléments intrus sélectionnés pour gagner des points et de l'argent.</li>
                    ) : <li>Aucun intrus détecté — bien joué !</li>}
                    {result.missingEssentials.length > 0 ? (
                      <li>Ajouter les composants manquants:<br/>{result.missingEssentials.map(m => (<span key={m}>{m}<br/></span>))}</li>
                    ) : (
                      <li>Tous les composants essentiels sont présents.</li>
                    )}
                    {result.diagnostic.status === 'burn' && (
                      <li>Choisir une alimentation avec plus de watts (ex: 650W) pour éviter la surcharge.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Image PC */}
            <div className="bg-white text-gray-800 rounded-lg shadow p-4 flex items-center justify-center">
              {result.diagnostic.status === 'ok' && (<img src="./src/assets/working_pc.png" alt="PC OK" className="h-[400px] rounded"/>)}
              {result.diagnostic.status === 'burn' && (<img src="./src/assets/burning_pc.png" alt="PC burn" className="h-[400px] rounded"/>)}
              {result.diagnostic.status === 'no_boot' && (<img src="./src/assets/sleeping_pc.png" alt="PC no boot" className="h-[400px] rounded"/>)}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded" onClick={resetGame}>Rejouer (nouvel objectif)</button>
            <button className="flex-1 border py-2 rounded" onClick={() => { setStage('select'); }}>Modifier la sélection</button>
          </div>

          <div className="mt-6 text-xs text-gray-500">Note: Les prix et puissances sont indicatifs et simplifiés pour le jeu. Le but est pédagogique — expliquer les principes (compatibilité, alimentation, ordre d'assemblage).</div>
        </section>
      )}

      <footer className="mt-8 text-sm text-gray-600">Made for pedagogical use</footer>
    </div>
    </>
  );
}
