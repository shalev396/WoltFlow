// ============================================================================
// FORWARD TYPES
// ============================================================================
// Types related to API key generation and SMS forwarding functionality

export interface ApiKeyResponse {
  apiKey: string;
}

export interface ForwardService {
  generateApiKey(): Promise<string>;
}
