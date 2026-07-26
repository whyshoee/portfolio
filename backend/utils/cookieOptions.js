// backend/utils/cookieOptions.js
const isProd = process.env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,                    // JS cannot read this cookie
  secure:   isProd,                  // HTTPS only in production
  sameSite: isProd ? 'none' : 'lax', // 'none' needed for cross-origin on Render/Vercel
  maxAge:   7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
};
