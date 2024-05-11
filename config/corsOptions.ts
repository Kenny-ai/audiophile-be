// allowedOrigins is an array of domains that can access the server
type Origin = string | undefined;

export const allowedOrigins: Origin[] = [
  "http://localhost:3000",
  "https://kb-audiophile.vercel.app/",
];

export const corsOptions = {
  credentials: true,
  origin: (origin: any, callback: any) => {
    // remove !== origin after develpoment
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
