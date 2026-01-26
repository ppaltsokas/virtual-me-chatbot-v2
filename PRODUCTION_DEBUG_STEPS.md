# Production Debug Steps - System Prompt Issue

## Problem Diagnosed
Cloud Run backend loads persona files (summary.txt, CV, LinkedIn) but model responds with "As an AI, I don't have a birth month or year" - indicating system prompt is not being applied correctly.

## Fixes Applied

### 1. ✅ Enhanced /health Endpoint with Debug Fields
Added to `/health` endpoint:
- `system_instruction_length`: Length of system prompt
- `system_instruction_preview`: First 300 chars of system prompt
- `persona_context_length`: Length of summary.txt
- `persona_context_preview`: First 300 chars of summary.txt

**Check Cloud Run:**
```bash
curl -sS https://virtual-persona-backend-831351726786.europe-west8.run.app/health | jq '.system_instruction_preview, .persona_context_preview'
```

**What to Look For:**
- `system_instruction_preview` should contain "You ARE Panos" and "born December 1984"
- `persona_context_preview` should show summary.txt content
- If either is empty or wrong → system prompt not being built correctly

### 2. ✅ Deterministic Short-Circuit for Birth Questions
Added direct response for birth questions - bypasses model entirely:
- Detects: "born", "birth", "birthday", "birth date", "birth year", "what year were you", "what month were you"
- Extracts birth date from summary.txt using `extract_critical_facts()`
- Returns: "I was born in December 1984." (guaranteed correct)

**Test:**
```bash
curl -sS -X POST https://virtual-persona-backend-831351726786.europe-west8.run.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What year were you born?","session_id":"test-birth-1"}'
```

**Expected:** "I was born in December 1984." (no model call)

### 3. ✅ Enhanced Session Creation Logging
Added system prompt length to session creation logs:
- Logs now show: `Created new chat session: ... (length: XXXX chars)`
- Helps verify system prompt is being passed to GenerativeModel

## Next Steps

### Step 1: Deploy Updated Code to Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/virtualpersonacv/virtual-persona-backend
gcloud run deploy virtual-persona-backend \
  --image gcr.io/virtualpersonacv/virtual-persona-backend \
  --region europe-west8
```

### Step 2: Check /health Endpoint
```bash
curl -sS https://virtual-persona-backend-831351726786.europe-west8.run.app/health | jq
```

**Verify:**
- `system_instruction_length` > 2000 (should be substantial)
- `system_instruction_preview` contains "You ARE Panos" and birth date
- `persona_context_preview` shows summary.txt content

### Step 3: Test Birth Question (Deterministic)
```bash
curl -sS -X POST https://virtual-persona-backend-831351726786.europe-west8.run.app/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What year were you born?","session_id":"test-deterministic-1"}'
```

**Expected:** "I was born in December 1984." (immediate, no AI response)

### Step 4: Check Cloud Run Logs for Session Creation
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=virtual-persona-backend" \
  --limit 20 \
  --format json | jq '.[] | select(.jsonPayload.message | contains("Created new chat session")) | .jsonPayload'
```

**Look for:**
- `length: XXXX chars` in session creation log
- If length is 0 or very small → system prompt not being built

### Step 5: If System Prompt Still Wrong
If `/health` shows wrong system prompt:

1. **Check `build_system_prompt()` is being called:**
   - Look for logs: "Created new chat session" with prompt hash
   - Verify `persona_data` is populated (check `/me/status`)

2. **Check session reuse:**
   - Look for "Using existing chat session" logs
   - If old session is reused, it has old system prompt
   - Solution: Use unique session_id for each test

3. **Verify GenerativeModel creation:**
   - Check logs show `system_instruction=system_prompt` is being passed
   - If not, the model is created without system instruction

## Root Cause Analysis

Based on the evidence:
- ✅ Persona files are loaded (confirmed by `/me/status`)
- ❌ System prompt is not being applied (model says "As an AI...")
- ❌ Model doesn't see birth date in system instruction

**Most Likely Causes:**
1. **Session reuse:** Old session with old/no system prompt
2. **System prompt not in SYSTEM instruction:** Being put in USER message instead
3. **GenerativeModel created without system_instruction:** Bug in session creation code

**The deterministic short-circuit fixes the immediate issue**, but we still need to verify the system prompt is correct for other questions.

## Verification Checklist

After deploying:
- [ ] `/health` shows `system_instruction_length > 2000`
- [ ] `/health` shows `system_instruction_preview` contains "You ARE Panos"
- [ ] `/health` shows `system_instruction_preview` contains "December 1984"
- [ ] Birth question returns "I was born in December 1984." (deterministic)
- [ ] Session creation logs show `length: XXXX chars`
- [ ] Cloud Run logs show system prompt being built correctly
