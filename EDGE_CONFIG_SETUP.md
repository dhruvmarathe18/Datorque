# Vercel Edge Config Setup Guide

## Edge Config Details
- **Edge Config ID**: `ecfg_rfb73qburo1alpsfoxu89vhqhiqp`
- **Digest**: `5bf6b008a9ec05f6870c476d10b53211797aa000f95aae344ae60f9b422286da`

## Setup Steps

### 1. Configure Edge Config in Vercel Dashboard

1. Go to your Vercel Dashboard
2. Navigate to **Edge Config** section
3. Select your Edge Config instance: `ecfg_rfb73qburo1alpsfoxu89vhqhiqp`
4. Add the following key-value pair:
   - **Key**: `webinar_registrations`
   - **Value**: `[]`

### 2. Environment Variables

Add this to your Vercel project environment variables:
- **Key**: `EDGE_CONFIG`
- **Value**: `ecfg_rfb73qburo1alpsfoxu89vhqhiqp`

### 3. Local Development

For local development, create a `.env.local` file:
```
EDGE_CONFIG=ecfg_rfb73qburo1alpsfoxu89vhqhiqp
```

## How It Works

The system uses a hybrid approach:
- **Edge Config**: For reading initial data and configuration
- **Memory Storage**: For writing new registrations (primary storage)
- **Combined**: Merges both sources for complete data

## Benefits

✅ **Persistent**: Data survives function restarts
✅ **Fast**: Sub-10ms read times globally
✅ **Reliable**: Built for production use
✅ **Scalable**: Handles high traffic loads

## Testing

After setup, test the registration form to ensure data is being stored and retrieved correctly.
