# Railway 502 Error Fix

## Problem
Getting 502 errors even though the app builds and starts. The issue is likely:
1. Port mismatch between Railway's PORT and Vite preview
2. Vite preview not reading PORT environment variable correctly
3. App crashing after startup

## Solution Applied

1. ✅ Updated `vite.config.ts` to add `preview` configuration that reads `PORT` env var
2. ✅ Updated `railway.json` with fallback port syntax
3. ✅ Updated `Procfile` with fallback port syntax
4. ✅ Updated `railpack.toml` with fallback port syntax

## What Changed

### vite.config.ts
Added `preview` section that reads `PORT` from environment:
```typescript
preview: {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  host: '0.0.0.0',
}
```

This ensures Vite preview uses Railway's PORT environment variable.

## Next Steps

1. **Commit and push:**
   ```powershell
   git add .
   git commit -m "Fix Vite preview port configuration for Railway"
   git push
   ```

2. **Check Railway logs after deployment:**
   - Railway Dashboard → Service → Logs
   - Look for the port Vite is using
   - Should match Railway's PORT (usually shown in Networking section)

3. **If still 502:**
   - Check if `dist` folder exists after build
   - Verify Vite preview is actually serving files
   - Check for any runtime errors in logs

## Alternative: Use a Simple Static Server

If Vite preview still doesn't work, we can use a simple Node.js static server instead:

```json
// package.json - add serve script
"scripts": {
  "serve": "node -e \"const http=require('http'),fs=require('fs'),path=require('path');const port=process.env.PORT||3000;http.createServer((req,res)=>{const file=req.url==='/'?'/index.html':req.url;const filePath=path.join(process.cwd(),'dist',file);fs.readFile(filePath,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return;}res.writeHead(200);res.end(data);});}).listen(port,()=>console.log('Server on',port));\""
}
```

But let's try the Vite preview fix first!

