# Deployment Guide for Bida App

Since localhost isn't working on your Mac, here are two ways to deploy your app online:

## Option 1: Deploy to Vercel (Recommended - FREE)

1. **Create a Vercel account:**
   - Go to https://vercel.com/signup
   - Sign up with GitHub (recommended) or email

2. **Install Vercel CLI and login:**
   ```bash
   npm install -g vercel
   vercel login
   ```

3. **Deploy your app:**
   ```bash
   cd "/Users/reemal-marei/bida prototype 3"
   vercel --prod
   ```

4. **Add environment variables in Vercel dashboard:**
   - Go to your project settings on vercel.com
   - Add these environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

5. **Your app will be live at:** `https://your-app-name.vercel.app`

## Option 2: Use GitHub + Vercel (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/bida-app.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Add environment variables
   - Click Deploy

## Option 3: Use Replit (No local setup needed)

1. Go to https://replit.com
2. Create new Repl → Import from GitHub
3. Add your environment variables in Secrets
4. Click Run

## Option 4: Fix localhost (Advanced)

Your localhost issue might be caused by:

1. **macOS Firewall blocking Node.js:**
   ```bash
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
   ```

2. **Reset network settings:**
   ```bash
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

3. **Check if something is blocking port 3000:**
   ```bash
   sudo lsof -iTCP -sTCP:LISTEN -n -P | grep 3000
   ```

4. **Try using 127.0.0.1 instead of localhost:**
   - http://127.0.0.1:3000

5. **Create new network location:**
   - System Preferences → Network → Location → Edit Locations
   - Create new location called "Test"
   - Switch to it and try again

## Quick Test

To verify your app works, you can see it responds via terminal:
```bash
curl http://localhost:3000
```

If curl works but browsers don't, it's definitely a macOS security issue.