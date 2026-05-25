import api from './backendConnection';
import { getStoredAuthToken, decodeJwtPayload } from '../utils/authToken';
import { signAiRequest } from '../utils/aiSigning';

let _signingKey = null;

async function getSigningKey() {
  if (_signingKey) return _signingKey;
  const res = await api.get('ai/signing_key.php');
  if (res.data && res.data.status === 'success') {
    _signingKey = res.data.data.signing_key;
    return _signingKey;
  }
  throw new Error('Failed to load signing key');
}

async function signedPost(url, payload = {}) {
  const token = getStoredAuthToken();
  const payloadDecoded = decodeJwtPayload(token);
  const userId = payloadDecoded?.data?.id || 0;
  
  const key = await getSigningKey();
  const { signature, timestamp } = await signAiRequest(payload, userId, key);
  
  return api.post(url, payload, {
    headers: {
      'X-AI-Signature': signature,
      'X-AI-Timestamp': String(timestamp)
    }
  }).then(r => r.data);
}

const aiService = {
  /**
   * Reset session key cache on logout
   */
  clearCache: () => {
    _signingKey = null;
  },

  /**
   * Send a list of messages to the chatbot API
   * @param {Array} messages - [{ role: 'user'|'assistant', content: '...' }]
   * @returns {Promise<Object>} The API response data
   */
  sendChatMessage: (messages) => {
    return signedPost('ai/chat.php', { messages });
  },

  /**
   * Retrieve analytical insights for the logged in student
   * @param {boolean} bypassCache - Force a freshness check (skips cache, but reuses if data unchanged)
   * @returns {Promise<Object>} The API response data containing 3 cards
   */
  getStudentInsights: (bypassCache = false) => {
    return signedPost('ai/student_insights.php', { bypass_cache: bypassCache || undefined });
  },

  /**
   * Retrieve AI booking timeslots recommendations for students
   * @returns {Promise<Object>} The API response data containing recommended_slots and recommendations
   */
  getBookingRecommendations: () => {
    return signedPost('ai/booking_recommendations.php', {});
  },

  /**
   * Retrieve operational insights for the admin dashboard
   * @param {boolean} bypassCache - Force a freshness check (skips cache, but reuses if data unchanged)
   * @returns {Promise<Object>} The API response data containing 4 cards
   */
  getAdminInsights: (bypassCache = false) => {
    return signedPost('ai/admin_insights.php', { bypass_cache: bypassCache || undefined });
  },

  /**
   * Summarize a compiled usage report
   * @param {Array} records - Filtered report rows
   * @returns {Promise<Object>} The API response data containing headline, summary, and metrics
   */
  summarizeReport: (records) => {
    return signedPost('ai/report_summary.php', { records });
  },

  /**
   * Retrieve current user's remaining quota and cooldown status
   * @returns {Promise<Object>} The quota payload
   */
  getQuotaStatus: () => {
    return api.get('ai/quota_status.php').then(r => r.data);
  },

  /**
   * Fetch current AI enabled runtime status
   * @returns {Promise<Object>} The settings payload
   */
  getSettings: () => {
    return api.get('admin/ai_settings.php').then(r => r.data);
  },

  /**
   * Toggle AI enabled runtime status
   * @param {boolean} ai_enabled 
   * @returns {Promise<Object>} The updated status payload
   */
  updateSettings: (ai_enabled) => {
    return api.post('admin/ai_settings.php', { ai_enabled }).then(r => r.data);
  },

  /**
   * Fetch system-wide AI usage statistics and provider limits
   * @returns {Promise<Object>} The stats payload
   */
  getAdminDashboardStats: () => {
    return api.get('ai/admin_dashboard_stats.php').then(r => r.data);
  },

  /**
   * Retrieve behavioral cohort analysis for students
   * @returns {Promise<Object>} The cohort analysis payload
   */
  getCohortAnalysis: () => {
    return signedPost('ai/student_cohort_analysis.php', {});
  },

  /**
   * Retrieve software demand and procurement report
   * @returns {Promise<Object>} The software demand payload
   */
  getSoftwareDemand: () => {
    return signedPost('ai/software_demand_report.php', {});
  }
};

export default aiService;
