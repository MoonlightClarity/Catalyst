import type { PendingSelection } from "../../domain/types";
import { trimQuote } from "../../shared/display";
import { EvidenceTraceMark, InstrumentGlyph } from "../../ui/CatalystSymbols";

type SelectionCardProps = {
  selection: PendingSelection;
  onSaveSource: () => void;
  onCopy: () => void;
  onDismiss: () => void;
};

/** PDF-local selection actions. Analysis/outline linkage is intentionally excluded. */
export function SelectionCard(props: SelectionCardProps) {
  return (
    <section className="selection-card selection-capture-dock" aria-label="Selected PDF text">
      <div className="selection-capture-fragment">
        <span className="selection-capture-trace"><EvidenceTraceMark /></span>
        <span className="selection-capture-paper">
          <span>{trimQuote(props.selection.quote.replace(/\s+/g, " "), 180)}</span>
          <i aria-hidden="true" />
        </span>
        <span className="selection-capture-page">{props.selection.pageIndex + 1}</span>
      </div>

      <div className="selection-capture-actions" role="group" aria-label="PDF selection actions">
        <button className="capture-action-primary" onClick={props.onSaveSource} title="Save source selection"><InstrumentGlyph name="trace" /><span>Save</span></button>
        <button onClick={props.onCopy} title="Copy with source"><InstrumentGlyph name="copy" /><span>Copy</span></button>
      </div>

      <button className="selection-capture-close" onClick={props.onDismiss} aria-label="Dismiss selection" title="Dismiss"><InstrumentGlyph name="close" /></button>
    </section>
  );
}
