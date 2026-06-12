const LOADING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Loading PDF...</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
      color: #0a2540;
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <p>Loading your PDF...</p>
</body>
</html>`;

/** Open a tab synchronously during a click/submit handler (before any await). */
export function preparePdfTab(): Window | null {
  const popup = window.open("", "_blank");
  if (!popup) {
    return null;
  }

  try {
    popup.document.open();
    popup.document.write(LOADING_HTML);
    popup.document.close();
  } catch {
    // Popup may already be navigating; continue and set location below.
  }

  return popup;
}

export function navigatePdfTab(popup: Window | null, url: string): boolean {
  if (!popup || popup.closed) {
    return false;
  }

  try {
    popup.location.replace(url);
    return true;
  } catch {
    try {
      popup.close();
    } catch {
      // ignore
    }
    return false;
  }
}

export function closePdfTab(popup: Window | null): void {
  if (!popup || popup.closed) {
    return;
  }

  try {
    popup.close();
  } catch {
    // ignore
  }
}
