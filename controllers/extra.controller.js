import Waitlist from "../models/Waitlist.models.js";

const joinWaitlist = async (req, res) => {
  try {
    const { email } = req.params;
    const alreadyExisting = await Waitlist.findOne({email});
    if (alreadyExisting)
      return res.status(200).json({ message: "Added to Wishlist" });
    const waitlist = await Waitlist.create({ email });
    return res.status(200).json({ message: "Added to Wishlist" });
  } catch (error) {
    console.log("join waitilist error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const contactUs = async (req, res) => {
  return res.status(200).json({"message":"success"})
};

export default { joinWaitlist, contactUs };
