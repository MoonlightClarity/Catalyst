# Using Catalyst as an LLM

Purpose: instructions for an LLM operating Catalyst itself as an analytical tool. This is not a codebase-navigation guide. Treat Catalyst as an external working environment in which the LLM reads sources, constructs an explicit analysis, applies methods when useful, and preserves the resulting session.

## Mental model
Catalyst is a structured analytical scratch space, not another chat interface. Use it to externalize reasoning that benefits from hierarchy, persistent notes, source proximity, or deliberate analytic methods.

The core division of labor is:
- **Outline = organize what is.** Store observations, claims, evidence, questions, distinctions, contradictions, and the current structure of the problem.
- **Methods = analyze what it means.** Use procedures to interpret, challenge, compare, decompose, stress-test, or reframe what the Outline contains.
- **PDF reader = source context.** Keep source material close to the analysis without confusing source navigation with analytical state.
- **Catalyst session = durable external reasoning state.** Save the evolving structure, not just a final answer.

Do **not** treat Catalyst as a linear source → Outline → Methods → done pipeline. For substantial work, cycle repeatedly:
**source/observation → Outline → Method → Outline revision → Method or source check → Outline revision → … → save**.

The direction should alternate whenever the analysis changes. A method can expose a missing distinction that requires restructuring the Outline; a revised Outline can expose a new subproblem that warrants another method. Methods do not automatically own or update Outline structure: the LLM must perform that interpretive handoff deliberately.

The Outline remains the primary working structure, while Methods are supporting analytical procedures. Do not invent additional Catalyst concepts or try to use retired Evidence, Assessment, Thought, map, or graph-first workflows.

## Operating priorities
1. Inspect the visible workspace before acting. Do not assume a blank-looking panel means the session is empty.
2. Preserve authored hierarchy and sibling order unless the analytical task requires restructuring.
3. Prefer semantic controls, accessible names, and keyboard navigation over brittle screen coordinates.
4. Make one structural change at a time, then verify focus and visible state before continuing.
5. Save explicitly to `.catalyst.xml` at durable checkpoints. Browser-local state is not a substitute for a portable session file.
6. Keep source PDFs separate. Opening or reconnecting a PDF should not be treated as modifying the source file.
7. Use Methods only when a deliberate procedure improves the analysis; do not add methods merely to populate the workspace.
8. After every method that materially changes the interpretation, return to the Outline and encode the consequence there.
9. After every major Outline restructuring, reconsider whether the current method chain still fits the problem.
10. For dense analysis, prefer many short verified Outline↔Methods loops over one long Outline pass followed by one long Methods pass.

## Starting or resuming a task
1. Allow Catalyst to finish loading before interacting with the reader or workspace.
2. To continue prior work, activate **Load session** and choose the relevant `.catalyst.xml` file.
3. For a clean workspace, activate **New session** and accept the confirmation only when discarding the currently loaded session is intended.
4. Open one or more sources with **Open** or `Ctrl/Cmd+O`. The file picker accepts multiple PDFs. If a saved source cannot be reopened, use **Locate PDF** to reconnect that PDF.
5. Inspect the Outline and Methods counts and visible content before adding structure.
6. Establish the analytical question in working context before editing the Outline.
7. Save a checkpoint once the source and initial structure are correctly established.

## Stable interface landmarks
When operating through browser or desktop automation, prefer these semantic landmarks and accessible labels:
- `PDF reader` — source-document pane.
- `Document toolbar` — top-level session and document controls.
- `Session controls` — **New**, **Load**, **Save**, and **Open**.
- `Reader navigation toolbar` — zoom, page, theme, and fullscreen controls.
- `Research context` — analytical pane.
- `Workspace views` — tab list containing **Outline** and **Methods**.
- `Analysis outline` — Outline tree.
- `Methods` — ordered Methods tree.

Do not depend on exact pixel positions. Catalyst is intentionally compact, and focus, window size, fullscreen state, or an open search panel can change geometry without changing the semantic control.

## Deterministic navigation for LLM operators
Catalyst exposes stable surface shortcuts and structural addresses so an LLM can navigate by meaning instead of walking the interface one keypress at a time.

Surface shortcuts:
- `Alt+1` — focus the PDF reader.
- `Alt+2` — focus the Outline.
- `Alt+3` — focus Methods when Methods are enabled.
- `Ctrl/Cmd+G` — open the compact **Go to** dialog for documents, pages, Outline locations, Methods locations, the full Methods catalog, and export commands.

Session and source shortcuts:
- `Ctrl/Cmd+O` — open a PDF.
- `Ctrl/Cmd+Shift+X` — close the current document. This intentionally avoids `Ctrl/Cmd+W`, which belongs to the browser/window shell.
- `Ctrl/Cmd+Shift+O` — load a Catalyst session.
- `Ctrl/Cmd+S` — save the current Catalyst session.

`Alt+1`/`2`/`3`, Close document, session Load, and session Save are intentionally not treated as structural commands while a text field is being edited. Leave the editor or restore structural focus before using those shortcuts. `Ctrl/Cmd+G` remains available as the explicit navigation command when direct addressing is needed.

The **Go to** dialog accepts structural addresses rather than presenting a potentially enormous list. This matters for large workspaces: the dialog stays constant-size and resolves the requested location directly from the underlying structure.

### Safe Go To entry procedure
For deterministic automation, treat the **Go to** field as replace-only input rather than as a command line to append to. Catalyst may prefill a current-surface prefix such as `O ` or `M ` when the dialog opens.

1. Open **Go to** with `Ctrl/Cmd+G` and confirm the address field has focus.
2. Press `Ctrl/Cmd+A` in the field and replace its entire contents. Do **not** append a complete address to prefilled text; for example, avoid turning `O ` into `O O 2.3`.
3. Enter the complete destination or command from scratch, such as `D 2`, `D 2 P 37`, `O 2.3`, `O 2.3 note`, `M 4.1 form`, `M 4.1 step 2`, `All methods`, `Export PDF`, `Export DOCX`, or `Export RTF`.
4. Submit once, then verify that the requested document, page, Outline item, note, Method form, step, or catalog is visibly active before issuing the next structural command.
5. If the address is unknown, inspect current visible numbering or Catalyst navigation metadata rather than guessing a hierarchy number.

This replace-first procedure is the preferred LLM behavior even when Catalyst would accept a shorter context-relative address. Structural numbers are current workspace locations, not durable entity IDs.

### Go To syntax tolerance
Use spaces between semantic address segments as the canonical syntax. Prefix-to-number spacing is forgiving: `D1`, `P5`, `O2.3`, and `M4.1` are accepted. Compound and suffix boundaries are not fully whitespace-insensitive, however. Use `D 1 P 5`, not `D1P5`; use `O 2.3 note`, not `O2.3note`; and use `M 4.1 step 2`, not `M4.1step2`. A partially compact form such as `D1 P5` can parse, but LLM operators should emit the fully spaced canonical form rather than depend on parser tolerance.

Supported address forms:
- `D 2` — switch to document 2 in stable first-open order.
- `D filename` — switch by an exact or unambiguous document filename.
- `P 37` — go to page 37 of the active document.
- `D 2 P 37` — switch to document 2 and go directly to page 37.
- `O 2.3` — select Outline item 2.3.
- `O 2.3 note` — select Outline item 2.3 and focus its note body.
- `M 4.1` — select Method 4.1.
- `M 4.1 form` — open Method 4.1 and focus its editable form.
- `M 4.1 step 2` — open Method 4.1 and focus the second response field.
- `All methods` or `Catalog` — open the complete read-only Methods catalog.
- `Export PDF` — export the complete authored Outline + Methods analysis as PDF.
- `Export DOCX` — export the complete authored Outline + Methods analysis as DOCX.
- `Export RTF` — export the complete authored Outline + Methods analysis as RTF.

Long forms such as `Document 2 Page 37`, `Outline 2.3`, and `Method 4.1` are also accepted. When the current analytical surface is already Outline or Methods, a bare structural number such as `2.3` resolves within that current surface.

If the requested item is under collapsed parents, Catalyst resolves the address from the model, expands only the ancestors needed to reveal it, and then places focus on the requested target. Do not manually expand a long tree before using an address unless visual inspection is itself part of the task.

Structural addresses are **locations, not permanent identifiers**. Inserting, deleting, reordering, indenting, or outdenting items can change addresses such as `O 2.3` or `M 4.1`. Re-read the current visible numbering after structural edits rather than caching an old address across later changes.

For automation, visible Outline rows, Method rows, note bodies, and Method response fields expose stable Catalyst navigation metadata. Prefer accessible names and the Go To contract first; use implementation-level markers only when the automation environment can benefit from them.

### Automation markers
When DOM-level or accessibility-assisted automation is available, Catalyst provides stable semantic markers in addition to visible labels:
- `data-catalyst-active-surface` on the workspace root reports `reader`, `outline`, or `methods`.
- `data-catalyst-surface` identifies the Reader, Outline, and Methods regions.
- `data-catalyst-action` identifies durable actions including `new-session`, `load-session`, `save-session`, `export`, `open-pdf`, `close-document`, `switch-document`, `open-outline`, `open-methods`, `view-all-methods`, and `go-to-address`.
- `data-catalyst-address` identifies current navigation targets such as `D 2`, `O 2.3`, `O 2.3 note`, `M 4.1`, `M 4.1 form`, and `M 4.1 step 2`. Page locations are requested through Go To as `P 37` or `D 2 P 37`.
- `data-catalyst-file-input` distinguishes the hidden `pdf` and `session` file inputs.

Treat these as interaction semantics, not analytical data. In particular, never persist or reason from a structural address as though it were an immutable entity ID.

## Working with the PDF reader
- `Ctrl/Cmd+O` opens a PDF.
- `Ctrl/Cmd+F` opens in-document search only when a PDF is active.
- `Ctrl/Cmd++` and `Ctrl/Cmd+-` zoom; `Ctrl/Cmd+0` returns to automatic fit.
- `Ctrl/Cmd+Home` and `Ctrl/Cmd+End` jump to the first and last page when the reader owns focus.
- The page-number field labeled `Current page` accepts a direct page number.
- When more than one document belongs to the current workspace, the compact **Switch document** selector uses stable first-open numbering such as `D 1`, `D 2`, and so on. Prefer `Ctrl/Cmd+G` with `D <number>` or `D <number> P <page>` for deterministic navigation rather than reopening documents from disk.
- **Close** or `Ctrl/Cmd+Shift+X` removes the currently displayed PDF from the current session. If another document remains, Catalyst activates the next document in stable first-open order; otherwise the reader becomes empty. Because closing removes a document from the session list, later `D <number>` addresses can renumber and should be re-read after a close.
- Fullscreen is disabled until a PDF exists; do not interpret that disabled state as an application failure.
- Reader night/day mode is a viewing preference, not document state.
- Search navigation is intentional reader history; normal scrolling is not.

Text selection may expose source actions. Treat selected source text as source context, not as an Outline item until the analysis explicitly incorporates it.

## Completion protocol for an LLM
Before leaving Catalyst, inspect the workspace from the top rather than only the last item edited. Confirm that the Outline answers the intended question, that parent/child relationships are meaningful, that important contrary evidence is represented, and that no accidental blank or duplicate items remain.

If Methods were used, check that their substantive outputs affected the Outline or synthesis where appropriate. A completed method that never changes or challenges the analysis may simply be procedural residue.

Confirm that the correct source was used for source-dependent claims. If exact wording materially affects the conclusion, revisit the relevant PDF passage before finalizing.

Explicitly Save meaningful work to a `.catalyst.xml` session before ending the tool-use pass unless the user asked not to persist it.

Then return to ChatGPT and synthesize the result for the user. Do not merely report that Catalyst was used. State the conclusion, key evidence, uncertainty, and any important competing interpretation that survived the Catalyst pass.

## Default decision rule
Use Catalyst when externalized structure is likely to improve the answer enough to justify operating another application. The strongest triggers are long source documents, ambiguous evidence, competing explanations, multi-factor judgments, adversarial review, structured planning, or tasks where the user explicitly asks for Catalyst.

Skip Catalyst for simple factual lookups, straightforward calculations, trivial rewrites, or tasks where the workspace would add ceremony without improving reasoning.

When the user explicitly asks ChatGPT to 'use Catalyst,' interpret that as an instruction to operate the Catalyst application as an analytical workspace, not to inspect or modify the Catalyst repository unless the user separately asks for development work.
## Outline navigation contract
The Outline is a keyboard-oriented tree. First focus a row or the master title; shortcuts should not be sent while a title input or notes textarea is being edited.

On a focused Outline row:
- `ArrowUp` / `ArrowDown` — move through visible rows.
- `ArrowLeft` — collapse children; if already collapsed or childless, move to the parent/master.
- `ArrowRight` — expand children; if already expanded, move to the first child.
- `Home` / `End` — focus the first/last visible Outline row.
- `Enter` — create a sibling immediately after the focused row.
- `F2` — rename the row.
- `Tab` — indent beneath the previous sibling when possible.
- `Shift+Tab` — outdent when possible.
- `Alt+ArrowUp` / `Alt+ArrowDown` — reorder among siblings.
- `Backspace` — delete the focused Outline item. Treat this as destructive and verify the intended target before sending it.

On the master Outline title:
- `F2` edits the analysis title.
- `Enter` adds a top-level Outline item.
- `ArrowLeft` / `ArrowRight` collapse or expand the whole Outline.
- `ArrowDown` moves into the first visible row.

A selected Outline item exposes its notes editor directly below the title. Type analytical content there; title editing and note-body editing are distinct modes. When editing text, allow normal text-editing behavior instead of sending structural shortcuts.

For direct access, use `O <address> note` in **Go to**. For example, `O 3.2 note` expands any collapsed ancestors, selects item 3.2, and places focus in that item's note textarea. This is preferable to manually traversing a large Outline when the target address is already known.

### Outline discipline for an LLM
Use titles for concise claims, questions, hypotheses, or section labels. Use the note body for reasoning, qualifications, source references, and detail. Build hierarchy because it represents analytical structure, not merely to make the page visually tidy.
## Methods navigation contract
Methods form a separate ordered tree. They do not own or automatically restructure the Outline.

For LLM catalog discovery, prefer **Go to** and enter `All methods` or `Catalog` using the replace-first procedure above. The visible **All methods** control is an equivalent human-facing route. This opens a read-only, alphabetized view of the complete current method catalog with each method name and summary exposed in one semantic surface. It is intentionally unpaginated so an LLM can inspect the whole option space without repeatedly driving the Add-method picker. Do not infer a Method address from its ordinal position in this catalog; catalog numbering is for discovery, while `M <address>` targets the current authored Methods tree. Viewing the catalog does not add anything to the Methods sequence. Close it with `Escape`, then use the normal Add-method picker to add the chosen method.

When the Methods list is empty, focus the list and press `Enter` to open **Add method**. In the picker:
- Search by method name with `Find catalog method`.
- Use `Filter methods by cluster` only to narrow discovery; clusters are not analytical output.
- Use **Previous** / **Next** to page through results.
- Use `Custom method name` plus **Add custom** when the task needs a procedure that is not in the catalog.
- `Escape` closes the picker without adding a method.

On a focused method row:
- `ArrowUp` / `ArrowDown` — move through visible methods.
- `ArrowLeft` / `ArrowRight` — collapse, expand, or move through parent/child structure.
- `Home` / `End` — focus the first/last visible method.
- `Enter` — open the picker to add a sibling after the focused method.
- `F2` — open the full method editor.
- `Tab` / `Shift+Tab` — indent or outdent.
- `Alt+ArrowUp` / `Alt+ArrowDown` — reorder among siblings.
- `Backspace` — delete the focused method. Verify the target first.

Inside the method editor, edit the method name, subtask titles, and analysis responses directly. The plus control inserts a subtask after the current one; the adjacent remove control deletes that subtask. `Escape` returns from the editor to the Methods list.

For direct access, use `M <address> form` to open the method's editable form, or `M <address> step <n>` to place focus directly in a particular response field. For example, `M 2.1 form` opens Method 2.1, while `M 2.1 step 3` opens it and focuses response field 3. Catalyst validates the requested step before navigating; an invalid step address should be corrected rather than approximated with blind keystrokes.

Method responses should capture the result of actually performing the procedure. Do not fill a method with generic definitions of the technique unless that is specifically the task.
## Focus and automation discipline
Catalyst intentionally assigns structural shortcuts only to the focused tree surface. Before sending a shortcut, confirm whether focus is on a row, a text field, the PDF reader, or a dialog.

For GUI automation:
1. If the destination already has a known structural address, prefer **Go to** over repeated Arrow-key traversal.
2. Otherwise locate by accessible name or visible text before falling back to coordinates.
3. Click or focus the intended tree row before sending structural keystrokes.
4. After creating, deleting, indenting, outdenting, or reordering, re-read the nearby visible structure because structural addresses may have changed.
5. After opening a modal or full-screen editor, wait for that state to become visible before typing.
6. After closing a modal or editor, verify focus returned to the expected list row.
7. Do not send repeated keystrokes merely because an animation or persistence indicator has not immediately changed.

If the interface appears unresponsive, first determine whether focus is trapped in a text field, file picker, modal, fullscreen reader, or inactive pane. Re-establish semantic focus rather than clicking arbitrary coordinates.

## Persistence and checkpoints
**Save session** writes portable Catalyst XML. Use it at meaningful boundaries: after initial structure, after a major restructuring pass, after completing a method, and before ending an unattended run.

A saved Catalyst session and its source PDF are separate artifacts. Loading the XML can restore analytical state while still requiring the PDF to be located again. Reconnecting the source should use the same underlying PDF; if Catalyst reports a mismatch, stop and inspect rather than forcing the connection.

**New session** unloads the current workspace after confirmation. It does not delete saved `.catalyst.xml` files or original PDFs. Do not use it as a substitute for clearing one section of an analysis.

## Failure recovery
- If a source is unavailable after loading a session, use **Locate PDF** and reconnect the expected document.
- If a method or Outline row seems missing, inspect collapsed parents before recreating it.
- If a keyboard command behaves like browser navigation or text editing, restore focus to the intended Catalyst tree row and try once more.
- If search or fullscreen controls do nothing, confirm a PDF is actually open.
- If a save/load operation reports an error, preserve the current workspace and diagnose the persistence problem before starting a new session.
## When not to use Catalyst
Do not force every task into Catalyst. Skip it when the work is better served by direct calculation, simple lookup, short-form drafting, or another tool that does not benefit from persistent analytical structure.

Catalyst is most useful when at least one of these is true:
- a source document must remain visible while reasoning;
- the reasoning needs a durable hierarchy;
- the analysis will evolve across multiple passes;
- a structured method materially improves the inquiry;
- another agent or later session needs to inspect how the analysis was organized.

## End-of-run checklist
Before leaving an unattended or agentic Catalyst session:
1. Exit any transient picker or editor that obscures the overall structure.
2. Inspect the Outline for accidental blank siblings, unexpected nesting, or unintended deletions.
3. Inspect Methods for correct order and nesting if methods were used.
4. Confirm the intended source document is still associated with the session.
5. Save a portable `.catalyst.xml` checkpoint when the work should survive independently of browser-local state.
6. Record what analytical question was advanced and what remains unresolved outside Catalyst if another agent will continue the work.

The operating principle is simple: use Catalyst to make analytical structure explicit and durable while keeping source reading, hierarchy, and optional method execution close together. The tool should reduce cognitive load, not become another layer the LLM must reason around.
## Recommended analytical patterns
Catalyst should reflect the shape of the reasoning problem. Do not force every task into the same outline template.

### Document assessment
Use top-level items for the principal claims, issues, or evaluation dimensions. Under each, separate source observations from interpretation, contrary evidence, and implications. Put page numbers or short source locators in notes when they will help a later pass verify the claim.

### Competing interpretations
Create one peer branch per serious interpretation. Give each branch its strongest supporting evidence, strongest contradictory evidence, unresolved assumptions, and what new information would discriminate among alternatives. Do not make the preferred interpretation structurally privileged before the comparison is complete.

### Level or fit assessment
Use peer branches for plausible levels/roles rather than jumping directly to one label. Under each, record evidence for scope, autonomy, judgment, ambiguity, influence, ownership, measurable output, and duration/depth. Add disconfirming evidence under the same branch. Conclude only after the competing branches have been populated.

### Planning or decomposition
Use top-level items for outcomes or major workstreams and children for dependencies, constraints, risks, and next actions. Do not confuse chronological order with hierarchy: a later step is not automatically a child of an earlier step.

### Adversarial review
Create a branch explicitly for failure modes, counterarguments, missing evidence, and assumptions. Try to make this branch strong enough that it could change the conclusion. Catalyst adds little value if it only records support for the first answer ChatGPT preferred.

## Source traceability for agents
When a conclusion depends on a source document, preserve enough traceability that another model or the human user can verify it. Prefer page numbers, section names, headings, or a short distinctive phrase in the note body. Do not paste large excerpts when a locator and concise paraphrase are sufficient.

Mark uncertainty explicitly in the analytical content. Distinguish among: directly observed source content, inference from the source, external context supplied by ChatGPT, and an unresolved hypothesis. Do not allow the Outline's visual hierarchy to make an inference look like a sourced fact.

If multiple documents are involved, identify the source in the relevant note rather than assuming the currently open PDF will always be obvious later. Catalyst session state is durable; transient model context is not.

## Handoff between LLM runs
A Catalyst session should be understandable to a later agent without access to the originating model's hidden reasoning. Before handing off:
1. Give the master analysis title a specific question or task name.
2. Make top-level branches self-explanatory rather than using labels such as `Other`, `More`, or `Thoughts`.
3. Put unresolved questions and missing evidence into explicit branches or notes.
4. Preserve serious alternatives even if one currently appears stronger.
5. Save the session after the final structural review.
6. In the chat handoff, identify the saved session, the source document, the current analytical question, and the major unresolved issue.

Do not encode essential handoff information only in chat. If it is necessary to understand the analytical structure later, put it in Catalyst as well.

## Agent interaction loop
For substantial work, use a repeated observe → act → verify cycle rather than entering a long sequence of blind UI commands.

**Observe:** identify the active pane, focused item, nearby hierarchy, current source page, and whether a modal/editor is open.

**Act:** make one meaningful change: add a row, edit a title or note, move hierarchy, complete part of a method, navigate the source, or save.

**Verify:** inspect the resulting structure or state before issuing the next structural command. Verification is especially important after `Backspace`, `Tab`, `Shift+Tab`, reordering, Load, New, and file-reconnection actions.

This discipline matters more for LLM operators than for human users because an automation error can compound quickly when subsequent actions assume focus or hierarchy that no longer exists.

## Quality gate before using Catalyst results in an answer
Do not treat the presence of a populated Outline as evidence that the analysis is good. Before synthesizing the user's answer, check that:
- the original question is actually addressed;
- important claims are grounded in source material or clearly marked as inference;
- at least one credible contrary interpretation was considered when the task is genuinely ambiguous;
- hierarchy represents relationships rather than arbitrary formatting;
- Methods contributed analysis rather than ceremonial form completion;
- uncertainty and missing evidence remain visible rather than being silently converted into certainty;
- the final synthesis can be reconstructed from the visible Catalyst workspace without relying on hidden chain-of-thought.

Catalyst is complete when it has improved the inspectability and discipline of the reasoning. It is not complete merely because every visible field contains text.

## Catalyst as an external reasoning system
Catalyst can be used as more than a record of conclusions. For an LLM, it functions as a persistent external reasoning state that can be reorganized independently of the current chat turn.

Use it to break the normal single-pass pattern of prompt → answer. A strong Catalyst pass is iterative:
1. frame the question;
2. externalize the first structure;
3. inspect the source against that structure;
4. generate competing explanations or decompositions;
5. apply one or more Methods where they add pressure or coverage;
6. rewrite the Outline in response to what changed;
7. inspect the resulting whole;
8. only then synthesize the user-facing answer.

The value is not that Catalyst 'stores notes.' The value is that the model can return to an explicit analytical object and alter the object as its reasoning changes.

### Use restructuring as reasoning
Reordering, indenting, outdenting, splitting, merging, and renaming Outline items are analytical operations. When the hierarchy changes, ask what conceptual claim changed. Do not treat structure as formatting applied after the reasoning is finished.

If two items repeatedly compete for the same parent, that may indicate the parent is poorly framed. If an item needs many qualifications in its title, split claim from uncertainty. If evidence supports several branches, consider whether the analysis is organized around the wrong dimensions.

## Method chaining and analytical recursion
Methods can be sequenced. Treat that sequence as an analytical program rather than a checklist. One method can expose assumptions, another can generate alternatives, and a later method can test or prioritize what the earlier method produced.

A useful pattern is **expand → challenge → discriminate → synthesize**. For example: generate plausible interpretations; identify assumptions and failure modes; determine what evidence separates the interpretations; then rewrite the Outline around the distinctions that survived.

Do not copy method responses mechanically into the Outline. Translate only the analytical consequences. If a method changes nothing, either the existing analysis survived the test or the method was poorly chosen; record that distinction in working notes when it matters.

Methods can also be recursive. If one method reveals a new subproblem, make that subproblem explicit in the Outline and, when warranted, run another method against it. Stop when additional structure no longer changes the judgment materially.

## Using Catalyst to control LLM failure modes
Use the workspace deliberately against common model weaknesses. Externalize alternative hypotheses before choosing one. Preserve inconvenient evidence instead of allowing it to disappear as the conversation advances. Separate observations from interpretation. Revisit earlier branches after learning something new. Force claims at different abstraction levels into explicit hierarchy rather than blending them into fluent prose.

For long tasks, Catalyst becomes working memory that is less vulnerable to conversational recency. Before final synthesis, compare the current Outline with the initial framing and ask what changed. A conclusion that never changed despite substantial new evidence deserves extra scrutiny.

For multi-pass work, leave the Outline in a state where another capable model could reconstruct the argument without access to hidden reasoning. That does not mean exposing chain-of-thought; it means preserving claims, evidence, alternatives, assumptions, uncertainties, and method outputs at an appropriate summary level.

## Outline↔Methods co-evolution
Do not divide substantial work into a completed Outline phase followed by a completed Methods phase. The two surfaces should co-evolve.

Use this loop repeatedly:
1. Put the best current representation of the evidence/problem into the Outline.
2. Let the Outline expose a question, ambiguity, competing interpretation, or missing distinction.
3. Choose a Method that performs the needed analytical operation.
4. Complete the Method as an actual analysis, not a definition of the technique.
5. Return immediately to the Outline and encode only the analytical consequences: a new distinction, surviving hypothesis, contradiction, missing evidence, revised hierarchy, or changed confidence.
6. Re-read the changed Outline and decide what now needs testing.
7. Repeat until new loops stop materially changing the structure or judgment.

The Outline may contain both observations and derived findings, but keep the distinction legible. A derived finding should not silently acquire the status of a sourced fact because it sits high in the tree.

## Hypothesis and proxy discipline
When comparing hypotheses, roles, levels, explanations, or classifications, do not jump straight to a winner. **Support each hypothesis first, then try to falsify it independently, before comparing survivors.**

Do not assume all hypotheses use the same proxy system. Different career levels, role families, causal explanations, or decision options may be judged by different evidence. Define the relevant proxy set for each hypothesis before testing it. A Senior IC may be judged by autonomy and judgment; a Manager by team outcomes; a Principal by organizational leverage. Treating those as one scalar ladder can create false conclusions.

Distinguish:
- **compatible evidence** — could occur if a hypothesis were true but does little to separate it from alternatives;
- **diagnostic evidence** — meaningfully discriminates among hypotheses;
- **missing expected evidence** — should normally exist if the hypothesis were true;
- **counterevidence** — directly strains or contradicts the hypothesis.

When an artifact, event, or new fact seems important, test its **marginal contribution** with a counterfactual: remove it, rerun the interpretation, then add it back. This prevents attributing an entire conclusion to evidence that merely increases confidence or narrative coherence.

## Multi-axis decomposition
If a label remains unstable, ask whether it is collapsing several different variables. Split them explicitly in the Outline before deciding what the label means. Common separations include **capability vs proof**, **functional fit vs provenance**, **artifact quality vs adoption**, **technical fluency vs tool-specific execution**, **individual judgment vs organizational scale**, and **credibility vs predictive legibility**.

Do not infer that missing institutional proof means missing capability, or that demonstrated capability proves institutional scale. Preserve both axes when the evidence supports a split.

## Operating the application versus reading the code
When the user asks an LLM to use Catalyst, the default target is the **actual Catalyst application and saved session**, not the repository. Use the packaged desktop application when that is the artifact under evaluation.

Inspect source code only when it materially clarifies the application's interaction contract, accessibility semantics, persistence behavior, or another implementation detail needed to operate the live product correctly. After resolving that uncertainty, return to the application and perform the analysis there. Do not replace a requested Catalyst analysis with code inspection merely because the repository is easier to automate.

## Career and resume analysis pattern
For a resume, use Catalyst to separate **what the document literally demonstrates**, **what a recruiter could infer**, **what remains unproven**, and **what the candidate wants the document to signal**. Do not assume those layers coincide.

A strong Outline starts with the target judgment (for example, role family, level, credibility, transferability, or interview likelihood), then creates competing interpretations. For level analysis, test each level independently with the proxy system appropriate to that level. Support it, falsify it, record expected-but-missing evidence, and only then compare levels.

Keep separate branches for dimensions that can diverge: **capability**, **proof**, **provenance**, **organizational scale**, **artifact quality**, **tool-specific experience**, and **legibility to the hiring market**. A resume can demonstrate high capability while providing weaker conventional proof; that is a different problem from lacking the capability itself.

Create a branch for **signal failures in the resume itself**: evidence that exists but is buried, claims that sound broader than their supporting bullets, hedging that weakens credible accomplishments, reconstructed titles whose functional meaning must be evident from the work, and accomplishments whose real level is obscured by task-oriented phrasing.

Also test **predictive legibility**. A candidate can be credible and qualified yet still fail to cross the interview threshold because the reader cannot cheaply predict what will happen if the candidate is advanced. Look for unstable reference classes, unusual career transitions, overlapping identities, or evidence that requires too much reconstruction. Model the hiring decision as bounded and asymmetric: recruiters have limited attention and may stop at the first sufficiently legible alternatives rather than resolve every ambiguity.

When a portfolio artifact exists, do not ask only whether it is impressive. Test at least four possible effects separately: **corroboration of existing claims**, **salience/memorability**, **reduction of uncertainty about how the candidate works**, and **bridging of soft tool/transferability screens**. Then test the downside: poor quality or ambiguous framing can increase uncertainty by adding another identity.

Use counterfactuals. Remove the artifact or disputed label and ask what interpretation survives. Add it back and identify exactly what changes: level, confidence, legitimacy, coherence, screening value, or merely interest.

Use Methods to pressure-test the positioning when useful: assumptions checks, competing-hypothesis analysis, sensitivity analysis, bounded-rationality/satisficing review, legibility analysis, counterfactual analysis, or a custom Recruiter misread / Predictability threshold test. Rewrite the resume only after identifying which textual changes would alter the reader's likely model without changing the underlying facts.

After editing, return to Catalyst and ask whether the revised wording reduces the specific ambiguity identified in the Outline. The objective is not maximum seniority language or maximum novelty; it is a **clear, defensible, and forecastable professional model** from the available evidence.

## Method discovery before selection
Catalyst's Methods catalog is broad (581 current methods), so do not default mechanically to the handful of familiar intelligence techniques. Before building a method chain, inspect or search the catalog for methods that match the actual analytical operation.

For example, a resume is simultaneously an evidence problem, a level-classification problem, and a persuasive document. Relevant methods can therefore come from intelligence, research, quality, decision, design, or literary/rhetorical families. A useful chain may combine **Analysis of Competing Hypotheses**, **Key Assumptions Check**, **Argument Mapping**, **Reader-Response Analysis**, **Rhetorical Criticism**, **Sorting and Prioritizing**, or **Structured Self-Critique** rather than staying inside one family.

Choose methods by what they force the LLM to do differently. Avoid adding two methods that merely restate the same comparison. Prefer a chain in which each method changes the analytical object: generate alternatives, test evidence, expose assumptions, model interpretation, prioritize signal, then revise the Outline.


## Transition from analysis to evidence collection
Catalyst can improve reasoning, but recursive analysis eventually reaches a point where another Method is less valuable than a new observation. An LLM should recognize that transition explicitly rather than continuing to generate increasingly elaborate internal interpretations.

Treat the analysis as **saturated enough to test** when one or more of these is true:
- successive Methods stop materially changing the Outline, surviving hypotheses, or confidence;
- the main uncertainty now depends on an external event, observation, user response, experiment, or real-world outcome;
- the analysis has produced a concrete intervention whose effect can be observed;
- remaining disagreement is about missing evidence rather than how to structure existing evidence.

At that point, do not keep polishing the analytical model. Freeze the relevant baseline, state the favored and rival hypotheses, define what outcome would discriminate among them, and move into evidence collection. When results arrive, return to Catalyst and update both the Method record and the Outline.

For consequential tests, use a Method such as **Falsification Test Design**, **Decision Tree Analysis**, **A/B Test Design**, **Value of Information**, or an equivalent procedure to define the test before observing the outcome. Record risky predictions, failure conditions, exclusions, and stopping rules in advance when feasible.

The operating loop can therefore extend beyond the application itself:
**Outline → Method → revised Outline → testable hypothesis → external observation → Method update → revised Outline**.

## Prospective versus retrospective evidence
Do not treat historical outcomes as if they were generated by the current artifact, framing, or intervention. Tag evidence by **version, timing, and conditions** when those differences matter.

Use retrospective evidence primarily to generate hypotheses, identify recurring failure modes, or estimate plausible reference classes. Use prospective evidence to evaluate whether a current intervention actually changes outcomes.

Before a prospective test begins:
- freeze the tested artifact or framing;
- record known hard gaps and likely confounders before the outcome is known;
- exclude contaminated cases such as prior applications, already-seen versions, cancelled roles, known ineligibility, or externally terminated processes;
- distinguish automatic acknowledgments from genuine human-selected progression;
- define how unknown or non-diagnostic outcomes will be coded.

Do not change the tested artifact after every negative observation. If the baseline moves continuously, the experiment cannot teach the agent which change mattered.

When multiple role families, audiences, environments, or proxy systems are involved, interpret outcome **patterns by subgroup** rather than collapsing everything into one conversion rate. A mixed result may indicate domain-specific transferability rather than a globally good or bad artifact.

## Sequential tests and stopping rules
Small real-world samples are often too heterogeneous for textbook statistical power. Do not pretend otherwise. The purpose of a sequential test is to prevent anecdotal overreaction, not to manufacture false precision.

Define in advance what evidence is sufficient to continue, stop, or introduce a controlled variant. A useful stopping rule specifies:
- the minimum number of genuinely diagnostic observations;
- the minimum number not dominated by obvious hard gates;
- which subgroups must be represented;
- what pattern is enough to falsify the strongest version of the current hypothesis;
- what outcome justifies changing one variable rather than rewriting the whole artifact.

Prefer **one-variable variants**. If changing a resume, analysis, workflow, prompt, or product framing, alter only the dimension being tested whenever practical. Preserve the rest of the evidence so the comparison remains interpretable.

## Catalog discovery through implementation inspection
The live application remains the place where analytical work is performed. However, when GUI automation makes catalog discovery inefficient, inspecting the current repository is an acceptable secondary aid for finding **method names, clusters, workflow fields, or interaction semantics**.

Use implementation inspection narrowly:
1. Search the catalog/source for a method matching the analytical operation.
2. Read only enough code to understand the available method or field structure.
3. Return to the live Catalyst application.
4. Add and complete the Method there.
5. Feed the result back into the Outline through the normal application workflow.

Do not substitute direct edits to localStorage, XML, source files, or repository data for performing the analysis in Catalyst. Repository inspection can answer **what method exists**; it should not become a hidden backdoor for **what the analysis says**.

This distinction also applies when evaluating Catalyst itself. If product quality is part of the analytical question, inspect the **packaged/live artifact** as well as build/test evidence. Source quality, passing tests, coherent UI, external adoption, specialist validation, and organizational use are different kinds of evidence and should remain separate in the Outline.

## Preserve the tested state
When Catalyst analysis produces a concrete artifact or intervention that will be evaluated outside the app, save a portable session checkpoint before the test begins. The saved session should capture the hypothesis, current structure, important exclusions, and planned interpretation rules.

If external outcomes arrive over time, update the existing session rather than rebuilding the reasoning from memory. Preserve the prior state when the distinction between pre-outcome and post-outcome reasoning matters.

A future agent should be able to answer: **What did we believe before the observation, what did we predict, what happened, and what changed?** If the session cannot answer those questions, the external test is not well integrated with the analytical record.
