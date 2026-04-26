import { Response } from "express";

interface ISuccessResponse<T> {
    success: true;
    message: string;
    data: T;
    httpStatusCode?: number;
}

interface IErrorResponse {
    success: false;
    message: string;
    error?: string;
    httpStatusCode?: number;
}


type IResponseData<T> = ISuccessResponse<T> | IErrorResponse;

export  const sendResponse = <T>(res: Response, responseData: IResponseData<T>): void => {
    const statusCode = responseData.httpStatusCode || (responseData.success ? 200 : 500);
    res.status(statusCode).json(responseData);
};

