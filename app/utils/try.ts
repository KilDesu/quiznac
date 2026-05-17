export async function tryAsync<T>(
  toTry: Promise<T>,
  failMsg: string | ((e: unknown) => string),
): Promise<T> {
  try {
    return await toTry;
  } catch (err: unknown) {
    if (typeof failMsg === "string") {
      throw failMsg;
    } else {
      throw failMsg(err);
    }
  }
}
