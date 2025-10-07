# 🎯 Demo Mode & Credit Fix Guide

## Current Status

✅ **Application is running in DEMO MODE**
- The app works but uses mock summaries
- No API costs while in demo mode
- Perfect for testing the UI and functionality

## 🔧 How Demo Mode Works

When `DEMO_MODE=true` in your `.env` file:
- The API endpoint generates fake summaries
- No calls to Anthropic API (no costs)
- Summaries include "[DEMO MODE]" suffix
- Yellow banner appears at top of page
- 1-second simulated delay for realism

## 💳 Fix: Add Anthropic Credits (Production)

### Option 1: Add Credits (Recommended)

1. **Visit Anthropic Console**
   - URL: https://console.anthropic.com/settings/billing
   - Sign in with your account

2. **Purchase Credits**
   - Click "Add Credits" or "Purchase Credits"
   - Minimum: $5
   - Recommended: $10-20 for testing
   - Payment: Credit card

3. **Disable Demo Mode**
   ```bash
   # Edit .env file
   nano .env
   
   # Change this line:
   DEMO_MODE=true
   
   # To:
   DEMO_MODE=false
   ```

4. **Restart Docker**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

5. **Test with Real AI**
   - Visit http://localhost:3000
   - Paste text and click "Summarize"
   - You should get real Claude AI summaries!

### Cost Breakdown

**Claude 3.5 Sonnet Pricing:**
- Input: $3 per 1M tokens (~750,000 words)
- Output: $15 per 1M tokens (~750,000 words)

**Per Summary:**
- Average cost: $0.001 - $0.003
- 500 words input + 50 words output ≈ $0.002

**Credits Estimate:**
- $5 = ~1,500 - 5,000 summaries
- $10 = ~3,000 - 10,000 summaries
- $20 = ~6,000 - 20,000 summaries

## 🎮 Testing Demo Mode

### Try This Sample Text:

```
The Industrial Revolution, which took place from the 18th to 19th centuries, was a period during which predominantly agrarian, rural societies in Europe and America became industrial and urban. Before the Industrial Revolution, which began in Britain in the late 1700s, manufacturing was often done in people's homes, using hand tools or basic machines. Industrialization marked a shift to powered, special-purpose machinery, factories and mass production. The iron and textile industries, along with the development of the steam engine, played central roles in the Industrial Revolution, which also saw improved systems of transportation, communication and banking.
```

**Expected Demo Mode Output:**
```
The Industrial Revolution, which took place from the 18th to 19th centuries, was a period during which predominantly agrarian, rural societies in Europe and America became industrial and urban. Key points include Before the Industrial Revolution, which began in Bri... This covers approximately 98 words of content. [DEMO MODE - Add Anthropic credits for real AI summaries]
```

## 🔄 Switching Modes

### Enable Demo Mode (Free Testing)

1. Edit `.env`:
   ```bash
   DEMO_MODE=true
   ```

2. Restart:
   ```bash
   docker-compose restart
   ```

### Disable Demo Mode (Use Real API)

1. Edit `.env`:
   ```bash
   DEMO_MODE=false
   ```

2. Restart:
   ```bash
   docker-compose restart
   ```

## 🐛 Troubleshooting

### "Credit balance too low" Error

**Problem:** You see this error when DEMO_MODE=false
**Solution:** Either add credits OR enable demo mode

### Demo Banner Not Showing

**Problem:** Banner doesn't appear even in demo mode
**Cause:** Browser cache
**Solution:**
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Real API Still Not Working After Adding Credits

1. Check credit balance: https://console.anthropic.com/settings/billing
2. Verify API key is correct in `.env`
3. Ensure `DEMO_MODE=false`
4. Restart Docker: `docker-compose restart`
5. Check logs: `docker-compose logs -f app`

## 📊 Monitor Usage

**Check API Usage:**
- Visit: https://console.anthropic.com/settings/usage
- View requests and costs
- Set budget alerts

**Local Logging:**
```bash
# View application logs
docker-compose logs -f app

# Look for:
# - "⚠️ Running in DEMO MODE" (demo mode)
# - API success messages (real mode)
# - Error messages (billing issues)
```

## 🎯 Quick Commands

```bash
# Check if demo mode is active
docker-compose exec app env | grep DEMO_MODE

# Switch to demo mode and restart
echo "DEMO_MODE=true" >> .env && docker-compose restart

# Switch to real API and restart
sed -i 's/DEMO_MODE=true/DEMO_MODE=false/' .env && docker-compose restart

# View current configuration
cat .env

# Test the API endpoint
curl -X POST http://localhost:3000/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Test text here","maxWords":10}'
```

## ✨ Summary

**Right Now:**
- ✅ App is in demo mode
- ✅ You can test the full UI
- ✅ No API costs

**To Use Real AI:**
1. Add $5-20 credits at https://console.anthropic.com/settings/billing
2. Set `DEMO_MODE=false` in `.env`
3. Restart: `docker-compose restart`
4. Enjoy real Claude AI summaries!

---

**Need Help?**
- Anthropic Support: https://support.anthropic.com
- Check logs: `docker-compose logs -f app`
- View this guide: `cat DEMO_MODE_GUIDE.md`
