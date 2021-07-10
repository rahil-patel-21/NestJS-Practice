import { Controller, Get } from '@nestjs/common';
import { StatementService } from '@statement/statement.service';

@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @Get('extractData')
  async runTest() {
    this.statementService.extractPDFData();
    return true;
  }
}
