# ADR 0026 — Remove Assessment from Catalyst product scope

Status: Accepted — 2026-09-14

## Decision

Catalyst does not own formal assessments as a product concept.

Catalyst is a full-length thought-based planning and analysis suite. It owns structured thought, notes, outlines, relationships, evidence, planning, and analytic techniques. Formal assessments belong downstream in documents, reports, or briefings.

## Consequences

- Remove the Assessment tab, questionnaire workspace, framework/template code, CSS, and dedicated tests.
- Do not retain compatibility code for Assessment data; Catalyst has no users requiring migration support.
- Techniques remain a first-class workspace surface.
- Assessment-like rigor may exist inside techniques or thought structure, but not as an Assessment domain object or workflow.
- Future publishing/export features may transform Catalyst outputs into reports or briefings without making Catalyst a document-authoring system.
