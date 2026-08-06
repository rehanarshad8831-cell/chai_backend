import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message: "ok"
    // })
console.log(req.files,'files')

    const { fullName, email, username, password } = req.body;
    console.log("email", email);

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })
    console.log("existedUser", existedUser);
    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalpath = req.files?.avatar?.[0]?.path;
    const coverImageLocalpath = req.files?.coverImage?.[0]?.path;


    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar is required");
    }


    // const avatar = await uploadOnCloudinary
    //     (avatarLocalpath)
    // const coverImage = await uploadOnCloudinary
    //     (coverImageLocalpath)

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar upload failed");
    // }


    const user = await User.create({
        fullName,
        avatar: 'http://google.com' || "",
        coverImage: "http://google.com" || "",
        email,
        username: username.toLowerCase(),
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")


    if (!createdUser) {
        throw new ApiError(500, "something went wrong, please try again later");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"))

})


export {
    registerUser,
}