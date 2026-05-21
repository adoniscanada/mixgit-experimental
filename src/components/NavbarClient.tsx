"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Project = {
  id: string;
  name: string;
};

export default function NavbarClient({ projects }: { projects: Project[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col p-3 h-full">
      <Link
        href="/dashboard"
        className={`px-3 py-2 mb-2 rounded-md text-sm font-medium transition-colors ${
          pathname === "/dashboard"
            ? "bg-slate-700 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        Dashboard
      </Link>
      <Link
        href="/shared-projects"
        className={`px-3 py-2 mb-2 rounded-md text-sm font-medium transition-colors ${
          pathname === "/shared-projects"
            ? "bg-slate-700 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        Shared with me
      </Link>
      <Link
        href="/favorites"
        className={`px-3 py-2 mb-2 rounded-md text-sm font-medium transition-colors ${
          pathname === "/favorites"
            ? "bg-slate-700 text-white"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        Favorites
      </Link>

      {projects.length > 0 && (
        <div className="mt-10 border-t border-slate-700 pt-4">
          <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Recent Projects
          </p>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className={`block px-3 py-1.5 rounded-md text-sm truncate transition-colors ${
                pathname === `/projects/${p.id}`
                  ? "bg-slate-700 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {p.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex-1" />
    </nav>
  );
}
