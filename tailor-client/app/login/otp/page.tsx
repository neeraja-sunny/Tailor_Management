// app/login/otp/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import OtpClient from "./OtpClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OtpClient />
    </Suspense>
  );
}

