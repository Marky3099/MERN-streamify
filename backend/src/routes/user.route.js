import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptRejectFriendRequests,
  getMyFriends,
  getRecommendedUsers,
  sendFriendRequests,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequests);
router.put("/friend-request/:id/:action", acceptRejectFriendRequests);

export default router;
