/**
 * @function Profile
 * @description Retrieves the profile information of the authenticated user.
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {Function} next - next middleware function.
 * @throws {Error} In case of any error during fetching profile.
 * @returns {Response} returns a JSON response with user's profile information
 */
exports.Profile = async (req, res, next) => {
  try {
    const user = req.user;

    return res.status(200).json({
      name: user.name,
      email: user.email,
      city: user.city,
      pincode: user.pincode,
    });
  } catch (error) {
    console.log(
      `Error: src > controllers > Profile > index.js > Profile - ${error.message}`
    );
    next(error);
  }
};