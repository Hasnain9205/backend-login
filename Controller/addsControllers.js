const Adds = require("../models/adds");

exports.createAdd = async (req, res) => {
  const { userId, title, image, expiresAt } = req.body;

  try {
    const existingAdd = await Adds.findOne({ userId, title });
    if (existingAdd) {
      res.status(400).json({ message: "User has already added this item" });
    }
    const newAdd = new Adds({
      userId,
      title,
      image,
      expiresAt,
    });
    await newAdd.save();
    res.status(200).json({ message: "Add successfully created ", newAdd });
  } catch (error) {
    console.error("Error creating ad:", error);
    res.status(500).json({ message: "error creating Add", error });
  }
};

exports.updateAdd = async (req, res) => {
  const { addId, title, image, expiresAt } = req.body;

  try {
    if (!addId) {
      return res.status(400).json({ message: "addId is required" });
    }
    console.log("Received addId:", addId);
    const existingAdd = await Adds.findById(addId);
    if (!existingAdd) {
      return res.status(404).json({ message: "Add not found" });
    }

    existingAdd.title = title || existingAdd.title;
    existingAdd.image = image || existingAdd.image;
    existingAdd.expiresAt = expiresAt || existingAdd.expiresAt;

    await existingAdd.save();
    res.status(200).json({ message: "Add successfully updated", existingAdd });
  } catch (error) {
    console.error("Error updating ad:", error);
    res.status(500).json({ message: "Error updating Add", error });
  }
};

exports.getAdds = async (req, res) => {
  try {
    const adds = await Adds.find().sort({ createAt: -1 });
    res.status(200).json({ message: "Show Adds order by time", adds });
  } catch (error) {
    res.status(500).json({ message: "Error searching adds", error });
  }
};

exports.comment = async (req, res) => {
  try {
    const { comment, userId } = req.body;
    const add = await Adds.findById(req.params.id);
    if (add) {
      add.comments.push({ userId, comment });
      await add.save();
      res.status(200).json({ message: "comment added successfully", add });
    } else {
      res.status(400).json({ message: "Add not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "server error", error });
  }
};

exports.like = async (req, res) => {
  try {
    const add = await Adds.findById(req.params.id);
    if (add) {
      add.likes += 1;
      await add.save();
      res.status(200).json({ message: "like added successfully" });
    } else {
      res.status(400).json({ message: "add not found", add });
    }
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};

exports.favorite = async (req, res) => {
  try {
    const { userId } = req.body;
    const addId = req.params.id;
    console.log("userId:", userId);
    console.log("addId:", addId);
    const add = await Adds.findById(addId);
    if (!add) {
      return res.status(404).json({ message: "Add not found" });
    }
    if (add.favorites.includes(userId)) {
      return res
        .status(404)
        .json({ message: "User has already favorite this add" });
    }
    add.favorites.push(userId);
    await add.save();
    res.status(200).json({ message: "Add added to favorite" });
  } catch (error) {
    res.status(400).json({ message: "Server error", error });
  }
};
