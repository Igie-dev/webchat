import express from "express";
import verifyJWT from "../middleware/verifyJWT.js";
import {
  getUserChannels,
  verifyUserInChannel,
  getChannelMessages,
  getChannel,
  getUserGroups,
  deleteChannel,
} from "../controller/channelController.js";
const router = express.Router();
router.use(verifyJWT);

router.route("/userchannel/:userId").get(getUserChannels);

router.route("/usergroup/:userId").get(getUserGroups);

router.route("/:channelId").get(getChannel);

router.route("/verifyuser/:channelId/:userId").get(verifyUserInChannel);

router.route("/messages/:channelId").get(getChannelMessages);

router.route("/:channelId/:userId").delete(deleteChannel);

export default router;
