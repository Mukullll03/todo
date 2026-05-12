# Backend Integration Guide - SSC Mastery 180

## Overview

Your app now has **persistent data storage with Supabase** that automatically:
- Saves daily completed tasks
- Saves daily blueprint (what you plan to do)
- Tracks study history and analytics
- Resets daily blueprint at midnight
- Syncs all data to the cloud

## Database Schema

Three main tables have been created in Supabase:

### 1. **daily_data**
Tracks completed tasks for each day
```
- id: UUID (primary key)
- user_id: UUID (your user ID)
- date: DATE (YYYY-MM-DD)
- completed_tasks: UUID[] (array of task IDs completed)
- total_tasks_planned: INT
- created_at, updated_at: TIMESTAMP
```

### 2. **daily_blueprint**
Saves the daily plan/blueprint
```
- id: UUID (primary key)
- user_id: UUID
- date: DATE
- blueprint_tasks: JSONB[] (array of planned tasks)
- completed_at: BOOLEAN (whether blueprint was completed)
- created_at, updated_at: TIMESTAMP
```

### 3. **study_history**
Analytics data for each day
```
- id: UUID (primary key)
- user_id: UUID
- date: DATE
- task_count: INT (number of tasks completed)
- subjects: JSONB[] (which subjects were studied)
- created_at: TIMESTAMP
```

All tables have Row Level Security (RLS) enabled - users can only see their own data.

## How Data Flows

### On App Load
1. User clicks "Sign In" button in top-right corner
2. Enters email and password (or creates new account)
3. App loads today's daily_data and daily_blueprint from Supabase
4. Local state is populated with Supabase data

### When Completing a Task
1. You click a task to mark it complete
2. `completedDailyTasks` state updates
3. **Automatic sync**: `saveDailyData()` sends to Supabase
4. Task is saved in `daily_data` table for today's date

### At Midnight
1. The app checks every 60 seconds for a date change
2. When midnight passes:
   - Yesterday's `completedDailyTasks` are saved to `daily_blueprint` with `completed_at: true`
   - `completedDailyTasks` is reset to empty array `[]`
   - New daily start fresh

### Study Analytics
1. When tasks are completed, `study_history` is updated
2. Subject breakdown is calculated from completed tasks
3. Used for the insights dashboard (weekly charts, heatmap, etc.)

## Authentication

### Sign Up / Sign In
- Click the "Sign In" button in the top-right
- Enter email and password
- New accounts are auto-created
- Session persists (you stay logged in)

### Sign Out
- Click the "Sign Out" button (appears when logged in)
- Clears the session

## Environment Variables

You need to configure Supabase credentials. In your `.env` file (or Vercel project settings):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these from your Supabase project:
1. Go to Supabase dashboard
2. Settings → API
3. Copy the Project URL and Anonymous Key

## Files Added/Modified

### New Files
- `src/lib/supabase.ts` - Supabase client setup
- `src/lib/useDataSync.ts` - Data sync hook with auto-save logic
- `src/components/Auth.tsx` - Sign in/up UI component

### Modified Files
- `src/App.tsx` - Integrated auth, data sync, and auto-save effects
- `package.json` - Added `@supabase/supabase-js` dependency

## Features

✅ **Auto-Save**: Tasks sync to backend automatically when completed  
✅ **Daily Reset**: Blueprint auto-resets at midnight and saves history  
✅ **Cloud Backup**: All data persists in Supabase  
✅ **Multi-Device**: Sign in from any device and see your data  
✅ **Analytics**: All data feeds the insights dashboard  
✅ **RLS Security**: Only you can see your own data  

## Testing Locally

1. Sign up with a test email
2. Complete a few tasks
3. Go to Supabase dashboard → daily_data table
4. You should see rows with today's date and your completed tasks
5. Try completing more tasks - refresh the table to see updates
6. Check daily_blueprint table after midnight passes

## Troubleshooting

### "Missing Supabase credentials" error
- Check that env variables are set correctly
- Restart the dev server after adding env vars

### Data not saving
- Check browser console for error messages
- Verify you're signed in (Sign In button should show "Sign Out")
- Check Supabase table permissions and RLS policies

### Tasks reset unexpectedly
- This is the automatic midnight reset - working as designed!
- Check daily_blueprint table to see saved plans

## Next Steps

You can now:
1. Deploy to Vercel (env vars auto-configured)
2. Add more analytics features
3. Implement progress notifications
4. Add data export/reports
5. Build mobile app with same backend

The backend is fully set up and production-ready!
