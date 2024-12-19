var express = require("express");
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const User = require("./users");
const LocalStrategy = require("passport-local").Strategy;
const upload = require("./multer");
const admit = require("./admit");
const student = require("./admit");
// let  cuetdata =require("./cuetd")
let cuetdata = require("./cuetd");
let marks = require("./admit");
const bodyParser = require("body-parser");
const path = require("path");
const { get } = require("http");
// const avatarModel = require('./avatar')

passport.use(new LocalStrategy(userModel.authenticate()));

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index");
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  console.log(user);
  res.render("profile", { user });
});

router.get("/signup", function (req, res) {
  res.render("signup");
});
///

// uploading of img
router.post(
  "/uploadAvatar",
  isLoggedIn,
  upload.single("avatar"),
  async function (req, res, next) {
    if (!req.file) {
      return res.status(404).send("No file is selected");
    }
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    // const avatar = await avatarModel.create({
    //   image: req.file.filename,
    //   user: user._id
    // })
    user.avatar = req.file.filename;
    await user.save();
    res.redirect("/profile");
  }
);

router.get("/quiz1", isLoggedIn, async function (req, res, next) {
  const user = await user({
    username: req.session.passport.user,
  });
  res.render("quiz1", { user });
});

router.get("/login", function (req, res, next) {
  res.render("login", { error: req.flash("error") });
});

router.post("/verify", async function (req, res, next) {
  const { otp, username, password } = req.body;
  console.log(otp, username, password);

  let user = await userModel.findOne({
    username: username,
  });
  console.log(user["otp"]);
  let isOtpValid = user["otp"] == otp;

  if (isOtpValid) {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/cuetlogin");
    });
  } else {
    res.render("verify", {
      error: req.flash("error"),
      phone: username,
      password: password,
      notOtpValid: !isOtpValid,
    });
  }
});

router.post("/signup", async function (req, res, next) {
  const { username, email, fullname, password, confirm } = req.body;
  let avatar = "profile.png";
  const userData = new userModel({
    username,
    email,
    fullname,
    confirm,
    avatar,
  });

  userModel.register(userData, password, async function (err) {
    if (err) {
      // Handle registration error
      console.error("Error registering user:", err);
      return res.redirect("/"); // Redirect to home page or registration page with an error message
    }

    // generate random otp
    let otp = Math.random().toString().substr(2, 6);
    console.log(otp);

    // sending otp
    await fetch("https://peaceful-moray-charming.ngrok-free.app/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp, // Convert otp to integer
        phone: username, // Convert username to integer
      }),
    });

    // store otp in db
    await userModel.updateOne({ username: username }, { $set: { otp: otp } });

    res.render("verify", {
      error: req.flash("error"),
      phone: username,
      password: password,
      notOtpValid: false,
    });
  });
});

// Login router
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/cuetlogin",
    failureRedirect: "/login", // Redirect back to login page if authentication fails
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/logout", function (req, res, next) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/forgot", function (req, res, next) {
  res.render("forget", { error: req.flash("error") });
});

router.post("/forgot", async function (req, res, next) {
  const { username } = req.body;
  let user = await userModel.findOne({
    username: username,
  });
  console.log(user, username);
  if (user) {
    // generate random otp
    let otp = Math.random().toString().substr(2, 6);
    console.log(otp);

    // sending otp

    await fetch("https://peaceful-moray-charming.ngrok-free.app/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: otp, // Convert otp to integer
        phone: username, // Convert username to integer
      }),
    });

    // store otp in db
    await userModel.updateOne({ username: username }, { $set: { otp: otp } });

    res.render("verify", {
      error: req.flash("error"),
      phone: username,
      password: null,
      notOtpValid: false,
    });
  } else {
    console.log("User Not found");
    res.redirect("/");
  }
});

router.post("/verifyForgot", async function (req, res, next) {
  const { otp, username, password } = req.body;
  console.log(otp, username, password);

  let user = await User.findOne({
    username: username,
  });
  console.log(user["otp"]);
  let isOtpValid = user["otp"] == otp;

  if (isOtpValid) {
    await user.setPassword(password, (err, user) => {
      if (!err) {
        user.save();
        passport.authenticate("local")(req, res, function () {
          res.redirect("/cuetlogin");
        });
      }
    });
  } else {
    res.render("verify", {
      error: req.flash("error"),
      phone: username,
      password: null,
      notOtpValid: !isOtpValid,
    });
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

// form

router.get("/form", function (req, res) {
  res.render("form");
});

// router.get("/")
// upload.fields

const photoFields = [
  {
    name: "photo",
    maxCount: 1,
  },
  {
    name: "photo10",
    maxCount: 1,
  },
  {
    name: "photo12",
    maxCount: 1,
  },
  {
    name: "addharphoto",
    maxCount: 1,
  },
];

router.post(
  "/form",
  isLoggedIn,
  upload.fields(photoFields),
  async function (req, res, next) {
    if (!req.files) {
      return res.status(404).send("No file is selected");
    }
    console.log(req.files);
    console.log(req.files["photo"][0].filename);
    const {
      cuetregnumber,
      Name,
      addhar,
      FatherName,
      MotherName,
      email,
      DOB,
      MobileNumber,
      Gender,
      Village,
      post,
      District,
      Sate,
      mm10,
      om10,
      mm12,
      om12,
      course,
      Department,
    } = req.body;
    let newstudent = new admit({
      Name,
      addhar: addhar,
      FatherName: FatherName,
      MotherName: MotherName,
      email: email,
      DOB: DOB,
      MobileNumber: MobileNumber,
      photo: req.files["photo"][0].filename,
      addharphoto: req.files["addharphoto"][0].filename,
      Gender: Gender,
      Village: Village,
      post: post,
      District: District,
      District: District,
      Sate: Sate,
      mm10: mm10,
      om10: om10,
      photo10: req.files["photo10"][0].filename,
      mm12: mm12,
      om12: om12,
      photo12: req.files["photo12"][0].filename,
      Department: Department,
      course: course,
      userid: req.session.passport.user,
      confirm: req.session.passport.user,
      cuetregnumber: cuetregnumber,
    });
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    console.log(user);
    console.log(newstudent);
    // res.send("working");
    await newstudent.save();

    res.redirect("profilestudents");
  }
);

router.get("/profilestudents", isLoggedIn, async (req, res) => {
  console.log(req.session.passport.user, typeof req.session.passport.user);
  const studentdata = await student.findOne({
    userid: req.session.passport.user,
  });
  console.log(studentdata);

  res.render("profilestudent", { studentdata });
});


router.get("/notice", (res, req) => {
  req.render("notice");
});

//routes  for the  cuet  form
router.get("/cuetform", (res, req) => {
  req.render("cuetform");
});

// its  the  code  for the  cuet  form action

router.post("/cuetform", async (req, res) => {
  let {
    Name,
    addhar,
    FatherName,
    MotherName,
    email,
    DOB,
    MobileNumber,
    Gender,
    om10,
    om12,
    cuetregnumber,
    password,
  } = req.body;

  let cuetd = new cuetdata({
    // userid:req.session.passport.user,
    Name,
    addhar,
    FatherName,
    MotherName,
    email,
    DOB,
    MobileNumber,
    Gender,
    om10,
    om12,
    cuetregnumber,
    password,
    // userid: req.session.passport.user,
    // password: req.session.passport.user,
  });

  // Save cuetdata to the database
  await cuetd.save();
  console.log(cuetd);

  res.send("data is saved");
});

router.get("/cuetlogin", (res, req) => {
  req.render("cuetlogin");
});

//this code  is  for  the  searching  of the user name

// router.use(bodyParser.json());

// Login endpoint

// // cuet lodin

router.post("/cuetverify", async (req, res) => {
  const { cuetregnumber, password } = req.body;

  

  const user = await cuetdata.findOne({ cuetregnumber, password });
  try {
    // Find user by username and password

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.render("form", { user });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/////payment

// admin
// router.get("/adminsub",(res,req)=>{
//   req.render("admin")
// })
router.get("/admin", (res, req) => {
  req.render("admin");
});

router.post("/adminsub", async (req, res) => {
  const { course, password, username } = req.body;
  console.log(course, password, username);

  if (username === "bbau@123" && password === "1234") {
    const courcestu = await student.find({ course });
    let i = 1;

    try {
      // Find user by usee and password

      if (!courcestu) {
        return res.status(401).json({ message: "not  children" });
      }

      // If user found, return success message or user data
    
      res.render("adminstu", { courcestu, i });

      // res.render("form",{user})
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.get("/adminstu", (res, req) => {
  req.render("adminstu");
});

router.get("/stumarks:", (res, req) => {
  req.render("stumarks");
});

// 
router.post("/stumarks/:cuetregnumber/:course", async(req, res) => {
  const {cuetregnumber,course}= req.params;


  console.log("cuetregnumber",cuetregnumber);
  // console.log("course",course);
  let students = await admit.findOne({course,cuetregnumber});
  // console.log(students);

  try {
      if (!students) {
        return res.status(401).json({ message: "not  children" });
      }
      // If student found, return success message or user da
      res.render("stumarks",{students,marks});
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  
});

// router.post("/updatemarks",(req,res)=>{
// res.render("/updatemarks.ejs")
// }
// )


/// UPADATION OF MARKS
router.post("/updatemarks/:cuetregnumber", async(req, res) => {
   const{ cuetregnumber,Name}=req.params
  //  console.log(cuetregnumber)

   let students = await student.findOne({cuetregnumber});
  //  console.log("marsk",students);
   students.Marks.subject1 = req.body.subject1;
    students.Marks.subject2 = req.body.subject2;
    students.Marks.subject3 = req.body.subject3;
    students.Marks.subject4 = req.body.subject4;
    students.Marks.subject5 = req.body.subject5;
    students.Marks.subject6 = req.body.subject6;
 
  await students.save();
  // console.log(students);
  // res.render("adminstu",student)

  res.send("data is saved");
});




// Rult login
// Es

router.get("/resultlogin",async(req,res)=>{
  // console.log("first")
res.render("resultlogin.ejs")
})
router.post("/resultverify",async(req,res)=>{
  const { cuetregnumber, password } = req.body;
  console.log("hgjh",cuetregnumber)
   const students = await student.findOne({ cuetregnumber })
   res.render("result",{students})
   console.log(students)


})

module.exports = router;
