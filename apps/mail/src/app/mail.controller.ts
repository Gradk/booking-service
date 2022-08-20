import { Controller, Get } from '@nestjs/common';

import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  test() {
    console.log('______________________');
    console.log(__dirname + '/assets/templates');
    return 'test';
  }
}
