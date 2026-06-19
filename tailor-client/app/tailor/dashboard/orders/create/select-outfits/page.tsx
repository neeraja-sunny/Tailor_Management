import { Suspense } from "react";
import SelectOutfitsClient from "./SelectOutfitsClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading outfits...</div>}>
      <SelectOutfitsClient />
    </Suspense>
  );
}
