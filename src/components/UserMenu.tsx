"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Form } from "@heroui/react";
import { logout } from "@/lib/actions/auth";

export default function UserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  // temporary solution to get the first initial char of the user
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <Button
        onClick={() => setOpen((o) => !o)}
        className="w-9 h-9 bg-violet-800 text-white text-lg font-semibold flex items-center justify-center cursor-pointer select-none tracking-tighter"
      >
        <span className="-ml-0.75">{initial}</span>
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-20 w-44 rounded-lg border border-slate-700 bg-slate-900 shadow-lg overflow-hidden py-1">
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Settings
            </Link>
            <div className="h-px bg-slate-700 my-1" />
            <Form
              action={logout}
              validationBehavior="native"
              className="contents"
            >
              <button
                type="submit"
                className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Logout
              </button>
            </Form>
          </div>
        </>
      )}
    </div>
  );
}
