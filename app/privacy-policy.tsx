import PolicyWebView from "../components/ui/policy-webview";

// Replace this URL with your actual privacy policy URL when you have it
const PRIVACY_POLICY_URL = "https://chrima-web.vercel.app/in-app/privacy-policy";

export default function PrivacyPolicyScreen() {
  return <PolicyWebView url={PRIVACY_POLICY_URL} />;
}
