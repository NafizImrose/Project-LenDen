import { auth } from "./auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const requireAuth = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
      query: {
        disableCookieCache: true,
      },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login first.",
      });
    }

    // Verified user information
    req.user = session.user;

    next();
  } catch (error) {
    console.log("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
