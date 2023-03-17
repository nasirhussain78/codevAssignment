import UserModel from "../models/userModel.js";
import FeedModel from "../models/FeedModel.js";
import CommentModel from "../models/CommentModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const saltrounds = 10;


const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}


const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}


class Controller {
    //1✅Register user
    async createUser(req, res) {
        try {
            const data = req.body;
            const { name, email, password } = data;

            if (!isValidRequestBody(data)) {
                return res.status(400).send({ status: false, message: 'Please provide details' })
            }

            if (!isValid(name)) {
                return res.status(400).send({ status: false, message: 'name is required' })
            }
            //Email validation
            if (!isValid(email)) {
                return res.status(400).send({ status: false, message: 'Email is required' })
            }

            if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) {
                return res.status(400).send({ status: false, msg: "Please provide a valid email" })
            }

            const duplicateEmail = await UserModel.findOne({ email });

            if (duplicateEmail) {
                return res.status(400).send({ status: false, message: `${email} email address is already registered` })
            }

            if (!isValid(password)) {
                return res.status(400).send({ status: false, message: 'password is required' })
            }

            let hashPassword = bcrypt.hashSync(password, saltrounds);

            const userData = { name, email, password: hashPassword, };

            const result = await UserModel.create(userData);

            return res.status(201).send({ status: true, msg: "successfully created", data: result });

        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }



    //2✅ feed
    async createFeed(req, res) {
        try {
            let data = req.body;
            if (!isValid(userId)) {
                return res.status(400).send({ status: false, message: "userId is required" })
            }
            if (!isValid(content)) {
                return res.status(400).send({ status: false, message: "content is required" })
            }
            let result = await FeedModel.create(data);
            return res.status(201).send({ status: true, msg: "successfully created", data: result });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    
    //3✅ comment
    async createComment(req, res) {
        try {
            let data = req.body;
            let feed = FeedModel.findById({ feed: data.feed, isDeleted: false });
            if (!feed) return res.status(400).send({ status: false, msg: "feed is not present" });
            let result = await CommentModel.create(data);
            await FeedModel.findOneAndUpdate(
                { _id: data.feed },
                { $push: { comment: result._id } }
            );

            return res.status(201).send({ status: true, msg: "successfully created", data: result });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    
    
    //4✅  all the comments w.r.t. feed
    async allComment(req, res) {
        try {
            const data = req.query;

            let result = await FeedModel.find({ feedId: data.feedId, isDeleted: false }).populate("comment");
            if (result) {
                return res.send({ status: false, data: result });
            } else {
                return res.status(400).send({ status: false, msg: "feed is not present" });
            }
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    }


    //5✅  delete comment
    async deleteComment(req, res) {
        try {
            const id = req.query.id
            const comment = await CommentModel.findOne({ _id: id, isDeleted: false })

            if (!comment) return res.status(404).send({ status: false, message: 'not found' })

            const result = await CommentModel.findOneAndUpdate({ _id: id }, { $set: { isDeleted: true } }, { new: true })
            await FeedModel.findOneAndUpdate(
                { _id: comment.feed },
                { $pull: { comment: result._id } }
            );
            return res.send({ status: true, msg: "comment successfully deleted", data: result });
        }
        catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    } 
    
        //6✅ Login
        async loginUser(req, res) {
            try {
                let data = req.body
                if (!isValidRequestBody(data)) {
                    return res.status(400).send({ status: false, message: 'Please provide employee details' })
                }
                const { email, password } = data
    
                if (!isValid(email)) {
                    return res.status(400).send({ status: false, message: "email is required" })
                }
                if (!isValid(password)) {
                    return res.status(400).send({ status: false, message: "passwords is required" })
                }
    
                let user = await UserModel.findOne({ email });
    
                if (!user)
                    return res.status(404).send({
                        status: false,
                        msg: "Login failed! No user found with the provided email.",
                    });
    
                const isValidPassword = await bcrypt.compare(password, user.password)
    
                if (!isValidPassword)
                    return res.status(404).send({
                        status: false,
                        msg: "Login failed! Wrong password.",
                    });
    
                //token 1 hour expire time
                let token = jwt.sign(
                    {
                        userId: user._id,
                    },
                     "codevyasa",
                    { expiresIn: "1h" }
                );
                res.status(200).setHeader("x-api-key", token);
                return res.status(201).send({ status: "LoggedIn", message: 'Success', TOKEN: token });
            }
            catch (error) {
                return res.status(500).send({ status: false, msg: error.message })
            }
        }
}


export default new Controller()

