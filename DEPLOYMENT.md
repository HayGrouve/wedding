# 🚀 Wedding Website Deployment Guide

This guide explains how to deploy your wedding website to Vercel with Redis database.

## ⚡ Quick Setup

### 1. Prerequisites

- Vercel account
- GitHub repository with your wedding website code

### 2. Required Environment Variables

Your deployment needs these environment variables configured in Vercel:

#### **Redis Database (Required)**

```bash
# Redis Database URL - Get this from your Redis provider (Vercel, Upstash, etc.)
REDIS_URL=redis://your-redis-url
```

#### **Admin Authentication (Optional)**

```bash
# For admin panel access (if you add admin features later)
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_key
```

### 3. Setting Up Redis Database

#### **Option A: Vercel Redis (Recommended)**

1. **Go to Vercel Dashboard**

   - Navigate to your project
   - Go to Storage tab
   - Click "Create Database"
   - Select "Redis" (powered by Upstash)

2. **Configure Redis Database**

   - Choose a database name (e.g., "wedding-guests")
   - Select your region (choose closest to your users)
   - Create the database

3. **Get Environment Variable**
   - After creation, copy the `REDIS_URL` value
   - Go to Settings > Environment Variables in your project
   - Add the variable: `REDIS_URL`

#### **Option B: Direct Upstash Setup**

1. **Go to Upstash Console**

   - Visit [Upstash Console](https://console.upstash.com/)
   - Create account if needed
   - Create a new Redis database

2. **Configure Database**

   - Choose a database name (e.g., "wedding-guests")
   - Select your region
   - Copy the Redis URL

3. **Add to Vercel**
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add `REDIS_URL` with your database URL

### 4. Deploy to Vercel

#### **Option A: Deploy from GitHub**

1. Connect your GitHub repository to Vercel
2. Import your project
3. Add the environment variables from step 3
4. Deploy!

#### **Option B: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
cd wedding-website
vercel

# Follow the prompts and add environment variables in Vercel dashboard
```

### 5. Test Your Deployment

After deployment:

1. **Test RSVP Form**

   - Go to your deployed website
   - Fill out the RSVP form
   - Verify it submits successfully

2. **Check Redis Database**
   - Go to your Redis provider dashboard (Vercel Storage or Upstash)
   - You should see the guest data stored

## 🔧 Troubleshooting

### **RSVP Submission Fails**

- Check that `REDIS_URL` environment variable is set correctly
- Verify Redis database is active in your provider dashboard
- Check function logs in Vercel dashboard for error details

### **Database Connection Issues**

- Ensure `REDIS_URL` matches exactly what your provider gave you
- Try redeploying after setting environment variables
- Check that your Redis database is accessible from Vercel

### **Environment Variables Not Working**

- Make sure `REDIS_URL` is set in Vercel dashboard (not just locally)
- Redeploy after adding environment variables
- Check variable name for typos (case-sensitive)

### **Redis Connection Errors**

- Verify your Redis URL format: `redis://username:password@host:port`
- Check if your Redis provider requires authentication
- Ensure your Redis instance is not sleeping (some free tiers auto-sleep)

## 📊 Database Structure

Your Redis database will store:

### **Guest Records** (stored as JSON string)

```json
{
  "id": "guest_1671234567890_abc123def",
  "guestName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "attending": true,
  "plusOneAttending": true,
  "plusOneName": "Jane Doe",
  "childrenCount": 2,
  "dietaryPreference": "vegetarian",
  "allergies": "nuts",
  "submissionDate": "2024-01-15T10:30:00.000Z",
  "ipAddress": "192.168.1.1"
}
```

### **Rate Limiting** (stored as JSON string with expiration)

```json
{
  "count": 1,
  "firstAttempt": "2024-01-15T10:30:00.000Z",
  "lastAttempt": "2024-01-15T10:30:00.000Z"
}
```

### **Redis Keys Structure**

- `wedding:guests` - Main array of all guest records
- `wedding:guest:email:{email}` - Email to guest ID mapping
- `wedding:ratelimit:{ip}` - Rate limiting records by IP address

## 🎯 Production Checklist

Before going live:

- [ ] ✅ Redis database created and configured
- [ ] ✅ `REDIS_URL` environment variable set in Vercel
- [ ] ✅ RSVP form tested and working
- [ ] ✅ Gallery images uploaded to `/public/gallery/`
- [ ] ✅ Wedding details updated in components
- [ ] ✅ Domain configured (if using custom domain)
- [ ] ✅ SSL certificate active
- [ ] ✅ Meta tags and SEO optimized

## 💡 Tips for Success

1. **Test Locally First**

   - Set up a test Redis database for development
   - Use a different Redis URL for local testing
   - Test all functionality before deploying

2. **Monitor Your Database**

   - Check Redis usage in your provider dashboard
   - Most Redis providers have generous free limits
   - Monitor memory usage if you expect many guests

3. **Backup Strategy**

   - Consider exporting guest data periodically
   - Redis data persists but good to have backups
   - Some providers offer automatic backups

4. **Performance**
   - Redis is extremely fast for reads/writes
   - Connection pooling is handled automatically
   - Consider Redis clustering for very high traffic (not needed for most weddings)

## 🔗 Useful Links

- [Vercel Redis Documentation](https://vercel.com/docs/storage/vercel-redis)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Redis Client Documentation](https://redis.io/docs/clients/nodejs/)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## 🆚 Redis vs File Storage

**Why Redis is better for production:**

- ✅ **Serverless Compatible:** Works perfectly with Vercel Functions
- ✅ **Fast & Scalable:** Redis is designed for high-performance operations
- ✅ **Persistent:** Data is stored reliably and won't be lost
- ✅ **Concurrent Access:** Multiple requests can access data simultaneously
- ✅ **Built-in Features:** Rate limiting, expiration, atomic operations

**Previous file storage issues:**

- ❌ **Read-only filesystem:** Serverless functions can't write files
- ❌ **Data loss:** Files would be lost between function invocations
- ❌ **Race conditions:** Multiple requests could corrupt data

---

## 🎉 You're Ready!

Once deployed, your wedding website will be able to:

- ✅ Accept RSVP submissions
- ✅ Store guest data securely in Redis
- ✅ Handle rate limiting to prevent spam
- ✅ Scale automatically for any number of guests
- ✅ Work reliably in production
- ✅ Handle concurrent requests safely

Congratulations on your deployment! 🎊
