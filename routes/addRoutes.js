const express = require("express");
const {
  createAdd,
  getAdds,
  updateAdd,
  comment,
  like,
  favorite,
} = require("../Controller/addsControllers");
const authenticateToken = require("../middleware/authentication");
const router = express.Router();

router.post("/adds/added", authenticateToken, createAdd);
router.put("/adds/update", authenticateToken, updateAdd);
router.get("/adds/getAdd", getAdds);
router.post("/adds/comment/:id", authenticateToken, comment);
router.post("/adds/like/:id", authenticateToken, like);
router.post("/adds/favorite/:id", authenticateToken, favorite);

module.exports = router;
