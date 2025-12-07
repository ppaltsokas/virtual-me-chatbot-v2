# Manual Railway Fix - Dependencies Not Installing

## 🚨 Current Issue

Railway is **not installing Python dependencies** even though we added build commands. The service crashes with:
```
ModuleNotFoundError: No module named 'google.generativeai'
```

## ✅ Manual Fix in Railway UI (Do This Now!)

Since the automatic build isn't working, we need to set it manually in Railway:

### Step 1: Set Build Command

1. **Go to Railway dashboard**
2. **Click on your service**: `virtual-me-chatbot-v2`
3. **Go to "Settings" tab** (or "Deploy" tab)
4. **Find "Build Command"** field
5. **Set it to**:
   ```
   pip install -r requirements.txt
   ```
6. **Save/Update**

### Step 2: Verify Start Command

1. **Still in Settings/Deploy tab**
2. **Check "Start Command"** (or "Custom Start Command")
3. **Should be**:
   ```
   sh start.sh
   ```
4. **If different, change it and save**

### Step 3: Redeploy

1. **Go to "Deployments" tab**
2. **Click "Redeploy"** on the latest deployment
3. **Or**: Railway might auto-redeploy after you save the build command

### Step 4: Check Build Logs

1. **During deployment, check "Build Logs"** (not Deploy Logs)
2. **You should see**:
   - ✅ "Installing dependencies from requirements.txt"
   - ✅ "Collecting google-genai..."
   - ✅ "Successfully installed google-genai ..."
   - ✅ "Successfully installed fastapi ..."
   - ✅ All packages installing

3. **Then check "Deploy Logs"**:
   - ✅ "Starting Container"
   - ✅ "Application startup complete"
   - ✅ "Uvicorn running on..."

## 🔍 What to Check

### In Railway Settings:

1. **Root Directory**: Should be `.` (empty) or root
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `sh start.sh`
4. **Environment Variables**: `GEMINI_API_KEY` is set

### Verify requirements.txt:

Make sure `requirements.txt` is in the root directory and contains:
```
fastapi
uvicorn
pydantic
PyPDF2
python-dotenv
google-genai
requests
Pillow
```

## 🆘 If Still Not Working

### Option 1: Check Build Logs

The build logs should show dependency installation. If they don't:
- Railway might not be detecting it as a Python project
- Try adding `runtime.txt` (I've added this)
- Try the manual build command in UI

### Option 2: Use Dockerfile Instead

If Railway's auto-detection keeps failing, we can use a Dockerfile (I can create one if needed).

### Option 3: Check Railway Detection

Railway should auto-detect:
- ✅ `requirements.txt` = Python project
- ✅ `main.py` = Entry point
- ✅ Should install dependencies automatically

If it's not doing this, the manual build command is the solution.

## 📋 Quick Checklist

- [ ] Build Command set in Railway UI: `pip install -r requirements.txt`
- [ ] Start Command set: `sh start.sh`
- [ ] `GEMINI_API_KEY` environment variable is set
- [ ] Redeployed after setting build command
- [ ] Checked Build Logs - see dependencies installing
- [ ] Checked Deploy Logs - see "Application startup complete"

## 💡 Why This Happens

Railway's NIXPACKS builder should auto-detect Python projects, but sometimes:
- It doesn't run the build phase correctly
- The build command in `railway.json` isn't being used
- Manual configuration in UI is more reliable

Setting it manually in the Railway UI ensures it runs every time.



