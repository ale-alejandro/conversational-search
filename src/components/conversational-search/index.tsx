"use client";

import { useState } from "react";
import { AdminNav } from "./admin-nav";
import { SiteBuilderDrawer } from "./site-builder-drawer";
import { AppearancePanel } from "./appearance-panel";
import { PreviewPane } from "./preview-pane";
import { DEFAULT_APPEARANCE, type AppearanceState } from "./types";

export default function ConversationalSearchSurface() {
  const [state, setState] = useState<AppearanceState>(DEFAULT_APPEARANCE);
  const [pickerKey, setPickerKey] = useState(0);

  return (
    <div className="flex flex-1 min-h-0 bg-[#f8fafc] overflow-hidden">
      <AdminNav />
      <SiteBuilderDrawer />
      <main className="flex flex-1 min-w-0">
        <AppearancePanel
          state={state}
          setState={setState}
          pickerKey={pickerKey}
          onReset={() => {
            setState(DEFAULT_APPEARANCE);
            setPickerKey((k) => k + 1);
          }}
        />
        <PreviewPane state={state} />
      </main>
    </div>
  );
}
