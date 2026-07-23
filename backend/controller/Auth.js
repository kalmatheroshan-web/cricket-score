const UserModel = require("../dbs/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../dbs/user");
const Team = require("../dbs/teams");

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 2. Verify password 
        const isMatch = user.password === password;

        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: "Invalid credentials"
            });
        }

        // 3. Generate a JWT Token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || "YOUR_JWT_SECRET",
            { expiresIn: "7d" } // Token expires in 7 days
        );

        // 4. Configure Cookie Options for Mobile/Web compatibility
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // True in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds 
        };

        // 5. Set the cookie and send the response
        res.cookie("token", token, cookieOptions).status(200).send({
            success: true,
            message: "Login successful",
            user,token
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({
            success: false,
            message: "Internal server error during login"
        });
    }
}

async function sing_up(req, res) {
    try {
        const { username, password, email } = req.body;

        // 1. Check if user already exists
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "Username or Email already registered"
            });
        }

        const user = new UserModel({
            username,
            password,
            email
        });

        await user.save();

        res.status(201).send({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "User creation error"
        });
    }
}

async function logout(req, res) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return res.status(200).send({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout controller error:", error);
        return res.status(500).send({
            success: false,
            message: "Error during logout process"
        });
    }
}

async function getScorer(req, res) {
    try {
        const scorers = await User.find({ role: { $in: ['scorer', 'admin'] } })
            .select(['username', 'venues', 'state', 'role']);

        const teams = await Team.find().select('teamName shortName');

        let val = scorers.find(ele => ele.role == 'admin');
        val = (val?.venues);

        return res.status(200).json({
            success: true,
            count: scorers.length,
            scorers,
            teams,
            venues: val
        });
    } catch (error) {
        console.error("Error fetching scorers:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching scorers"
        });
    }
}

module.exports = { login, sing_up, logout, getScorer };