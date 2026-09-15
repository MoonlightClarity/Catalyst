import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { catalystTestCompilerOptions } from "./test-compiler.mjs";

const nodeRequire = createRequire(import.meta.url);
const ts = nodeRequire("@typescript/typescript6");
const root = process.cwd();
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "catalyst-techniques-"));
const source = (name) => path.join(root, "src/domain", name);

try {
  const program = ts.createProgram({
    rootNames: [
      source("types.ts"), source("techniques.ts"), source("techniqueFamilies.ts"),
      source("techniquesExtended.ts"), source("techniquesInterdisciplinary.ts"),
      source("techniquesHumanities.ts"), source("techniquesCatalog.ts"),
      source("techniquesCatalogWorkflows.ts"), source("techniquesCatalogWorkflowsAdvanced.ts"), source("techniqueCatalogMetadata.ts"),
    ],
    options: catalystTestCompilerOptions(ts, outDir),
  });
  const emit = program.emit();
  const errors = ts.getPreEmitDiagnostics(program).concat(emit.diagnostics)
    .filter((item) => item.category === ts.DiagnosticCategory.Error);
  for (const error of errors) console.error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
  assert.equal(errors.length, 0, "technique catalog modules must compile cleanly");
  const techniques = nodeRequire(path.join(outDir, "techniques.js"));
  const families = nodeRequire(path.join(outDir, "techniqueFamilies.js"));
  const catalog = nodeRequire(path.join(outDir, "techniquesCatalog.js"));
  const workflows = nodeRequire(path.join(outDir, "techniquesCatalogWorkflows.js"));
  const metadata = nodeRequire(path.join(outDir, "techniqueCatalogMetadata.js"));
  const definitions = techniques.BUILT_IN_TECHNIQUES;
  assert.equal(definitions.length, 581, "frozen SAT baseline must contain exactly 581 built-in techniques; change deliberately with a catalog migration");

  const normalizedName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  assert.equal(new Set(definitions.map((item) => item.id)).size, definitions.length, "built-in technique IDs must be unique");
  assert.equal(new Set(definitions.map((item) => normalizedName(item.name))).size, definitions.length, "built-in technique names must be unique after normalization");

  for (const definition of definitions) {
    assert.ok(definition.name.trim(), "every technique needs a name");
    assert.ok(definition.summary.trim(), `${definition.name} needs a summary`);
    assert.ok(definition.steps.length >= 4, `${definition.name} needs a substantive guided workflow`);
    assert.equal(new Set(definition.steps.map((step) => step.id)).size, definition.steps.length, `${definition.name} has duplicate step IDs`);
    assert.notEqual(families.techniqueFamily(definition), "custom", `${definition.name} is built-in and cannot resolve to custom`);
  }

  const clusters = new Set(definitions.map((item) => families.techniqueCluster(item)));
  assert.equal(clusters.size, 27, "frozen SAT taxonomy must contain exactly 27 clusters; change deliberately with a catalog migration");
  for (const clusterName of ["Uncertainty, utility & options", "System dynamics & complexity", "Risk, hazard & resilience"]) {
    const cluster = catalog.CATALOG_CLUSTERS.find((item) => item.cluster === clusterName);
    assert.ok(cluster, `broad cluster metadata must resolve: ${clusterName}`);
    assert.ok(cluster.focusAreas?.length >= 3, `${clusterName} needs internal focus areas before taxonomy freeze`);
  }
  const liveCatalogDefinitions = definitions.filter((item) => item.id.startsWith("builtin:catalog-"));
  assert.ok(liveCatalogDefinitions.every((item) => workflows.hasSpecificCatalogWorkflow(item.name)), "every live catalog technique needs a method-specific workflow");
  assert.equal(workflows.SPECIFIC_CATALOG_WORKFLOW_COUNT, 486, "frozen SAT workflow baseline must remain at 486 until a deliberate catalog migration");

  assert.deepEqual(metadata.techniqueCatalogReferenceIssues(), [], "catalog navigation metadata may not reference missing techniques");

  const byName = new Map(definitions.map((item) => [item.name, item]));
  assert.equal(families.techniqueCluster(byName.get("Key Assumptions Check")), "Foundational methods", "legacy built-ins should use an analyst-facing foundational cluster label");
  const semanticAliases = Object.entries(metadata.RETIRED_TECHNIQUE_ALIASES);
  assert.ok(semanticAliases.length >= 10, "semantic consolidation registry should preserve retired catalog terminology");
  for (const [retired, canonical] of semanticAliases) {
    assert.equal(byName.has(retired), false, `${retired} should not survive as a separate live method`);
    assert.equal(workflows.hasSpecificCatalogWorkflow(retired), false, `${retired} should not survive as a separate workflow key`);
    const canonicalDefinition = byName.get(canonical);
    assert.ok(canonicalDefinition, `canonical method must remain available: ${canonical}`);
    assert.ok(metadata.techniqueCatalogMetadata(canonicalDefinition).aliases.includes(retired), `${retired} should remain a searchable alias of ${canonical}`);
  }
  const liveNameByNormalized = new Map(definitions.map((item) => [normalizedName(item.name), item.name]));
  for (const definition of definitions) {
    for (const alias of metadata.techniqueCatalogMetadata(definition).aliases) {
      const collision = liveNameByNormalized.get(normalizedName(alias));
      assert.ok(!collision || collision === definition.name, `${definition.name} alias collides with different live method: ${alias} -> ${collision}`);
    }
  }
  const workflowFingerprints = new Map();
  for (const definition of liveCatalogDefinitions) {
    for (const title of definition.steps.slice(0, 2).map((item) => item.title)) {
      assert.ok(definition.summary.includes(title), `${definition.name} summary must expose its actual workflow rather than cluster boilerplate`);
    }
    const fingerprint = JSON.stringify(definition.steps.map(({ title, prompt, responseKind }) => ({ title, prompt, responseKind })));
    assert.equal(workflowFingerprints.has(fingerprint), false, `${definition.name} duplicates the workflow of ${workflowFingerprints.get(fingerprint)}`);
    workflowFingerprints.set(fingerprint, definition.name);
  }
  assert.equal(byName.get("Backcasting")?.steps[0]?.title, "Desired or assumed future");
  assert.equal(byName.get("MITRE ATT&CK Mapping")?.steps[0]?.title, "Observed activity");
  assert.equal(byName.get("Systematic Review")?.steps[0]?.title, "Review question");
  assert.equal(byName.get("Thematic Analysis")?.steps[0]?.title, "Corpus and question");
  assert.equal(byName.get("TOPSIS")?.steps[0]?.title, "Decision matrix");
  assert.equal(byName.get("Queueing Analysis")?.steps[0]?.title, "Queueing system");
  assert.equal(workflows.hasSpecificCatalogWorkflow("TOPSIS"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Trend Analysis"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Mirror-Imaging Check"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Dissent Capture"), true);
  assert.equal(byName.get("Information Credibility Assessment")?.steps[0]?.title, "Information item");
  assert.equal(byName.get("Source Validation Matrix")?.steps[0]?.title, "Claims and sources");
  assert.equal(byName.get("Null Hypothesis Challenge")?.steps[0]?.title, "Favored claim");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Anomaly Resolution Matrix"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Customer Checklist"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Process Mapping"), true);
  assert.equal(byName.get("Customer Checklist")?.steps[0]?.title, "Customer and decision");
  assert.equal(byName.get("Process Mapping")?.steps[0]?.title, "Process scope");
  assert.equal(byName.get("Steelmanning")?.steps[0]?.title, "Opposing position");
  assert.equal(byName.get("Precommitment Review")?.steps[0]?.title, "Current judgment or plan");
  assert.equal(byName.get("Efficiency Imperative Audit")?.steps[0]?.title, "System and stated purpose");
  assert.equal(byName.get("Fragility / Antifragility Stress Test")?.steps[0]?.title, "Exposure and objective");
  assert.equal(byName.get("Commons Governance Design Audit")?.steps[0]?.title, "Resource and boundaries");
  assert.equal(byName.get("Viable System Model Diagnosis")?.steps[0]?.title, "System identity and recursion");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Fat-Tail Exposure Audit"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Strategic Commitment Analysis"), true);
  assert.equal(metadata.techniqueCatalogMetadata(byName.get("Efficiency Imperative Audit")).aliases.includes("Ellul Technique Audit"), true);
  assert.equal(metadata.techniqueCatalogMetadata(byName.get("Barbell Exposure Analysis")).aliases.includes("Barbell Strategy Analysis"), true);
  assert.equal(metadata.techniqueCatalogMetadata(byName.get("Commons Governance Design Audit")).aliases.includes("Ostrom Design Principles Audit"), true);
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Fragility / Antifragility Stress Test")).references.length > 0, "Taleb-derived methods need provenance");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Focal-Point Coordination Analysis")).references.length > 0, "Schelling-derived methods need provenance");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Requisite Variety Analysis")).references.length > 0, "Ashby-derived methods need provenance");
  assert.equal(byName.get("OODA Decision-Cycle Analysis")?.steps[2]?.title, "Orientation");
  assert.equal(byName.get("Bounded Rationality / Satisficing Audit")?.steps[3]?.title, "Stopping rule");
  assert.equal(byName.get("Recognition-Primed Decision Audit")?.steps[2]?.title, "Mental simulation");
  assert.equal(byName.get("Interactive Complexity / Tight-Coupling Audit")?.steps[1]?.title, "Interactive complexity");
  assert.equal(byName.get("Legibility / Local-Knowledge Audit")?.steps[3]?.title, "Practical knowledge");
  assert.equal(byName.get("Exit–Voice–Loyalty Analysis")?.steps[1]?.title, "Exit options");
  assert.equal(byName.get("Goodhart–Campbell Metric Gaming Audit")?.steps[2]?.title, "Gaming and distortion pathways");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("OODA Decision-Cycle Analysis")).references.length > 0, "Boyd-derived method needs provenance");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Bounded Rationality / Satisficing Audit")).references.length > 0, "Simon-derived method needs provenance");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Recognition-Primed Decision Audit")).references.length > 0, "Klein-derived method needs provenance");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Interactive Complexity / Tight-Coupling Audit")).references.length > 0, "Perrow-derived method needs provenance");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Legibility / Local-Knowledge Audit")).references.length > 0, "Scott-derived method needs provenance");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Exit–Voice–Loyalty Analysis")).references.length > 0, "Hirschman-derived method needs provenance");
  assert.ok(metadata.techniqueCatalogMetadata(byName.get("Goodhart–Campbell Metric Gaming Audit")).references.length > 0, "Goodhart/Campbell-derived method needs provenance");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Groupthink Check"), true);
  assert.equal(byName.get("Backdoor Criterion Review")?.steps[0]?.title, "Causal effect");
  assert.equal(byName.get("Instrumental Variables")?.steps[0]?.title, "Candidate instrument");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Contribution Analysis"), true);
  assert.equal(byName.get("Environmental Scanning")?.steps[0]?.title, "Scan scope");
  assert.equal(byName.get("Scenario Discovery")?.steps[0]?.title, "Decision model");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Signpost-to-Scenario Mapping"), true);
  assert.equal(byName.get("Cooke's Classical Model")?.steps[0]?.title, "Target and seed questions");
  assert.equal(byName.get("Nominal Group Technique")?.steps[0]?.title, "Problem or decision");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Real-Time Delphi"), true);
  assert.equal(byName.get("ELECTRE")?.steps[0]?.title, "Alternatives and criteria");
  assert.equal(byName.get("Expected Utility Analysis")?.steps[0]?.title, "Options and uncertain outcomes");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Info-Gap Decision Theory"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Pairwise Comparison Matrix"), true);
  assert.equal(byName.get("LINDDUN Privacy Threat Modeling")?.steps[0]?.title, "System and privacy scope");
  assert.equal(byName.get("Timeline Forensics")?.steps[0]?.title, "Evidence scope");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Hypothesis-Driven Investigation"), true);
  assert.equal(byName.get("Risk Matrix Analysis")?.steps[0]?.title, "Hazard and effect");
  assert.equal(byName.get("AcciMap")?.steps[0]?.title, "Accident or loss");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Tripod Beta"), true);
  assert.equal(byName.get("Hazard and Operability Study")?.steps[0]?.title, "Node and design intent");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Hazard and Operability Study"), true);
  assert.equal(byName.get("System Dynamics Simulation Design")?.steps[0]?.title, "Dynamic question");
  assert.equal(byName.get("Betweenness Centrality Review")?.steps[0]?.title, "Network definition");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Structural Hole Analysis"), true);
  assert.equal(byName.get("Scoping Review")?.steps[0]?.title, "Review scope");
  assert.equal(byName.get("Grounded Theory Coding")?.steps[0]?.title, "Phenomenon");
  assert.equal(byName.get("Logistic Regression")?.steps[0]?.title, "Binary outcome");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Snowball Search Strategy"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Directed Content Analysis"), true);
  assert.equal(workflows.hasSpecificCatalogWorkflow("Statistical Power Analysis"), true);
  assert.equal(byName.get("DMADV")?.steps[0]?.title, "Define need");
  assert.equal(byName.get("Policy Options Appraisal")?.steps[0]?.title, "Policy problem");
  assert.equal(byName.get("Moran's I Analysis")?.steps[0]?.title, "Variable and geography");
  assert.equal(byName.get("Integer Programming")?.steps[0]?.title, "Objective");
  assert.equal(byName.get("Persona Analysis")?.steps[0]?.title, "Evidence base");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Kano Analysis"), true);

  assert.equal(byName.get("Corpus Linguistics Analysis")?.steps[0]?.title, "Corpus question");
  assert.equal(byName.get("Historical Method")?.steps[0]?.title, "Historical question");
  assert.equal(workflows.hasSpecificCatalogWorkflow("Cognitive Science of Religion Analysis"), true);
  const achMetadata = metadata.techniqueCatalogMetadata(byName.get("Analysis of Competing Hypotheses (ACH)"));
  assert.ok(achMetadata.aliases.includes("ACH"));
  assert.ok(metadata.techniqueSearchText(byName.get("Principal Component Analysis")).toLowerCase().includes("pca"));
  assert.ok(definitions.every((definition) => metadata.techniqueCatalogMetadata(definition).outputs.length >= 1));
  const attckMetadata = metadata.techniqueCatalogMetadata(byName.get("MITRE ATT&CK Mapping"));
  assert.ok(attckMetadata.useBefore.includes("Incident Reconstruction"));
  assert.ok(attckMetadata.alternatives.includes("Diamond Model Analysis"));
  assert.equal(attckMetadata.references[0]?.href, "https://attack.mitre.org/");
  const reviewMetadata = metadata.techniqueCatalogMetadata(byName.get("Systematic Review"));
  assert.ok(reviewMetadata.useAfter.includes("Meta-Analysis"));
  assert.ok(reviewMetadata.alternatives.includes("Scoping Review"));
  assert.ok(metadata.techniqueSearchText(byName.get("LINDDUN Privacy Threat Modeling")).includes("PASTA Threat Modeling"));
  assert.equal(new Set(metadata.TECHNIQUE_TASKS.map((task) => task.id)).size, metadata.TECHNIQUE_TASKS.length);
  for (const task of metadata.TECHNIQUE_TASKS) {
    const recommendations = metadata.techniqueNamesForTask(task.id);
    assert.ok(recommendations.length >= 3, `${task.label} needs at least three live recommendations`);
    for (const name of recommendations) assert.ok(byName.has(name), `${task.label} recommends missing technique: ${name}`);
  }
  assert.equal(metadata.techniqueNamesForTask("challenge")[0], "Key Assumptions Check");
  assert.equal(metadata.techniqueNamesForTask("compare-options")[0], "Analytic Hierarchy Process");
  assert.ok(metadata.techniqueNamesForTask("frame").includes("Legibility / Local-Knowledge Audit"));
  assert.ok(metadata.techniqueNamesForTask("challenge").includes("Goodhart–Campbell Metric Gaming Audit"));
  assert.ok(metadata.techniqueNamesForTask("compare-options").includes("Bounded Rationality / Satisficing Audit"));
  assert.ok(metadata.techniqueNamesForTask("threat-risk").includes("Interactive Complexity / Tight-Coupling Audit"));
  assert.ok(metadata.techniqueNamesForTask("improve-process").includes("Goodhart–Campbell Metric Gaming Audit"));
  const challengeRecommendations = metadata.techniqueRecommendationsForTask("challenge");
  assert.equal(challengeRecommendations[0]?.name, "Key Assumptions Check");
  assert.ok(challengeRecommendations.every((item) => item.role.trim().length >= 20), "task recommendations need substantive analyst-facing rationales");
  assert.ok(metadata.techniqueSearchText(byName.get("Key Assumptions Check")).includes("Expose assumptions"));
  assert.ok(metadata.techniqueSearchText(byName.get("Analysis of Competing Hypotheses (ACH)")).includes("Compare hypotheses"));
  const quickChallenge = metadata.suitableTechniqueRecommendationsForTask("challenge", { effort: "quick", evidence: "light", dataType: "any", output: "any" });
  assert.ok(quickChallenge.length >= 3);
  assert.ok(quickChallenge[0].score >= quickChallenge.at(-1).score, "suitability recommendations must be score-ranked");
  const systematicFit = metadata.techniqueSuitabilityScore(byName.get("Systematic Review"), { effort: "quick", evidence: "light", dataType: "quantitative", output: "review" });
  assert.ok(systematicFit.score < 100, "quick/light constraints should penalize an extended substantial-evidence review");
  const networkFit = metadata.techniqueSuitabilityScore(byName.get("Social Network Analysis"), { dataType: "network", output: "network" });
  assert.ok(networkFit.score >= 90, "network methods should fit network data/output requests");
  assert.ok(metadata.TECHNIQUE_PLAYBOOKS.length >= 6, "catalog needs a useful set of multi-technique playbooks");
  for (const playbook of metadata.TECHNIQUE_PLAYBOOKS) {
    const resolved = metadata.techniquePlaybook(playbook.id);
    assert.ok(resolved, `playbook must resolve: ${playbook.id}`);
    assert.ok(resolved.steps.length >= 3, `${playbook.label} needs at least three steps`);
    for (const step of resolved.steps) { assert.ok(byName.has(step.name), `${playbook.label} references missing technique: ${step.name}`); assert.ok(step.role.trim().length >= 20, `${playbook.label} needs substantive step rationale`); }
  }
  for (const playbook of metadata.TECHNIQUE_PLAYBOOKS) {
    const full = metadata.adaptiveTechniquePlaybook(playbook.id, { effort: "extended", evidence: "substantial", dataType: "any", output: "any" });
    const focused = metadata.adaptiveTechniquePlaybook(playbook.id, { effort: "moderate", evidence: "moderate", dataType: "any", output: "any" });
    const rapid = metadata.adaptiveTechniquePlaybook(playbook.id, { effort: "quick", evidence: "light", dataType: "any", output: "any" });
    assert.equal(full.mode, "full"); assert.equal(full.steps.length, metadata.techniquePlaybook(playbook.id).steps.length);
    assert.equal(focused.mode, "focused"); assert.equal(focused.steps.length, 3);
    assert.equal(rapid.mode, "rapid"); assert.equal(rapid.steps.length, 2); assert.ok(rapid.omitted.length >= 1);
    const canonical = metadata.techniquePlaybook(playbook.id).steps.map((step) => step.name);
    assert.deepEqual(rapid.steps.map((step) => canonical.indexOf(step.name)), rapid.steps.map((step) => canonical.indexOf(step.name)).toSorted((a,b) => a-b), `${playbook.label} rapid variant must preserve canonical sequence`);
  }
  const achPrereqs = metadata.techniqueCatalogMetadata(byName.get("Analysis of Competing Hypotheses (ACH)")).prerequisites;
  assert.ok(achPrereqs.some((item) => item.toLowerCase().includes("hypoth")));
  const didPrereqs = metadata.techniqueCatalogMetadata(byName.get("Difference-in-Differences")).prerequisites;
  assert.ok(didPrereqs.some((item) => item.toLowerCase().includes("parallel trends")));
  const oodaPrereqs = metadata.techniqueCatalogMetadata(byName.get("OODA Decision-Cycle Analysis")).prerequisites;
  assert.ok(oodaPrereqs.some((item) => item.toLowerCase().includes("time-sensitive")));
  const metricPrereqs = metadata.techniqueCatalogMetadata(byName.get("Goodhart–Campbell Metric Gaming Audit")).prerequisites;
  assert.ok(metricPrereqs.some((item) => item.toLowerCase().includes("metrics")));
  assert.equal(metadata.techniquePlaybook("cyber-investigation").steps[0]?.name, "Incident Reconstruction");
  assert.equal(metadata.techniquePlaybook("rapid-operational-decision").steps[0]?.name, "OODA Decision-Cycle Analysis");
  assert.ok(metadata.techniquePlaybook("complex-system-failure").steps.some((step) => step.name === "Interactive Complexity / Tight-Coupling Audit"));
  assert.ok(metadata.techniquePlaybook("metrics-and-incentives").steps.some((step) => step.name === "Goodhart–Campbell Metric Gaming Audit"));
  assert.ok(metadata.techniquePlaybook("governance-under-complexity").steps.some((step) => step.name === "Legibility / Local-Knowledge Audit"));
  const redTeamMetadata = metadata.techniqueCatalogMetadata(byName.get("Red Team Analysis"));
  assert.ok(redTeamMetadata.useBefore.includes("Key Assumptions Check"));
  assert.ok(redTeamMetadata.references.some((item) => item.label.includes("CIA Tradecraft Primer")));
  const dmaicMetadata = metadata.techniqueCatalogMetadata(byName.get("DMAIC"));
  assert.equal(dmaicMetadata.references[0]?.href, "https://asq.org/quality-resources/dmaic");
  assert.ok(dmaicMetadata.prerequisites.some((item) => item.toLowerCase().includes("baseline")));
  const controlMetadata = metadata.techniqueCatalogMetadata(byName.get("Control Chart Analysis"));
  assert.ok(controlMetadata.prerequisites.some((item) => item.toLowerCase().includes("time-ordered")));
  const fmeaMetadata = metadata.techniqueCatalogMetadata(byName.get("Failure Mode and Effects Analysis (FMEA)"));
  assert.equal(fmeaMetadata.references[0]?.href, "https://asq.org/quality-resources/fmea");
  const hazopMetadata = metadata.techniqueCatalogMetadata(byName.get("Hazard and Operability Study"));
  assert.ok(hazopMetadata.references.some((item) => item.href.includes("hse.gov.uk")));
  const didMetadata = metadata.techniqueCatalogMetadata(byName.get("Difference-in-Differences"));
  assert.ok(didMetadata.references.some((item) => item.href.includes("cdc.gov")));
  const referencedMethods = definitions.filter((definition) => metadata.techniqueCatalogMetadata(definition).references.length > 0);
  assert.ok(referencedMethods.length >= 18, "authoritative provenance should cover a meaningful set of high-use methods");
  for (const definition of referencedMethods) for (const reference of metadata.techniqueCatalogMetadata(definition).references) { assert.ok(reference.label.trim().length >= 4, `${definition.name} reference needs a label`); assert.match(reference.href, /^https:\/\//, `${definition.name} reference must use HTTPS`); }
  for (const definition of definitions) {
    const item = metadata.techniqueCatalogMetadata(definition);
    for (const related of [...item.useBefore, ...item.useAfter, ...item.alternatives]) {
      assert.ok(byName.has(related), `${definition.name} metadata references missing technique: ${related}`);
    }
  }
  console.log(`Catalyst technique catalog tests passed (${definitions.length} techniques, ${clusters.size} clusters, ${workflows.SPECIFIC_CATALOG_WORKFLOW_COUNT} deep workflows).`);
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
