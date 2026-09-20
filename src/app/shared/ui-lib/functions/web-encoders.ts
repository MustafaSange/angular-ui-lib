export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';

  bytes.forEach(b => {
    binary += String.fromCharCode(b);
  });

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function base64UrlDecode(value: string): Uint8Array {
  let base64 = value
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  while (base64.length % 4) {
    base64 += '=';
  }

  return Uint8Array.from(
    atob(base64),
    c => c.charCodeAt(0)
  );
}
