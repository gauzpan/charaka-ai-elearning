import "server-only";
import { OAuth2Client } from "google-auth-library";

// Manual Google OAuth 2.0 authorization-code flow — no NextAuth/Clerk, kept
// consistent with the hand-rolled session in lib/auth.ts. google-auth-library
// is Google's own SDK, used only to exchange the code and verify the ID
// token's signature; it's not an auth framework.

function clientId(): string {
  const id = process.env.GOOGLE_CLIENT_ID;
  if (!id) throw new Error("GOOGLE_CLIENT_ID is not set");
  return id;
}

function clientSecret(): string {
  const s = process.env.GOOGLE_CLIENT_SECRET;
  if (!s) throw new Error("GOOGLE_CLIENT_SECRET is not set");
  return s;
}

function redirectUri(): string {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${origin}/api/auth/google/callback`;
}

function client(): OAuth2Client {
  return new OAuth2Client(clientId(), clientSecret(), redirectUri());
}

/** Builds the URL to send the browser to for Google's consent screen. */
export function buildGoogleAuthUrl(params: { state: string }): string {
  return client().generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email"],
    state: params.state,
    prompt: "select_account",
  });
}

/** Exchanges the authorization code and verifies the ID token. Returns the verified identity. */
export async function exchangeGoogleCode(
  code: string,
): Promise<{ googleId: string; email: string | null }> {
  const oauth2 = client();
  const { tokens } = await oauth2.getToken(code);
  if (!tokens.id_token) throw new Error("Google did not return an id_token");

  const ticket = await oauth2.verifyIdToken({
    idToken: tokens.id_token,
    audience: clientId(),
  });
  const payload = ticket.getPayload();
  if (!payload?.sub) throw new Error("Google id_token missing subject");

  return {
    googleId: payload.sub,
    email: payload.email_verified ? payload.email ?? null : null,
  };
}
