import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import {
  PDFViewer,
  type PDFViewerRef,
  type PluginRegistry,
} from "@embedpdf/react-pdf-viewer";
import type { RegistryLike } from "./viewerBridge";

type EmbedPdfReaderProps = {
  onReady?: (registry: RegistryLike) => void;
  style?: CSSProperties;
};

export const EmbedPdfReader = forwardRef<any, EmbedPdfReaderProps>(
  function EmbedPdfReader({ onReady, style }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);
    const viewerRef = useRef<PDFViewerRef>(null);
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

    useLayoutEffect(() => {
      const host = hostRef.current;
      if (!host) return;
      setShadowRoot(host.shadowRoot ?? host.attachShadow({ mode: "open" }));
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        get container() {
          return viewerRef.current?.container ?? null;
        },
        get registry() {
          return viewerRef.current?.registry ?? null;
        },
      }),
      [],
    );

    const handleReady = (registry: PluginRegistry) => {
      (window as any).__catalystEmbedPdfRegistry = registry;
      onReady?.(registry as unknown as RegistryLike);
    };

    return (
      <div
        className="embedpdf-reader"
        style={{
          ...style,
          width: "100%",
          height: "100%",
          minWidth: 0,
          minHeight: 0,
          position: "relative",
        }}
      >
        <div
          ref={hostRef}
          data-catalyst-embedpdf-shadow-host="true"
          style={{ width: "100%", height: "100%", minWidth: 0, minHeight: 0, display: "block" }}
        />

        {shadowRoot && createPortal(
          <>
            <style>{`:host { display:block; width:100%; height:100%; min-width:0; min-height:0; } .catalyst-embedpdf-shadow-root { width:100%; height:100%; min-width:0; min-height:0; }`}</style>
            <div className="catalyst-embedpdf-shadow-root">
              <PDFViewer
                ref={viewerRef}
                onReady={handleReady}
                config={{
                  documentManager: {
                    initialDocuments: [],
                    maxDocuments: 8,
                  },
                  annotations: {
                    annotationAuthor: "Catalyst",
                    autoCommit: true,
                    selectAfterCreate: true,
                    colorPresets: [
                      "#F2D76B",
                      "#9FC5F8",
                      "#A8D5BA",
                      "#F4A7A3",
                      "#D2B4E8",
                    ],
                    autoOpenLinks: false,
                  },
                  export: {
                    defaultFileName: "catalyst-annotated.pdf",
                  },
                  tabBar: "never",
                  disabledCategories: [
                    "redaction",
                    "form",
                    "insert",
                    "stamp",
                    "document-protect",
                    "document-print",
                  ],
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </>,
          shadowRoot,
        )}

      </div>
    );
  },
);
