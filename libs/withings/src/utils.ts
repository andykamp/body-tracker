export function createFormBody(body: Record<string, any>): string {
  const formBody = [];
  for (const property in body) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(body[property as keyof typeof body]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  return formBody.join("&");
}
