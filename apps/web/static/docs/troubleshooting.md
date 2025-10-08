# Troubleshooting Guide

Common issues and their solutions for AI Summarizer.

## API & Authentication Issues

### "Your credit balance is too low to access the Anthropic API"

**Problem:** Your Anthropic account doesn't have sufficient credits.

**Solution:**
1. Visit [Anthropic Console](https://console.anthropic.com/settings/billing)
2. Navigate to "Plans & Billing"
3. Add credits to your account or upgrade your plan
4. Wait a few minutes for changes to propagate
5. Restart the application

**Alternative:** Enable demo mode temporarily:
```bash
# In .env file
DEMO_MODE=true
```

### "Invalid API key" or 401 Error

**Problem:** The API key is missing, incorrect, or improperly formatted.

**Solution:**
1. Check your `.env` file exists in the project root
2. Verify the API key format:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```
3. Ensure no extra spaces or quotes around the key
4. Generate a new key if needed at [Anthropic Console](https://console.anthropic.com/settings/keys)
5. Restart the application after updating `.env`

### Rate Limit Exceeded (429 Error)

**Problem:** Too many requests in a short time period.

**Solution:**
1. Wait 60 seconds before making new requests
2. Check your current tier at [Anthropic Console](https://console.anthropic.com/settings/limits)
3. Upgrade to a higher tier if needed
4. Implement client-side request throttling

### Service Overloaded (529 Error)

**Problem:** Anthropic's API is temporarily unavailable or overloaded.

**Solution:**
1. Wait a few minutes and try again
2. Check [Anthropic Status Page](https://status.anthropic.com/) for service health
3. Enable demo mode temporarily
4. Implement exponential backoff in your code

## Application Issues

### Summary Generation Fails Silently

**Problem:** Clicking "Summarize" does nothing or shows no error.

**Checklist:**
1. Check browser console for JavaScript errors (F12)
2. Verify text input is not empty
3. Ensure network connectivity
4. Check if Docker container is running: `docker ps`
5. Restart the application

### Demo Mode Banner Always Shows

**Problem:** Application stuck in demo mode despite configuration.

**Solution:**
1. Verify `.env` file has `DEMO_MODE=false`
2. Ensure `.env` is in the project root (not in `src/`)
3. Rebuild Docker container if using Docker:
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```
4. For development, restart dev server:
   ```bash
   npm run dev
   ```

### "Text is required" Error with Valid Input

**Problem:** Validation error despite entering text.

**Possible Causes:**
1. Text contains only whitespace
2. Text is copied with invisible characters
3. Character encoding issues

**Solution:**
1. Ensure text has visible characters
2. Try typing text instead of pasting
3. Clear and re-enter the text
4. Check for minimum character requirements

## Build & Deployment Issues

### Docker Build Fails

**Problem:** `docker-compose up --build` fails with errors.

**Common Issues:**

**Issue 1: Environment variables not found**
```bash
Error: ANTHROPIC_API_KEY is not defined
```

**Solution:**
- Ensure `.env` file exists in project root
- Check `docker-compose.yml` includes environment variables
- Verify `.env` is not in `.dockerignore`

**Issue 2: Build context errors**

**Solution:**
```bash
# Clean Docker cache
docker-compose down
docker system prune -a
docker-compose up --build
```

### Production Build Errors

**Problem:** `npm run build` fails.

**Common Errors:**

**Error 1: TypeScript errors**
```bash
# Check for type errors
npm run check

# Fix or suppress errors as needed
```

**Error 2: Missing dependencies**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Error 3: TailwindCSS issues**
```bash
# Ensure TailwindCSS config is correct
# Check imports in app.css are in correct order
```

### Application Won't Start

**Problem:** Server crashes on startup or port conflicts.

**Solutions:**

**Port 3000 in use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

**Missing environment variables:**
```bash
# Create .env if missing
cp .env.example .env
# Add your API key
```

## Data & Storage Issues

### History Not Saving

**Problem:** Summaries don't appear in history.

**Checklist:**
1. Check browser's localStorage is enabled
2. Verify browser isn't in private/incognito mode
3. Check browser console for storage errors
4. Try a different browser
5. Clear browser cache and restart

### Saved Summaries Disappeared

**Problem:** Previously saved summaries are gone.

**Possible Causes:**
1. Browser cache/data was cleared
2. Using different browser or device
3. localStorage quota exceeded

**Solutions:**
1. Export summaries regularly (use Export button in History)
2. Data is stored locally - cannot be recovered if localStorage cleared
3. Consider implementing cloud backup (future enhancement)

### Cannot Delete Summary

**Problem:** Delete button doesn't work.

**Solution:**
1. Refresh the page
2. Check browser console for errors
3. Try clearing browser cache
4. Use "Clear All History" in Settings as last resort

## UI/UX Issues

### Sidebar Not Responding

**Problem:** Sidebar won't open/close or navigation doesn't work.

**Solution:**
1. Refresh the page
2. Check if JavaScript is enabled
3. Try different screen size/device
4. Clear browser cache
5. Check browser console for errors

### Mobile Display Issues

**Problem:** Layout broken on mobile devices.

**Solution:**
1. Ensure viewport meta tag is present (it is)
2. Try rotating device (portrait/landscape)
3. Update browser to latest version
4. Clear mobile browser cache
5. Try different mobile browser

### Copy to Clipboard Fails

**Problem:** "Copy" button doesn't work.

**Causes & Solutions:**

**HTTPS Required:**
- Clipboard API requires HTTPS in production
- Works on localhost without HTTPS
- Deploy with SSL certificate

**Browser Permission:**
- Allow clipboard access when prompted
- Check browser settings for clipboard permissions

**Browser Compatibility:**
- Update to modern browser version
- Try different browser if issue persists

## Performance Issues

### Slow Summary Generation

**Expected:** 1-3 seconds for Claude API

**If Slower:**
1. Check internet connection speed
2. Verify Anthropic API status
3. Test with smaller text input
4. Check for rate limiting (429 errors)
5. Monitor network tab in browser DevTools

### High Memory Usage

**Problem:** Browser/application using too much RAM.

**Solutions:**
1. Clear summary history periodically
2. Close other browser tabs
3. Restart browser
4. Export and clear old summaries
5. Use "Clear All History" in Settings

### Application Lag/Freezing

**Checklist:**
1. Check CPU usage in Task Manager
2. Close unnecessary applications
3. Restart the application
4. Check for infinite loops in console
5. Try incognito mode (disables extensions)

## Browser-Specific Issues

### Safari

**Issue:** localStorage not working
**Solution:** Enable "Prevent Cross-Site Tracking" exceptions

**Issue:** Clipboard API not working
**Solution:** Update to Safari 13.1+

### Firefox

**Issue:** Sidebar animations jerky
**Solution:** Disable "Smooth Scrolling" in settings or update Firefox

### Chrome

**Issue:** High memory usage
**Solution:** Disable unnecessary extensions, clear cache

## Getting Help

If you're still experiencing issues:

1. **Check logs:**
   - Browser console (F12)
   - Docker logs: `docker logs textsummarizer-app-1`
   - Server logs in terminal

2. **Gather information:**
   - Browser and version
   - Operating system
   - Error messages (screenshots)
   - Steps to reproduce

3. **Resources:**
   - [GitHub Issues](https://github.com/zedaan/ClaudeTextSummarizer/issues)
   - [Anthropic Support](https://support.anthropic.com/)
   - [Anthropic Documentation](https://docs.anthropic.com/)

4. **Debug mode:**
   ```bash
   # Enable verbose logging
   NODE_ENV=development npm run dev
   ```

---

Still stuck? Check the [FAQ](faq) or consult the [Claude API Guide](claude-api-guide).
