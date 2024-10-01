const express = require("express");
const {
  createAdd,
  getAdds,
  updateAdd,
  comment,
  like,
  favorite,
} = require("../Controller/addsControllers");
const router = express.Router();

router.post("/adds/added", createAdd);
router.put("/adds/update", updateAdd);
router.get("/adds/getAdd", getAdds);
router.post("/adds/comment/:id", comment);
router.post("/adds/like/:id", like);
router.post("/adds/favorite/:id", favorite);

module.exports = router;
