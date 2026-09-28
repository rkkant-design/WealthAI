import React from 'react';
import { FlaskConical } from 'lucide-react';

/*
 * Honest labelling for sections that still show fixed illustrative data rather
 * than live or user-specific data. Use the banner above a section and the
 * badge inline next to a heading. Remove them once a section is wired to a
 * real source.
 */

interface SampleDataNoticeProps {
  children?: React.ReactNode;
  className?: string;
}

export const SampleDataNotice: React.FC<SampleDataNoticeProps> = ({ children, className = '' }) => (
  <div
    role="note"
    className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[13px] leading-snug ${className}`}
  >
    <FlaskConical className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
    <p>
      <strong className="font-semibold text-amber-300">Sample data, not live.</strong>{' '}
      {children || 'These figures are fixed examples to show how this section works. They are not updated and are not investment advice.'}
    </p>
  </div>
);

export const SampleBadge: React.FC = () => (
  <span
    title="Fixed example data. Not live and not updated."
    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30"
  >
    <FlaskConical className="h-3 w-3" />
    Sample
  </span>
);
