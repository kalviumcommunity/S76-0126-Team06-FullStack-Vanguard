"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Zap } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      if (session.user.role === 'MENTOR') {
        router.push('/dashboard/mentor');
      } else {
        router.push('/dashboard/student');
      }
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center animate-pulse">
            <Zap className="h-8 w-8 text-emerald-500 fill-emerald-500" />
          </div>
          <div className="absolute inset-0 h-16 w-16 rounded-2xl border-2 border-emerald-500/50 animate-ping"></div>
        </div>
        <p className="text-emerald-500/80 font-medium tracking-widest text-xs uppercase animate-pulse">
          Loading Vanguard...
        </p>
      </div>
    </div>
  );
}