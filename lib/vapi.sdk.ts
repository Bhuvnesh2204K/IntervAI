import Vapi from "@vapi-ai/web";

// Function to get the token with proper error handling
const getVapiToken = () => {
  const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
  
  if (!token) {
    console.error("NEXT_PUBLIC_VAPI_WEB_TOKEN is not configured");
    throw new Error("Vapi token is not configured");
  }
  
  return token;
};

// Initialize Vapi with token validation
let vapiInstance: Vapi | null = null;

export const getVapi = () => {
  if (!vapiInstance) {
    const token = getVapiToken();
    vapiInstance = new Vapi(token);
  }
  return vapiInstance;
};

// For backward compatibility
export const vapi = getVapi();
