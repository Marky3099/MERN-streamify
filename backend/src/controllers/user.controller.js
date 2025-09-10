import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });

    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error fetching recommended users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const user = await User.findById(currentUserId)
      .select("friends")
      .populate("friends", "firstName lastName profilePic");
    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendFriendRequests = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;
    //preventing sending req to self
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }
    //check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found!" });
    }
    //prevents request to friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "Already friends" });
    }
    //check if req is already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    //prevents duplicate request
    if (existingRequest) {
      return res.status(400).json({ message: "Friend Request already Exists" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptRejectFriendRequests = async (req, res) => {
  try {
    const { id: requestId, action } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to respond to this request" });
    }
    if (action === "accept") {
      friendRequest.status = "accepted";
      await friendRequest.save();

      // Add each userid to the other's friends array
      await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipient },
      });

      await User.findByIdAndUpdate(friendRequest.recipient, {
        $addToSet: { friends: friendRequest.sender },
      });

      res.status(200).json({ message: "Friend request accepted" });
    } else {
      friendRequest.status = "rejected";
      await friendRequest.save();

      res.status(200).json({ message: "Friend request rejected" });
    }
  } catch (error) {
    console.log("Error in acceptRejectFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const incomingRequests = await FriendRequest.find({
      recipient: currentUserId,
      status: "pending",
    }).populate("sender", "firstName lastName profilePic");

    const acceptedRequests = await FriendRequest.find({
      sender: currentUserId,
      status: "accepted",
    }).populate("recipient", "firstName lastName profilePic");

    res.status(200).json({ incomingRequests, acceptedRequests });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getOutgoingFriendRequests = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const outgoingRequests = await FriendRequest.find({
      sender: currentUserId,
      status: "pending",
    }).populate("recipient", "firstName lastName profilePic");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
