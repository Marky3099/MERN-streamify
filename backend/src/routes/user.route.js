import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptRejectFriendRequests,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequests,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

// Friend Requests Routes
router.get("/friend-request", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendRequests);
router.post("/friend-request/:id", sendFriendRequests);
router.put("/friend-request/:id/:action", acceptRejectFriendRequests);

export default router;
