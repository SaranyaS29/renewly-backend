const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Sign Up
// exports.signup = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).send('User already exists');
//     }

//     // Hash the password before saving to DB
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // Create a new user
//     const newUser = new User({ email, password: hashedPassword });

//     // Save the new user to the database
//     await newUser.save();

//     // Generate a token (JWT) with the user's _id
//     const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

//     // Return the response with the token and userId
//     res.status(201).json({
//       token,
//       _id: newUser._id,  // Return the user ID
//       email: newUser.email,
//     });
//   } catch (error) {
//     console.error('Error during signup:', error);
//     res.status(500).send('Server Error');
//   }
// };
exports.signup = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    // Check if the user already exists by email or mobile
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).send('User with this email or mobile already exists');
    }

    // Hash the password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with name and mobile
    const newUser = new User({
      name,
      mobile,
      email,
      password: hashedPassword
    });

    // Save the new user to the database
    await newUser.save();

    // Generate a token (JWT) with the user's _id
    const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    // Return the response with the token and user details
    res.status(201).json({
      token,
      _id: newUser._id,
      name: newUser.name,
      mobile: newUser.mobile,
      email: newUser.email
    });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send('Server Error');
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) return res.status(400).send('Invalid Credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid Credentials');

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user._id ,name:user.name,phone:user.mobile }); // 👈 Added userId here
  } catch (error) {
    res.status(500).send('Server Error');
  }
};

