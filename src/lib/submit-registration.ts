export type RegistrationPayload = {
  name: string;
  email: string;
  whatsapp: string;
  discord: string;
  keyboardCount: number;
  receiptName: string | null;
};

/**
 * v1: UI-only. Swap this function for a Server Action (database + blob
 * storage) without rewriting the register page.
 */
export async function submitRegistration(
  payload: RegistrationPayload,
): Promise<{ ok: true }> {
  void payload;
  await Promise.resolve();
  return { ok: true };
}
