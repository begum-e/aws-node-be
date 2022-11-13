import { Injectable } from '@nestjs/common';
import { Axios } from 'axios';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async handle(request, response) {
    console.log("App Service Handle");

    const { method, path, originalUrl, body, headers } = request;

    console.log("originalUrl->", originalUrl);

    if (!path) {
      response.status(502).json({ error: 'Cannot process request' });
    }
    const recipient = path.split("/")[1];
    const target = process.env[recipient];
    console.log("target->", target);

    try {
      const axiosConfig = {
        method: method,
        url: `${target}${originalUrl}`,
        headers: {
          Authorization: headers.authorization,
        },
        ...(Object.keys(body || {}).length > 0 && { data: body }),
      };
      console.log("axiosConfig->", axiosConfig);

      const httpResponse: any = await firstValueFrom(
        this.httpService.request(axiosConfig),
      );

      response.send(httpResponse.data);

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        response.status(status).json(data);
      } else {
        response.status(502).json({ error: 'Cannot process request' });
      }
    }

  }

}
