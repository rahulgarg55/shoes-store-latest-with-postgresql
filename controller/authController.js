const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ username, password: hashedPassword });


    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }


    res.status(200).json({ message: "Sign-in successful" });
  } catch (error) {
    console.error("Error during sign-in", error);
    res.status(500).json({ message: "Sign-in failed" });
  }
});

module.exports = router;
 