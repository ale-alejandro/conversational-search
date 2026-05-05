"use client";

/*
 * Surface switcher.
 *
 * Each entry in `surfaces` is one of the "frames" / "comps" you brought
 * over from the design tool. The switcher in the top bar lets reviewers
 * click through them in one demo. Replace the placeholder components
 * with your actual frame compositions from
 * `src/components/<your-prototype-name>/`.
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Surface = {
  id: string;
  label: string;
  render: () => React.ReactNode;
};

const surfaces: Surface[] = [
  {
    id: "frame-1",
    label: "Frame 1",
    render: () => (
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>First surface</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Replace this with your first Pencil frame composition.
        </CardContent>
      </Card>
    ),
  },
  {
    id: "frame-2",
    label: "Frame 2",
    render: () => (
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Second surface</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add as many surfaces as you have frames in scope.
        </CardContent>
      </Card>
    ),
  },
];

export default function Home() {
  const [active, setActive] = useState(surfaces[0].id);
  const current = surfaces.find((s) => s.id === active) ?? surfaces[0];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <header className="flex items-center gap-2 px-6 py-3 border-b">
        <span className="text-sm font-medium mr-2">Surfaces</span>
        {surfaces.map((s) => (
          <Button
            key={s.id}
            variant={s.id === active ? "default" : "ghost"}
            size="sm"
            onClick={() => setActive(s.id)}
          >
            {s.label}
          </Button>
        ))}
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        {current.render()}
      </main>
    </div>
  );
}
