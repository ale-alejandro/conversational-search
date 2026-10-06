"use client";

import { useState } from "react";
import { AppearancePanel } from "./appearance-panel";
import { FloatingSparkleTrigger } from "./floating-sparkle-trigger";
import {
  DEFAULT_APPEARANCE,
  resolveIconColor,
  type AppearanceState,
} from "./types";

export default function ConversationalSearchSurface() {
  const [state, setState] = useState<AppearanceState>(DEFAULT_APPEARANCE);

  return (
    <main className="flex flex-1 justify-center bg-white px-6 py-8">
      <div className="flex w-full max-w-[448px] flex-col gap-6">
        {/* The button itself, repainting live as the controls below change. */}
        <div className="flex justify-center">
          <FloatingSparkleTrigger
            bgColors={state.bgColors}
            gradientAngle={state.gradientAngle}
            gradientMode={state.gradientMode}
            meshPoints={state.meshPoints}
            iconImage={state.iconImage}
            iconColor={resolveIconColor(state)}
          />
        </div>
        <AppearancePanel state={state} setState={setState} />
      </div>
    </main>
  );
}
