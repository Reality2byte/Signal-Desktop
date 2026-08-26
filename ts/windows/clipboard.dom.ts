// Copyright 2025 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { clipboard } from 'electron';
import { drop } from '../util/drop.std.ts';

let doesClipboardNeedClearing = false;

function clearClipboard(): void {
  clipboard.clear();

  // clipboard.clear is not reliable on Linux, so we actually have to overwrite it
  if (window.Signal.OS.isLinux()) {
    drop(clipboard.writeText(' '));
  }

  doesClipboardNeedClearing = false;
}

function clearClipboardIfNeeded(): void {
  if (doesClipboardNeedClearing) {
    clearClipboard();
  }
}

function copyTextTemporarily(text: string, clearAfterMs: number): void {
  drop(clipboard.writeText(text));
  doesClipboardNeedClearing = true;

  setTimeout(() => clearClipboard(), clearAfterMs);
}

window.SignalClipboard = {
  clearIfNeeded: clearClipboardIfNeeded,
  clear: clearClipboard,
  copyTextTemporarily,
};
