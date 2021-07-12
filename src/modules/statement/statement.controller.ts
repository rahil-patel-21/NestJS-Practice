import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import PDFParser from 'pdf2json';
import { StatementService } from '@statement/statement.service';
import { Transaction } from '@app/models/transaction.model';
import { IDFCPattern } from '@app/enums/idfc.pattern';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { StatementDTO } from './dto/statement.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { extname } from 'path';
import { diskStorage } from 'multer';
import fs from 'fs';

@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService) {}

  @ApiConsumes('multipart/form-data')
  @Post('extractData')
  @ApiBody({ type: StatementDTO })
  @UseInterceptors(
    FileInterceptor('pdfFile', {
      storage: diskStorage({
        destination: './',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async runTest(@UploadedFile() file, @Res() res) {
    try {
      const pdfParser = new PDFParser();
      const result = await pdfParser.loadPDF(file['path']);
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
        fs.unlinkSync(file['path']);
        return res.json({ quickSummary: quickSummary, summary: transactions });
      });
    } catch (error) {
      console.log(error);
    }
  }
}
