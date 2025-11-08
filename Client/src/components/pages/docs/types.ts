export interface DocSubsection {
  id: string;
  title: string;
}

export interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  subsections: DocSubsection[];
}
