import nextDynamic from "next/dynamic";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

const AdminLoginForm = nextDynamic(() => import("./LoginForm"), { ssr: false });

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="container py-16 flex justify-center">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
