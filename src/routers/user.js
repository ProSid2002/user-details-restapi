const express = require("express");
const mailer = require("../mailer/mailer");
const User = require("../models/user");

const router = new express.Router();

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function sanitizeUser(user) {
  user.name = toTitleCase(user.name);
  user.hobbies = user.hobbies.map((item) => {
    return toTitleCase(item);
  });
}

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  sanitizeUser(user);
  try {
    await user.save();
    res.status(201).send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/send", async (req, res) => {
  const { html } = req.body;
  const mailData = mailer.mailOptions(html);
  try {
    const response = await mailer.transporter.sendMail(mailData);
    res.status(250).send(response);
  } catch (error) {
    res.status(424).send(error);
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.find({ _id });
    if (!user) {
      res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/user/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findOneAndDelete({ _id });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/user/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "phone", "hobbies"];
  const isValidOperation = updates.every((it) => allowedUpdates.includes(it));
  const _id = req.params.id;
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    sanitizeUser(req.body);
    updates.forEach((update) => {
      return (user[update] = req.body[update]);
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
