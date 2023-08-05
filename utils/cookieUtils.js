export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    cname + "=" + cvalue + ";" + expires + ";path=/;domain=" + window.location.hostname;
}

export function getCookie(name) {
  let decodedCookieData = decodeURIComponent(document.cookie);
  let allCookies = decodedCookieData.split(";");
  for (let cookie of allCookies) {
    const [cookieName, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}
