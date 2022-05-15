import express from "express";
const router = express.Router();
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import userModel from "../models/user.js";

router.post("/signup", async (req, res) => {
  const resume = req?.files?.resume;
  try {
    const user = req.body;
    const { password, cpassword } = user;

    if (password !== cpassword) {
      return res.send({ msg: "Password do not matches !" });
    }
    const hash = bcryptjs.hashSync(req.body.password, 10);
    user.password = hash;

    const saveUser = await new userModel(user);
    await saveUser.save();
    const filename = `resume/${user.email}.pdf`;
    resume.mv(filename, (error) => {
      if (error) console.log(error);
    });
    delete saveUser.password;
    saveUser.resume = filename;

    // sending mail on account creation...
    const email = user.email;
    const name = user.name;
    const transporter = nodemailer.createTransport({
      service: "hotmail",

      auth: {
        user: process.env.HOTMAIL_USER,
        pass: process.env.HOTMAIL_PASS,
      },
    });
    const message = {
      from: "javascript.developer@outlook.com",
      to: email,
      subject: "Accout created succesfully !",

      html: `<h2>Hello ${name} your account has been created sucessfully !</h2>
      <p>from studieszone</p>
      `,
    };
    const mailStatus = await transporter.sendMail(message);

    res.status(201).send({ user: saveUser });
  } catch (error) {
    console.log({ error });
    res
      .status(401)
      .send({ msg: "Email exists already , all fields are mandatory " });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne(
    { email },
    {
      name: 1,
      email: 1,
      dob: 1,
      age: 1,
      _id: 1,
      password: 1,
      resume: 1,
    }
  );
  const matches = await bcryptjs.compare(password, user ? user.password : "");

  if (matches) {
    res.status(201).json({ user });
  } else {
    res.status(401).json({
      msg: "Invalid credentials !!!",
    });
  }
});

export default router;
