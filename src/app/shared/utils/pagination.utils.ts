// angular stuff
import { WritableSignal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

export function updatePageSettings(
  event: PageEvent,
  pageSizeSig: WritableSignal<number>,
  currentPageSig: WritableSignal<number>
): void {
  pageSizeSig.update(() => event.pageSize);
  currentPageSig.update(() => event.pageIndex);
}

export function resetPageSettings(
  pageSizeSig: WritableSignal<number>,
  currentPageSig: WritableSignal<number>,
  pageSizeValue: number
): void {
  pageSizeSig() !== pageSizeValue && pageSizeSig.update(() => pageSizeValue);
  currentPageSig() !== 0 && currentPageSig.update(() => 0);
}
