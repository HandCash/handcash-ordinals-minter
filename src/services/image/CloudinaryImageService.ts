import {ApiError, RequestParams} from "../Types.js";
import * as fs from "fs";

type Params = {
    apiKey: string;
    cloudName: string;
    uploadPreset?: string;
};

export default class CloudinaryImageService {
    static baseApiEndpoint = 'https://api.cloudinary.com';
    apiKey: string;
    cloudName: string;
    uploadPreset: string;

    constructor({apiKey, cloudName, uploadPreset}: Params) {
        this.apiKey = apiKey;
        this.cloudName = cloudName;
        this.uploadPreset = uploadPreset ?? 'ml_items';
    }

    async uploadImage(filePath: string): Promise<{ imageUrl: string }> {
        const formData = new FormData();
        if (filePath.indexOf('http') === 0) {
            formData.append("file", filePath);
        } else {
            formData.append("file", new Blob([fs.readFileSync(filePath)]), "[PROXY]");
        }
        formData.append("api_key", this.apiKey);
        formData.append("upload_preset", this.uploadPreset);
        const requestParameters: RequestParams = {
            url: CloudinaryImageService.baseApiEndpoint + `/v1_1/${this.cloudName}/image/upload`,
            requestInit: {
                method: 'POST',
                body: formData,
            }
        };
        const data = await CloudinaryImageService.handleRequest<{ secure_url: string }>(requestParameters, new Error().stack);
        return {imageUrl: data.secure_url};
    }

    static async handleRequest<T>(requestParameters: RequestParams, stack: string | undefined): Promise<T> {
        const response = await fetch(requestParameters.url, requestParameters.requestInit);
        if (response.ok) {
            return (await response.json()) as T;
        } else {
            throw await CloudinaryImageService.handleApiError({request: requestParameters, response, stack});
        }
    }

    static async handleApiError(result: {
        stack?: string;
        request: RequestParams;
        response?: Response;
    }) {
        const errorMessage = await result.response?.text() || 'Unknown error';
        return new ApiError({
            method: result.request.requestInit.method as string,
            url: result.request.url,
            httpStatusCode: result.response?.status ?? -1,
            errorMessage,
            stack: result.stack,
        });
    }
}
