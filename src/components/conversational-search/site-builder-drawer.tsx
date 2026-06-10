"use client";

const items = [
  "Getting Started",
  "Layouts",
  "Pages",
  "Navigational Links",
  "Header",
  "Footer",
  "Custom Code",
  "My Support/FAQ",
  "Featured Item",
];

export function SiteBuilderDrawer() {
  return (
    <div className="bg-white flex shrink-0 w-[235px] border-r border-[#e5e5e5]">
      <div className="flex flex-col flex-1 min-w-0">
        <div className="px-4 pt-5 pb-2">
          <h2 className="font-bold text-base text-[#262626]">Site Builder</h2>
        </div>
        <nav className="flex flex-col gap-2 px-4 py-2 flex-1">
          {items.map((label) => (
            <button
              key={label}
              type="button"
              className="flex items-center text-left p-2 rounded font-bold text-sm text-[#262626] hover:bg-[#f1f5f9] transition-colors"
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="flex items-center text-left p-2 rounded font-bold text-sm bg-[#2864f6] text-white"
          >
            Conversational Search
          </button>
        </nav>
      </div>
    </div>
  );
}
