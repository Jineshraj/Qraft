import React, { useState, useRef, useEffect } from "react";
import { DEFAULT_STATE, useQraftState } from "../hooks/useQraftState";
import { buildUPIString, encodeShareParams } from "../core/upi";
import { downloadPNG, downloadJPG, printLabel } from "../utils/dom-export";
import { contrastRatio } from "../utils/contrast";
import QraftWidget from "./QraftWidget";
import TopBar from "./TopBar";
import Footer from "./Footer";
import ContrastWarning from "./ContrastWarning";
import {
  Field,
  Input,
  NavButtons,
  FrameIcon,
  Spinner,
  DownIcon,
  PrintIcon,
  ShareIcon,
} from "./AppControls";
import { PRESETS, FRAMES, SIZES, STEPS } from "../constants/appConfig";
import { styles as s } from "../styles/appStyles";

// Root app orchestrator: state, handlers, layout, and step panels.
export default function QraftStudio({ defaultValue, value, onChange }) {
  // Generator state (UPI details, branding, colors, sizing, etc.)
  const { state, update, updateMany, reset } = useQraftState(defaultValue);
  const isControlled = value !== undefined;
  const studioState = isControlled ? value : state;
  const setPartial = (partial) => {
    if (isControlled) {
      const next = { ...studioState, ...partial };
      if (onChange) onChange(next);
      return;
    }
    updateMany(partial);
  };
  const setField = (key, val) => setPartial({ [key]: val });
  const resetAll = () => {
    if (isControlled) {
      if (onChange) onChange({ ...DEFAULT_STATE });
      return;
    }
    reset();
  };
  // Current step index in the wizard.
  const [step, setStep] = useState(0);
  // Disables export buttons while an export is in progress.
  const [exporting, setExporting] = useState(false);
  // Temporary toast message for share action.
  const [shareMsg, setShareMsg] = useState("");
  // Toggle for larger preview canvas.
  const [previewBig, setPreviewBig] = useState(false);
  // Responsive flags driven by matchMedia.
  const [isMobile, setIsMobile] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  // Hidden file input for logo upload.
  const logoRef = useRef();

  // Track viewport width to adjust layout and spacing on mobile.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 980px)");
    const mqN = window.matchMedia("(max-width: 640px)");
    const updateMq = () => {
      setIsMobile(mq.matches);
      setIsNarrow(mqN.matches);
    };
    updateMq();
    if (mq.addEventListener) {
      mq.addEventListener("change", updateMq);
      mqN.addEventListener("change", updateMq);
      return () => {
        mq.removeEventListener("change", updateMq);
        mqN.removeEventListener("change", updateMq);
      };
    }
    mq.addListener(updateMq);
    mqN.addListener(updateMq);
    return () => {
      mq.removeListener(updateMq);
      mqN.removeListener(updateMq);
    };
  }, []);

  // Read the logo file into a data URL stored in state.
  function handleLogo(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setField("logoDataUrl", ev.target.result);
    reader.readAsDataURL(file);
  }

  // Wrap export calls to show a loading state.
  async function handleExport(fn) {
    setExporting(true);
    try {
      await fn();
    } finally {
      setExporting(false);
    }
  }

  // Build a share URL from the current state and copy to clipboard.
  function handleShare() {
    const params = encodeShareParams(studioState);
    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setShareMsg("Copied!");
        setTimeout(() => setShareMsg(""), 2200);
      })
      .catch(() => {
        setShareMsg("Failed");
        setTimeout(() => setShareMsg(""), 2000);
      });
  }

  // Derived values used across the UI.
  const upiStr = buildUPIString(studioState);
  const isUPIValid = studioState.upiId.includes("@") && studioState.payee.length > 0;
  const qrContrast = contrastRatio(studioState.qrColor, "#ffffff");
  const isQrContrastLow = qrContrast < 3;

  // Responsive style overrides.
  const rootStyle = isMobile
    ? { ...s.root, height: "auto", minHeight: "100dvh", overflow: "auto" }
    : s.root;
  const topbarStyle = isMobile
    ? {
        ...s.topbar,
        height: "auto",
        padding: "12px 14px",
        flexDirection: "column",
        alignItems: "stretch",
        rowGap: 10,
      }
    : s.topbar;
  const brandStyle = isMobile
    ? { ...s.brand, order: 1, width: "100%", justifyContent: "space-between" }
    : s.brand;
  const stepsStyle = isMobile
    ? {
        ...s.steps,
        order: 2,
        width: "100%",
        justifyContent: "flex-start",
        overflowX: "auto",
        paddingBottom: 4,
        flex: "none",
      }
    : s.steps;
  const resetStyle = isMobile
    ? { ...s.resetBtn, alignSelf: "center" }
    : s.resetBtn;
  const layoutStyle = isMobile
    ? {
        ...s.layout,
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto auto",
        overflow: "visible",
      }
    : s.layout;
  const formColStyle = isMobile
    ? {
        ...s.formCol,
        borderRight: "none",
        borderBottom: "1px solid var(--border)",
      }
    : s.formCol;
  const formScrollStyle = isMobile
    ? { ...s.formScroll, overflowY: "visible" }
    : s.formScroll;
  const stepPanelStyle = isNarrow
    ? { ...s.stepPanel, padding: "20px 16px 32px" }
    : s.stepPanel;
  const stepTitleStyle = isNarrow
    ? { ...s.stepTitle, fontSize: 20 }
    : s.stepTitle;
  const previewInnerStyle = isNarrow
    ? { ...s.previewInner, padding: 16 }
    : s.previewInner;
  const previewCanvasStyle = {
    ...s.previewCanvas,
    ...(previewBig ? s.previewCanvasBig : {}),
    ...(isMobile ? { padding: previewBig ? 22 : 16 } : {}),
  };
  const exportRowStyle = isNarrow
    ? { ...s.exportRow, flexWrap: "wrap" }
    : s.exportRow;
  const expBtnStyle = isNarrow
    ? { ...s.expBtn, flex: "1 1 calc(50% - 8px)", justifyContent: "center" }
    : s.expBtn;
  const expPrimaryStyle = isNarrow
    ? { ...s.expPrimary, flex: "1 1 calc(50% - 8px)", justifyContent: "center" }
    : s.expPrimary;
  const stepBtnStyle = isNarrow
    ? { ...s.stepBtn, padding: "6px 12px", fontSize: 12, minWidth: 88 }
    : s.stepBtn;

  return (
    <div style={rootStyle}>
      {/* Top navigation */}
      <TopBar
        step={step}
        setStep={setStep}
        reset={resetAll}
        steps={STEPS}
        stepBtnStyle={stepBtnStyle}
        stepsStyle={stepsStyle}
        brandStyle={brandStyle}
        resetStyle={resetStyle}
        topbarStyle={topbarStyle}
      />

      {/* Main two-column layout (form + preview) */}
      <div style={layoutStyle}>
        {/* Left column: step panels */}
        <div style={formColStyle}>
          <div style={formScrollStyle}>
            {/* Step 1: Payment */}
            {step === 0 && (
              <div style={stepPanelStyle}>
                <div style={s.stepHeader}>
                  <h2 style={stepTitleStyle}>Payment Details</h2>
                  <p style={s.stepSub}>
                    Your UPI info that gets encoded into the QR
                  </p>
                </div>

                <Field label="UPI ID" hint="e.g. name@okicici" required>
                  <Input
                    value={studioState.upiId}
                    onChange={(v) => setField("upiId", v)}
                    placeholder="yourname@upi"
                    mono
                    valid={studioState.upiId.includes("@")}
                  />
                </Field>

                <Field label="Payee Name" required>
                  <Input
                    value={studioState.payee}
                    onChange={(v) => setField("payee", v)}
                    placeholder="Your name or business"
                  />
                </Field>

                <Field
                  label="Fixed Amount"
                  hint="Leave blank to let payer enter amount"
                >
                  <div style={{ position: "relative" }}>
                    <span style={s.rupeePrefix}>?</span>
                    <Input
                      value={studioState.amount}
                      onChange={(v) => setField("amount", v)}
                      placeholder="0.00"
                      type="number"
                      style={{ paddingLeft: 32 }}
                    />
                  </div>
                </Field>

                <Field label="Payment Note" hint="Shown to payer on UPI app">
                  <Input
                    value={studioState.note}
                    onChange={(v) => setField("note", v)}
                    placeholder="e.g. Thanks for your order!"
                  />
                </Field>

                {isUPIValid && (
                  <div style={s.upiPill}>
                    <span style={s.upiPillDot} />
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: "var(--accent)",
                        wordBreak: "break-all",
                      }}
                    >
                      {upiStr.slice(0, 72)}
                      {upiStr.length > 72 ? "..." : ""}
                    </span>
                  </div>
                )}

                <NavButtons
                  step={step}
                  setStep={setStep}
                  canNext={isUPIValid}
                />
              </div>
            )}

            {/* Step 2: Branding */}
            {step === 1 && (
              <div style={stepPanelStyle}>
                <div style={s.stepHeader}>
                  <h2 style={stepTitleStyle}>Branding</h2>
                  <p style={s.stepSub}>
                    Add your business identity to the label
                  </p>
                </div>

                <Field label="Business Name">
                  <Input
                    value={studioState.bizName}
                    onChange={(v) => setField("bizName", v)}
                    placeholder="Your shop or brand"
                  />
                </Field>

                <Field label="Tagline" hint="Short - punchy - optional">
                  <Input
                    value={studioState.tagline}
                    onChange={(v) => setField("tagline", v)}
                    placeholder="Fresh - Local - Trusted"
                  />
                </Field>

                <Field label="Logo">
                  <div style={s.logoArea}>
                    {studioState.logoDataUrl ? (
                      <div style={s.logoPreviewWrap}>
                        <img
                          src={studioState.logoDataUrl}
                          style={s.logoImg}
                          alt="logo"
                        />
                        <div style={s.logoMeta}>
                          <span style={{ color: "var(--text)", fontSize: 13 }}>
                            Logo uploaded
                          </span>
                          <button
                            style={s.removeBtn}
                            onClick={() => setField("logoDataUrl", null)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        style={s.uploadZone}
                        onClick={() => logoRef.current.click()}
                      >
                        <span style={{ fontSize: 28, opacity: 0.4 }}>+</span>
                        <span style={{ fontSize: 13, color: "var(--text-2)" }}>
                          Click to upload PNG / JPG
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-3)" }}>
                          Best: square, transparent bg
                        </span>
                      </button>
                    )}
                    <input
                      ref={logoRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleLogo}
                    />
                  </div>
                </Field>

                <NavButtons step={step} setStep={setStep} canNext={true} />
              </div>
            )}

            {/* Step 3: Design */}
            {step === 2 && (
              <div style={stepPanelStyle}>
                <div style={s.stepHeader}>
                  <h2 style={stepTitleStyle}>Design</h2>
                  <p style={s.stepSub}>Colours, frame style and label size</p>
                </div>

                <Field label="Colour Theme">
                  <div style={s.presetsGrid}>
                    {PRESETS.map((p) => (
                      <button
                        key={p.name}
                        style={{
                          ...s.presetDot,
                          background: p.primary,
                          ...(studioState.primaryColor === p.primary
                            ? s.presetActive
                            : {}),
                        }}
                        onClick={() =>
                          setPartial({
                            primaryColor: p.primary,
                            bgColor: p.bg,
                            textColor: p.text,
                            qrColor: p.qr,
                          })
                        }
                        title={p.name}
                      />
                    ))}
                  </div>
                </Field>

                <Field label="Custom Colours">
                  <div style={s.colorRow}>
                    {[
                      { key: "primaryColor", label: "Accent" },
                      { key: "bgColor", label: "Background" },
                      { key: "textColor", label: "Text" },
                      { key: "qrColor", label: "QR" },
                    ].map(({ key, label }) => (
                      <label key={key} style={s.colorPill} title={label}>
                        <input
                          type="color"
                          value={studioState[key]}
                          onChange={(e) => setField(key, e.target.value)}
                          style={s.colorInput}
                        />
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--text-3)",
                            marginTop: 2,
                          }}
                        >
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </Field>

                <ContrastWarning show={isQrContrastLow} />

                <Field label="Frame Style">
                  <div style={s.framesGrid}>
                    {FRAMES.map((f) => (
                      <button
                        key={f.id}
                        style={{
                          ...s.frameBtn,
                          ...(studioState.frame === f.id ? s.frameBtnActive : {}),
                        }}
                        onClick={() => setField("frame", f.id)}
                      >
                        <FrameIcon
                          id={f.id}
                          color={
                            studioState.frame === f.id
                              ? "var(--accent)"
                              : "var(--text-3)"
                          }
                        />
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 500,
                            color:
                              state.frame === f.id
                                ? "var(--accent)"
                                : "var(--text)",
                          }}
                        >
                          {f.label}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--text-3)" }}>
                          {f.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Label Size">
                  <div style={s.sizeRow}>
                    {SIZES.map((sz) => (
                      <button
                        key={sz.id}
                        style={{
                          ...s.sizeBtn,
                          ...(studioState.size === sz.id ? s.sizeBtnActive : {}),
                        }}
                        onClick={() => setField("size", sz.id)}
                      >
                        <span style={{ fontSize: 16, fontWeight: 700 }}>
                          {sz.label}
                        </span>
                        <span
                          style={{
                            fontSize: 9,
                            color: "var(--text-3)",
                            fontFamily: "var(--mono)",
                          }}
                        >
                          {sz.w}px
                        </span>
                      </button>
                    ))}
                  </div>
                </Field>

                <NavButtons step={step} setStep={setStep} canNext={true} last />
              </div>
            )}
          </div>
        </div>

        {/* Right column: live preview and export actions */}
        <div style={s.previewCol}>
          <div style={previewInnerStyle}>
            {/* Preview header */}
            <div style={s.previewTopRow}>
              <span style={s.previewLabel}>
                <span style={s.liveDot} />
                Live preview
              </span>
              <button
                style={s.expandBtn}
                onClick={() => setPreviewBig((b) => !b)}
              >
                {previewBig ? "Fit" : "Expand"}
              </button>
            </div>

            {/* Label canvas */}
            <div style={previewCanvasStyle}>
              <QraftWidget
                upiId={studioState.upiId}
                payeeName={studioState.payee}
                amount={studioState.amount}
                transactionNote={studioState.note}
                bizName={studioState.bizName}
                tagline={studioState.tagline}
                logoUrl={studioState.logoDataUrl}
                primaryColor={studioState.primaryColor}
                bgColor={studioState.bgColor}
                textColor={studioState.textColor}
                qrColor={studioState.qrColor}
                frame={studioState.frame}
                size={studioState.size}
              />
            </div>

            {/* Export actions */}
            <div style={exportRowStyle}>
              <button
                style={{ ...expBtnStyle, ...expPrimaryStyle }}
                onClick={() => handleExport(downloadPNG)}
                disabled={exporting}
              >
                {exporting ? <Spinner /> : <DownIcon />}
                PNG
              </button>
              <button
                style={expBtnStyle}
                onClick={() => handleExport(downloadJPG)}
                disabled={exporting}
              >
                <DownIcon /> JPG
              </button>
              <button style={expBtnStyle} onClick={printLabel}>
                <PrintIcon /> Print
              </button>
              <button style={expBtnStyle} onClick={handleShare}>
                <ShareIcon />
                {shareMsg || "Share"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* App footer disclaimer */}
      <Footer />
    </div>
  );
}
