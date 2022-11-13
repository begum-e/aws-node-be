import { Controller, Get, All, Req, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(['ping'])
  ping(): any {
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    };
  }

  @Get(['', 'products*', 'cart*'])
  handle(@Req() req, @Res() res) {
    return this.appService.handle(req, res);
  }


}
