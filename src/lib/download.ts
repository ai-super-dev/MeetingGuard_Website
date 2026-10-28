/*
 * The header's Download button goes to the store badges at the end of the
 * home page without adding "#download" to the address. On the home page it
 * scrolls there; on another page it opens the home page, which then scrolls
 * there itself (a note in sessionStorage tells it to).
 */

/** The id of the store badges section on the home page. */
export const DOWNLOAD_ID = "download";

const PENDING = "mg-go-download";

/** Scrolls to the badges if they are on this page; otherwise leaves the note for the home page. */
export function goToDownload() {
  const target = document.getElementById(DOWNLOAD_ID);
  if (target) return target.scrollIntoView();
  try {
    sessionStorage.setItem(PENDING, "1");
  } catch {}
}

/** True once if another page asked the home page to open at the badges. */
export function takePendingDownload() {
  try {
    if (!sessionStorage.getItem(PENDING)) return false;
    sessionStorage.removeItem(PENDING);
    return true;
  } catch {
    return false;
  }
}
