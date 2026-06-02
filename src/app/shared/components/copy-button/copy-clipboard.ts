import type { CopyClipboardResult } from './copy-button-types';

export async function copyTextToClipboard(text: string): Promise<CopyClipboardResult> {
  if (text.trim().length === 0) {
    return 'failed';
  }

  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
