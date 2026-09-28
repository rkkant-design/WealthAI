import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useWealth } from '../context/WealthContext';
import { findPage } from '../navigation';

// Slim "you are here" bar above every page: section › page, plus a one-line
// plain-English description of what the page is for.
export const PageBreadcrumb: React.FC = () => {
  const { activeTab, setActiveTab } = useWealth();
  const found = findPage(activeTab);
  if (!found) return null;

  const { page, section } = found;
  const Icon = page.icon;

  return (
    <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
        {page.id !== 'dashboard' && (
          <>
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
              Dashboard
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-slate-500">{section.title}</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          </>
        )}
        <span className="flex items-center gap-1.5 font-semibold text-white">
          <Icon className="h-4 w-4 text-blue-400" />
          {page.label}
        </span>
      </nav>
      <span className="hidden sm:inline text-slate-700">|</span>
      <p className="text-slate-400 text-[13px]">{page.description}</p>
    </div>
  );
};
