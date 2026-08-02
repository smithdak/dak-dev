import { useId } from 'react';

import { CodeBlockEnhancer } from './CodeBlockEnhancer';

export function CodeBlockWrapper({ children }: { children: React.ReactNode }) {
  const rootId = useId();

  return (
    <div id={rootId}>
      {children}
      <CodeBlockEnhancer rootId={rootId} />
    </div>
  );
}
