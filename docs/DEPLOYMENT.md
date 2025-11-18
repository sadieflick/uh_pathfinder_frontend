# Deployment Configuration

## Environment Variables

### Frontend (Netlify)

Create a `.env` file or set environment variables in Netlify:

```bash
# Optional: Backend API URL
# If not set, will default to http://localhost:8000/api/v1 (dev) or fallback to demo data
VITE_API_URL=https://your-backend-api.com/api/v1
```

**Note:** If `VITE_API_URL` is not set or the backend is unreachable, the application will automatically use fallback demo data. This allows the frontend to be fully functional even without a deployed backend.

## Building for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Netlify Deployment

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables** (optional):
   - Add `VITE_API_URL` if you have a deployed backend
   - Leave empty to use fallback demo data

## Fallback Mode

The application includes intelligent fallback handling:

- **With Backend**: Full database integration with 1,016+ occupations
- **Without Backend**: 15+ sample occupations with complete program data
- **Automatic Detection**: Seamlessly switches based on API availability
- **Zero Configuration**: Works out of the box for demos

All features remain fully functional in fallback mode, making it perfect for:
- Initial demos and presentations
- Development without backend setup
- Graceful degradation if backend goes down
- Showcasing UI/UX without database dependency

## Testing Fallback Mode

To test fallback mode locally:

1. Don't set `VITE_API_URL` or set it to an invalid URL
2. Or stop your backend server
3. Run the frontend - it will automatically use fallback data

```bash
npm run dev
```

You'll see console warnings when fallback data is being used, but the application will work perfectly.
