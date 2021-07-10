import { Module } from '@nestjs/common';
import { StatementController } from '@statement/statement.controller';
import { StatementService } from '@statement/statement.service';

@Module({
  controllers: [StatementController],
  providers: [StatementService],
  exports: [StatementService],
})
export class StatementModule {}
