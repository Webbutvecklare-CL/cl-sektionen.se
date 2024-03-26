export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";path=/;domain=" + window.location.hostname;
}

export function getCookie(name) {
  const decodedCookieData = decodeURIComponent(document.cookie);
  const allCookies = decodedCookieData.split(";");
  for (const cookie of allCookies) {
    const [cookieName, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}
