'use client';

import { Button } from '@/components/ds';

export function PrintButton() {
  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      className="ww-print-btn screen-only"
      onClick={() => window.print()}
    >
      Imprimir
    </Button>
  );
}
