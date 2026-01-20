# Security & Cost Control Guide

## ✅ What's Already Implemented

### Security Measures (Active)

1. **Rate Limiting**
   - ✅ 20 requests per minute per IP address
   - ✅ Prevents rapid-fire abuse
   - ✅ Uses slowapi library

2. **IP Blocking**
   - ✅ Automatic IP blocking after 10 failed requests
   - ✅ Block duration: 1 hour
   - ✅ Tracks failed requests per IP
   - ✅ Thread-safe implementation

3. **Message Validation**
   - ✅ Maximum message length: 2000 characters
   - ✅ Prevents resource exhaustion
   - ✅ Validates input before processing

4. **Jailbreak Detection**
   - ✅ Detects prompt injection attempts
   - ✅ Monitors for hacking keywords
   - ✅ Alerts via Pushover notifications

5. **Session Management**
   - ✅ Automatic cleanup of old sessions (1 hour)
   - ✅ Limits concurrent sessions per IP (configured but not enforced yet)
   - ✅ Thread-safe session handling

6. **CORS Protection**
   - ✅ Only allowed origins can access API
   - ✅ Configurable via environment variables
   - ✅ Default includes your domains

7. **Path Traversal Protection**
   - ✅ Prevents accessing files outside knowledge base
   - ✅ Validates file paths before serving

8. **API Key Security**
   - ✅ Keys stored in environment variables only
   - ✅ Never exposed in frontend or logs
   - ✅ Server-side only access

---

## ⚠️ What Needs to Be Done

### Critical: Google Cloud Billing Protection

**Action Required:** Set up billing alerts and quotas in Google Cloud Console.

#### 1. Set Up Billing Budget Alerts

1. Go to: https://console.cloud.google.com/billing
2. Select your billing account
3. Navigate to **Budgets & alerts**
4. Click **"Create Budget"**
5. Configure:
   - **Amount**: Set your monthly budget (e.g., $10, $20, $50)
   - **Alert Thresholds**: 
     - Alert at 50% of budget
     - Alert at 90% of budget
     - Alert at 100% of budget
   - **Notifications**: Add your email address
6. Save

**Why this matters:** You'll get email alerts if costs spike unexpectedly.

#### 2. Set Up API Quotas (Important for Cost Control)

1. Go to: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
2. Find **Quota name**: `Requests per minute` or `Requests per day`
3. Click **Edit Quotas** (if available)
4. Set daily request limit (if available)
5. Note: Google may not allow quota edits, but check anyway

**Alternative:** Set up API usage monitoring:
1. Go to: https://console.cloud.google.com/apis/dashboard
2. Select **Generative Language API**
3. Go to **Quotas** tab
4. Monitor usage daily

#### 3. Enable Billing Alerts

1. Go to: https://console.cloud.google.com/billing
2. Select your billing account
3. Go to **Budgets & alerts**
4. Click **Create Alert Rule**
5. Configure:
   - **Threshold**: $5, $10, $20, etc. (your choice)
   - **Notification**: Email alerts
6. Save

---

### Recommended: Additional Code-Level Protections

These can be added to further protect your API costs:

#### 1. Daily API Usage Limits

**Implementation needed:** Track daily API calls per IP and enforce limits.

**Why:** Prevents a single user from using all your API quota.

#### 2. Request Size Limits (Tokens)

**Implementation needed:** Limit input token count before sending to Gemini.

**Why:** Larger requests cost more. Limiting input tokens controls costs.

#### 3. Concurrent Request Limits

**Implementation needed:** Enforce `MAX_SESSIONS_PER_IP` limit (currently defined but not enforced).

**Why:** Prevents multiple concurrent requests from the same IP.

#### 4. Cost Per Request Tracking

**Implementation needed:** Log approximate costs per request for monitoring.

**Why:** Helps identify expensive requests or patterns.

---

## 🛡️ Additional Security Recommendations

### 1. Cloudflare (Free Tier)

**Action:** Consider adding Cloudflare in front of your domain.

**Benefits:**
- ✅ Free DDOS protection
- ✅ Free SSL (redundancy)
- ✅ Rate limiting at edge (extra layer)
- ✅ Bot detection
- ✅ Analytics

**Setup:**
1. Sign up at https://www.cloudflare.com (free tier)
2. Add your domain `ppaltsokas.com`
3. Update nameservers in Namecheap
4. Enable security features

### 2. Google Cloud API Usage Monitoring

**Action:** Set up monitoring dashboard.

1. Go to: https://console.cloud.google.com/monitoring
2. Create custom dashboard for API usage
3. Set up alerts for unusual spikes

### 3. Railway Usage Monitoring

**Action:** Monitor Railway usage to avoid overages.

1. Go to Railway Dashboard
2. Check usage tab regularly
3. Set up alerts if available

---

## 💰 Cost Estimation & Budget Planning

### Gemini API Pricing (As of 2024)

- **Gemini 2.5 Flash**: ~$0.10 per 1M input tokens, ~$0.40 per 1M output tokens
- **Average request**: ~1,000-5,000 tokens (input + output)
- **Cost per request**: ~$0.0001 - $0.0005 (very cheap!)

### Rough Cost Estimates

- **100 requests/day**: ~$0.01 - $0.05 per day = ~$0.30 - $1.50/month
- **1,000 requests/day**: ~$0.10 - $0.50 per day = ~$3 - $15/month
- **10,000 requests/day**: ~$1 - $5 per day = ~$30 - $150/month

**Note:** Your rate limiting (20/min) = max 28,800 requests/day if abused
- With rate limiting: Should be much lower
- Typical usage: 10-100 requests/day = very low cost

---

## 📋 Action Items Checklist

### Immediate (Do Today)

- [ ] **Set up Google Cloud billing budget** ($10-50/month recommended)
- [ ] **Enable billing alerts** (email notifications)
- [ ] **Check Gemini API quotas** in Google Cloud Console
- [ ] **Verify API key is production key** (not development key)

### This Week

- [ ] **Monitor API usage daily** in Google Cloud Console
- [ ] **Set up usage alerts** if usage exceeds threshold
- [ ] **Review rate limiting effectiveness** (check logs for blocked IPs)
- [ ] **Consider Cloudflare** for additional protection

### Optional (Future Enhancements)

- [ ] **Implement daily usage limits** per IP
- [ ] **Add request token counting** before API calls
- [ ] **Enforce concurrent session limits** (MAX_SESSIONS_PER_IP)
- [ ] **Add cost tracking** per request
- [ ] **Set up monitoring dashboard** for API costs

---

## 🔍 How to Monitor Costs

### Daily Monitoring

1. **Google Cloud Console** → **Billing** → **Cost breakdown**
   - Check daily costs
   - Look for unusual spikes

2. **Google AI Studio** → https://aistudio.google.com/app/apikey
   - Click on your API key
   - View usage statistics

3. **Cloud Run Logs** → Check for unusual request patterns
   - High request counts
   - Failed requests
   - Blocked IPs

### What to Watch For

- ✅ **Normal**: 10-100 requests/day = very low cost
- ⚠️ **Caution**: 1,000+ requests/day = monitor closely
- 🚨 **Alarm**: 10,000+ requests/day = potential abuse

---

## 🚨 Emergency Response

### If You See Unexpected Costs

1. **Immediate Actions:**
   - Check Google Cloud billing dashboard
   - Review API usage logs
   - Check for blocked IPs in backend logs

2. **Temporary Measures:**
   - Reduce rate limit (change 20/min to 5/min)
   - Temporarily disable API key
   - Add stricter IP blocking

3. **Permanent Fixes:**
   - Add daily usage limits
   - Implement stricter validation
   - Add CAPTCHA if needed

### If API Key is Compromised

1. **Immediately rotate key:**
   - Go to https://aistudio.google.com/app/apikey
   - Delete compromised key
   - Create new key
   - Update Cloud Run environment variable

2. **Check for unauthorized usage:**
   - Review API usage logs
   - Check billing for unexpected charges

---

## 📊 Current Protection Status

| Protection Layer | Status | Effectiveness |
|-----------------|--------|---------------|
| Rate Limiting (20/min) | ✅ Active | High |
| IP Blocking (10 failures) | ✅ Active | High |
| Message Length (2000 chars) | ✅ Active | Medium |
| Jailbreak Detection | ✅ Active | Medium |
| CORS Protection | ✅ Active | High |
| API Key Security | ✅ Active | High |
| Billing Alerts | ⚠️ **NEEDED** | Critical |
| API Quotas | ⚠️ **CHECK** | Important |
| Daily Usage Limits | ❌ Not implemented | Recommended |
| Token Counting | ❌ Not implemented | Optional |

---

## 🎯 Recommended Next Steps

**Priority 1 (Critical):**
1. Set up Google Cloud billing budget ($10-50/month)
2. Enable billing email alerts
3. Check API quotas in Google Cloud Console

**Priority 2 (Important):**
1. Monitor API usage daily for first week
2. Review rate limiting logs (check for abuse)
3. Verify all security measures are working

**Priority 3 (Optional):**
1. Consider Cloudflare for additional protection
2. Add daily usage limits per IP
3. Implement token counting for cost tracking

---

**Remember:** With current rate limiting (20/min), even if someone tries to abuse it, max cost would be ~$1-5/day. Setting up billing alerts ensures you'll know immediately if something goes wrong.
