# Verification Checklist for ppaltsokas.com

## ✅ Setup Complete - Let's Verify Everything Works!

### 1. Domain Access Test

**Test these URLs:**

- [ ] **https://www.ppaltsokas.com** - Main site loads correctly
- [ ] **https://ppaltsokas.com** - Redirects to www (should auto-redirect)
- [ ] **HTTPS is active** - Padlock icon in browser address bar
- [ ] **No SSL certificate errors** - Browser shows valid certificate

**Expected Result:** Site loads, shows your portfolio, all images/text display correctly

---

### 2. Chatbot Connection Test

**Test the chatbot:**

1. [ ] **Open https://www.ppaltsokas.com**
2. [ ] **Open browser console** (Press F12 → Console tab)
3. [ ] **Open the chat interface** (click chat button if not auto-open)
4. [ ] **Send a test message**: "Hello" or "Tell me about yourself"
5. [ ] **Check for CORS errors** in console:
   - ❌ Should NOT see: `CORS policy`, `Access-Control-Allow-Origin`, or `blocked by CORS`
   - ✅ Should see: Successful API calls in Network tab
6. [ ] **Check chatbot responds** - Should receive a response from the AI

**Expected Result:** Chatbot responds without CORS errors

---

### 3. Backend Health Check

**Test backend directly:**

Open in browser or run:
```powershell
curl https://virtual-persona-backend-831351726786.europe-west8.run.app/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "gemini_configured": true,
  "kb_loaded": true,
  "kb_documents": 150+,
  "persona_loaded": true,
  "persona_documents": 4,
  "timestamp": "..."
}
```

---

### 4. CORS Configuration Verification

**Test from browser console:**

Open https://www.ppaltsokas.com and in console run:

```javascript
fetch('https://virtual-persona-backend-831351726786.europe-west8.run.app/health', {
  method: 'GET',
  headers: {
    'Origin': 'https://www.ppaltsokas.com'
  }
})
.then(r => r.json())
.then(data => console.log('✅ CORS Working:', data))
.catch(err => console.error('❌ CORS Error:', err));
```

**Expected Result:** Should log health data without CORS errors

---

### 5. Security Features Test (Optional)

**Test rate limiting:**

1. Send multiple messages quickly (21+ in one minute)
2. Should see rate limit message after 20 requests
3. Wait 1 minute, should work again

**Expected Result:** Rate limiting prevents abuse

---

## Troubleshooting

### If you see CORS errors:

1. **Check Cloud Run environment variable:**
   - Verify `ALLOWED_ORIGINS` includes `https://www.ppaltsokas.com`
   - Make sure there are no typos (including `https://` and no trailing `/`)

2. **Check Railway environment variable:**
   - Verify `VITE_API_URL` is set correctly
   - Should point to your Cloud Run backend URL

3. **Check browser console:**
   - Look for exact CORS error message
   - Note which origin is being rejected

4. **Check backend logs:**
   - Go to Cloud Run → Logs tab
   - Look for CORS-related messages
   - Check if requests are reaching backend

### If chatbot doesn't respond:

1. **Check backend health:**
   - Visit: `https://your-backend.run.app/health`
   - Should return healthy status

2. **Check network tab:**
   - Open browser DevTools → Network tab
   - Send a message
   - Look for `/chat` request
   - Check if it returns 200 OK or an error

3. **Check backend logs:**
   - Cloud Run → Logs tab
   - Look for error messages
   - Check if Gemini API key is configured

---

## Success Indicators

✅ **All these should work:**
- Domain loads at www.ppaltsokas.com
- HTTPS certificate valid
- Site displays correctly
- Chatbot opens without errors
- Chatbot responds to messages
- No CORS errors in console
- Network requests successful (200 OK)

---

**If everything checks out above, your setup is complete and working! 🎉**
