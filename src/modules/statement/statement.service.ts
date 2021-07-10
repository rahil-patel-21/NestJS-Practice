import { Injectable } from '@nestjs/common';
import { ScrapModel } from '@app/models/scrap.model';
import moment from 'moment';
import PDFParser from 'pdf2json';
import { Transaction } from '@app/models/transaction.model';

@Injectable()
export class StatementService {
  public async extractPDFData() {
    try {
      const pdfParser = new PDFParser();
      const result = await pdfParser.loadPDF(
        'src/modules/statement/sample.pdf',
      );
      pdfParser.on('pdfParser_dataError', (errData) =>
        console.error(errData.parserError),
      );
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const totalPages: number = pdfData['formImage']['Pages'].length;
        for (let index = 0; index < totalPages; index++) {
          this.getStatementOfPage(index, pdfData);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  private getStatementOfPage(page: number, pdfData: any) {
    try {
      const textData: [any] = pdfData['formImage']['Pages'][page]['Texts'];
      let xTransactionType = 0;
      let xTransactionDescription = 0;
      let xTransactionCategory = 0;
      let xTransactionAmount = 0;
      const scrapData: ScrapModel[] = [];
      const transactions: Transaction[] = [];
      let minY = 0;
      textData.forEach((element) => {
        const rawText = element['R'][0]['T'].toString();
        const scrapModel = new ScrapModel();
        scrapModel.colorCode = element['oc'];
        scrapModel.xDirection = element['x'];
        scrapModel.yDirection = element['y'];
        scrapModel.content = decodeURIComponent(rawText);
        if (scrapModel.content.length == 12) {
          const splittedList: string[] = scrapModel.content
            .replace(',', '')
            .split(' ');
          if (splittedList.length == 3) {
            const monthFormat = splittedList[1];
            const dateFormat = splittedList[0];
            const yearFormat = splittedList[2];
            const momentDate = moment(
              monthFormat + '-' + dateFormat + '-' + yearFormat,
              'MMM-DD-YYYY',
            );
            const transactionDate: Date = new Date();
            transactionDate.setFullYear(momentDate.toObject().years);
            transactionDate.setMonth(momentDate.toObject().months);
            transactionDate.setDate(momentDate.toObject().date);
            scrapModel.date = transactionDate;
            if (minY == 0) minY = scrapModel.yDirection;
          }
        }
        if (
          scrapModel.yDirection >= minY &&
          minY != 0 &&
          !scrapModel.content.includes(
            'Page ' +
              (page + 1).toString() +
              ' of ' +
              pdfData['formImage']['Pages'].length.toString(),
          )
        ) {
          scrapData.push(scrapModel);
          if (scrapModel.xDirection < 6.5 && scrapModel.xDirection > 2.5)
            xTransactionType = scrapModel.xDirection;
          else if (scrapModel.xDirection < 15.5 && scrapModel.xDirection > 6.5)
            xTransactionDescription = scrapModel.xDirection;
          else if (scrapModel.xDirection < 25.5 && scrapModel.xDirection > 20.5)
            xTransactionCategory = scrapModel.xDirection;
          else if (scrapModel.xDirection < 40.5 && scrapModel.xDirection > 25.5)
            xTransactionAmount = scrapModel.xDirection;
        }
      });
      let transaction = new Transaction();
      scrapData.forEach((element) => {
        if (element.date != null) {
          if (transaction.amount == null) transaction.date = element.date;
          else {
            transactions.push(transaction);
            transaction = new Transaction();
            transaction.date = element.date;
          }
        } else if (element.xDirection == xTransactionType)
          transaction.type = element.content;
        else if (element.xDirection == xTransactionDescription) {
          if (transaction.description == null)
            transaction.description = element.content;
          else
            transaction.description = transaction.description + element.content;
        } else if (element.xDirection == xTransactionCategory) {
          if (transaction.category == null)
            transaction.category = element.content;
          else transaction.category = transaction.category + element.content;
        } else if (
          element.xDirection == xTransactionAmount ||
          (element.xDirection < 40.5 && element.xDirection > 25.5)
        ) {
          console.log(element.content);
          transaction.amount = parseFloat(
            element.content.replace('₹', '').replace('+', '').replace(',', ''),
          );
          if (element == scrapData[scrapData.length - 1])
            transactions.push(transaction);
        }
      });
      console.log(transactions);
    } catch (error) {
      console.log(error);
    }
  }
}
