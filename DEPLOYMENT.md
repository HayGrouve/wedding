# 🚀 Wedding Website Deployment Guide

This guide explains how to deploy your wedding website to Vercel with Vercel KV database.

## ⚡ Quick Setup

### 1. Prerequisites

- Vercel account
- GitHub repository with your wedding website code

### 2. Required Environment Variables

Your deployment needs these environment variables configured in Vercel:

#### **KV Database (Required)**

```bash
# Vercel KV Database URLs - Get these from Vercel Dashboard
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
KV_REST_API_READ_ONLY_TOKEN=your_kv_rest_api_read_only_token
KV_URL=your_kv_url
```

#### **Admin Authentication (Optional)**

```bash
# For admin panel access (if you add admin features later)
ADMIN_PASSWORD=your_secure_admin_password
JWT_SECRET=your_jwt_secret_key
```

### 3. Setting Up Vercel KV

1. **Go to Vercel Dashboard**

   - Navigate to your project
   - Go to Storage tab
   - Click "Create Database"
   - Select "KV"

2. **Configure KV Database**

   - Choose a database name (e.g., "wedding-guests")
   - Select your region (choose closest to your users)
   - Create the database

3. **Get Environment Variables**
   - After creation, Vercel will show you the environment variables
   - Copy the KV environment variables
   - Go to Settings > Environment Variables in your project
   - Add each variable:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`
     - `KV_URL`

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

2. **Check KV Database**
   - Go to Vercel Dashboard > Storage > Your KV Database
   - You should see the guest data stored

## 🔧 Troubleshooting

### **RSVP Submission Fails**

- Check that all KV environment variables are set correctly
- Verify KV database is active in Vercel dashboard
- Check function logs in Vercel dashboard for error details

### **Database Connection Issues**

- Ensure environment variables match exactly what Vercel provided
- Try redeploying after setting environment variables
- Check that your Vercel KV database is in the same region as your deployment

### **Environment Variables Not Working**

- Make sure variables are set in Vercel dashboard (not just locally)
- Redeploy after adding environment variables
- Check variable names for typos

## 📊 Database Structure

Your Vercel KV database will store:

### **Guest Records**

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

### **Rate Limiting**

```json
{
  "count": 1,
  "firstAttempt": "2024-01-15T10:30:00.000Z",
  "lastAttempt": "2024-01-15T10:30:00.000Z"
}
```

## 🎯 Production Checklist

Before going live:

- [ ] ✅ KV database created and configured
- [ ] ✅ All environment variables set in Vercel
- [ ] ✅ RSVP form tested and working
- [ ] ✅ Gallery images uploaded to `/public/gallery/`
- [ ] ✅ Wedding details updated in components
- [ ] ✅ Domain configured (if using custom domain)
- [ ] ✅ SSL certificate active
- [ ] ✅ Meta tags and SEO optimized

## 💡 Tips for Success

1. **Test Locally First**

   - Set up a test KV database for development
   - Test all functionality before deploying

2. **Monitor Your Database**

   - Check KV usage in Vercel dashboard
   - Vercel KV has generous free limits but monitor if you expect many guests

3. **Backup Strategy**

   - Consider exporting guest data periodically
   - KV data persists but good to have backups

4. **Performance**
   - KV is very fast for reads/writes
   - Consider caching for heavy read operations if needed

## 🔗 Useful Links

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/deployments/overview)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🎉 You're Ready!

Once deployed, your wedding website will be able to:

- ✅ Accept RSVP submissions
- ✅ Store guest data securely in Vercel KV
- ✅ Handle rate limiting to prevent spam
- ✅ Scale automatically for any number of guests
- ✅ Work reliably in production

Congratulations on your deployment! 🎊
