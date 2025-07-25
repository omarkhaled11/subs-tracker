import PolicyWebView from "../components/ui/policy-webview";

// Replace this URL with your actual terms of service URL when you have it
const TERMS_OF_SERVICE_URL = "https://chrima-web.vercel.app/in-app/terms-of-service";

export default function TermsOfServiceScreen() {
  return <PolicyWebView url={TERMS_OF_SERVICE_URL} />;
}
