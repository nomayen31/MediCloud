import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";

const getAccessToken = (payload : JwtPayload) => {
    const AccessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions)
    return AccessToken
}


const getRefreshToken = (payload : JwtPayload) => {
    const RefreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions)
    return RefreshToken
}


export const tokenUtils = { getAccessToken, getRefreshToken }