import jwt from "jsonwebtoken"
import {usersType} from "../repositories/types/types";
import {settings} from "../repositories/db";
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJWT(user: usersType) {
        const token = jwt.sign({userId: user._id}, settings.JWT_SECRET, {expiresIn: "10m"})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId((result.userId))
        } catch (error) {
            return null
        }
    }
}