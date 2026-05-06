import type { ReactNode } from 'react';

interface ExplanationBoxProps {
  title: string;
  children: ReactNode;
}

export function ExplanationBox({ title, children }: ExplanationBoxProps) {
  return (
    <div className="explanation-box">
      <div className="explanation-title">{title}</div>
      <p>{children}</p>
    </div>
  );
}
