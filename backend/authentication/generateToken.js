const jwt = require("jsonwebtoken");

const generateToken = async (user) => {
  try {
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user.tokens = user.tokens || [];
    user.tokens.push({ token });

    await user.save();

    return token;
  } catch (error) {
    throw new Error("Token generation failed");
  }
};

module.exports = generateToken;
