import { type } from "os";

export class AnyObject {
    [key: string]: any;
}

export interface ResponseModel {
    key: string,
    value: string,
    [key: string]: any
}