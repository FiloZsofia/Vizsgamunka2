export function extractJWT(tokenString) {
  const parts = tokenString.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  } else {
    console.error("Invalid token format");
    return null;
  }
}

export function parseJwt(token) {
  const [headerEncoded, payloadEncoded, signature] = token.split(".");

  const decodeBase64 = (str) => {
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    return JSON.parse(decoded);
  };

  const header = decodeBase64(headerEncoded);
  const payload = decodeBase64(payloadEncoded);

  return {
    header,
    payload,
    signature,
  };
}
