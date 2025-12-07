# Railway Railpack Configuration Fix

## Problem
Railway keeps detecting Dockerfile even after renaming it. Railway's new default builder is **Railpack** (not Nixpacks).

## Solution Applied

1. ✅ Updated `railway.json` to use `RAILPACK` instead of `NIXPACKS`
2. ✅ Created `.railwayignore` to exclude `Dockerfile.backend`
3. ✅ Renamed `Dockerfile` to `Dockerfile.backend`

## What You Need to Do in Railway Dashboard

### Step 1: Change Builder to Railpack

1. Go to Railway Dashboard → Your Service → **Settings** → **Build**
2. In the **Builder** dropdown, select **"Railpack"** (it should be the default with a blue "Default" tag)
3. Make sure **Dockerfile Path** is empty or points to nothing
4. Save the settings

### Step 2: Verify Start Command

In Railway Dashboard → Your Service → **Settings** → **Deploy**:
- **Custom Start Command** should be: `npx vite preview --host 0.0.0.0 --port $PORT`
- Or leave it empty - `railway.json` will provide it

### Step 3: Commit and Push

```powershell
git add railway.json .railwayignore
git commit -m "Switch to Railpack builder for frontend deployment"
git push
```

## How Railpack Works

Railpack is Railway's new builder that:
- Auto-detects Node.js projects (sees `package.json`)
- Automatically runs `npm install` and `npm run build`
- Uses the start command from `railway.json`

## Expected Behavior

After pushing:
1. Railway will use **Railpack** (not Dockerfile)
2. It will detect Node.js from `package.json`
3. Build the React app with `npm run build`
4. Start with `npx vite preview --host 0.0.0.0 --port $PORT`

## If It Still Detects Dockerfile

If Railway still tries to use Dockerfile after these changes:

1. **Clear Railway cache**: In Railway Dashboard → Settings → there might be a "Clear Cache" option
2. **Force rebuild**: Trigger a new deployment manually
3. **Check git**: Make sure `Dockerfile.backend` is committed (so Railway knows the old Dockerfile is gone)

## Verification

After deployment, check the logs. You should see:
- ✅ Node.js installation
- ✅ `npm install` running
- ✅ `npm run build` running
- ✅ `vite preview` starting
- ❌ NO Python/Dockerfile references

