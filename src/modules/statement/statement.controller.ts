import { Controller, Get, Res } from '@nestjs/common';
import PDFParser from 'pdf2json';
import { StatementService } from '@statement/statement.service';
import { Transaction } from '@app/models/transaction.model';
import { IDFCPattern } from '@app/enums/idfc.pattern';

@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @Get('extractData')
  async runTest(@Res() res) {
    try {
      const pdfParser = new PDFParser();
      const result = await pdfParser.loadPDF(
        'src/modules/statement/sample.pdf',
      );
      if (result) console.log('PDF parsed ...');
      pdfParser.on('pdfParser_dataError', (errData) =>
        console.error(errData.parserError),
      );
      await pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const totalPages: number = pdfData['formImage']['Pages'].length;
        let transactions: Transaction[] = [];
        //check PDF structure
        const pdfStructure = this.statementService.checkIDFCPattern(
          pdfData['formImage']['Pages'][0]['Texts'],
        );
        for (let index = 0; index < totalPages; index++) {
          const statements =
            pdfStructure === IDFCPattern.latestMobile
              ? this.statementService.getIDFCMobileLatestStatement(
                  index,
                  pdfData,
                )
              : this.statementService.getIDFCDesktopLatestStatement(
                  index,
                  pdfData,
                );
          if (statements != null) {
            if (statements.length != 0) {
              if (transactions.length == 0) transactions = statements;
              else transactions = [...transactions, ...statements];
            }
          }
        }
        let quickSummary;
        if (transactions.length != 0)
          quickSummary = this.statementService.getQuickSummary(transactions);
        return res.json({ quickSummary: quickSummary, summary: transactions });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
