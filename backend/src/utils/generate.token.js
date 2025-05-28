import jwt from "jsonwebtoken"
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      userId: user.userId,
      username: user.userName,
      municipalityId: user.municipalityId
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )
}