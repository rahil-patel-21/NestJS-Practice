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
        'src/modules/statement/sample3.pdf',
      );
      pdfParser.on('pdfParser_dataError', (errData) =>
        console.error(errData.parserError),
      );
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        const totalPages: number = pdfData['formImage']['Pages'].length;
        let transactions: Transaction[] = [];
        // for (let index = 0; index < totalPages; index++) {
        const statements = this.getIDFCMobileLatestStatement(0, pdfData);
        if (statements != null) {
          if (statements.length != 0) {
            if (transactions.length == 0) transactions = statements;
            else transactions = [...transactions, ...statements];
          }
        }
        // }
        console.log(transactions);
        return transactions;
      });
    } catch (error) {
      console.log(error);
    }
  }

  private getIDFCMobileLatestStatement(page: number, pdfData: any) {
    try {
      const textData: [any] = pdfData['formImage']['Pages'][page]['Texts'];
      const transactions: Transaction[] = [];
      let xTransactionDescription = 0;
      let xTransactionDebit = 0;
      let xTransactionCredit = 0;
      const scrapData: ScrapModel[] = [];
      let minY = 0;
      textData.forEach((element) => {
        const rawText = element['R'][0]['T'].toString();
        const scrapModel = new ScrapModel();
        scrapModel.colorCode = element['oc'];
        scrapModel.xDirection = element['x'];
        scrapModel.yDirection = element['y'];
        scrapModel.content = decodeURIComponent(rawText);
        if (scrapModel.content.length == 11 && scrapModel.xDirection < 4.5) {
          const splittedList: string[] = scrapModel.content
            .replace(',', '')
            .split('-');
          if (splittedList.length == 3) {
            const monthFormat = splittedList[1];
            const dateFormat = splittedList[0];
            const yearFormat = splittedList[2];
            const momentDate = moment(
              dateFormat + '-' + monthFormat + '-' + yearFormat,
              'DD-MMM-YYYY',
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
          xTransactionDescription == 0 &&
          scrapModel.xDirection > 7 &&
          scrapModel.xDirection < 11
        )
          xTransactionDescription = scrapModel.xDirection;
        if (
          xTransactionDebit == 0 &&
          scrapModel.xDirection > 20 &&
          scrapModel.xDirection < 25
        )
          xTransactionDebit = scrapModel.xDirection;
        if (
          xTransactionCredit == 0 &&
          scrapModel.xDirection > 25 &&
          scrapModel.xDirection < 29
        )
          xTransactionCredit = scrapModel.xDirection;
        if (
          scrapModel.yDirection >= minY &&
          minY != 0 &&
          !scrapModel.content.includes('REGISTERED OFFICE:') &&
          !scrapModel.content.includes(
            'Page ' +
              (page + 1).toString() +
              ' of ' +
              pdfData['formImage']['Pages'].length.toString(),
          ) &&
          scrapModel.xDirection < 29 &&
          (scrapModel.xDirection < 4 || scrapModel.xDirection > 7)
        )
          scrapData.push(scrapModel);
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
        } else if (element.xDirection > 20 && element.xDirection < 29) {
          transaction.amount = parseFloat(
            element.content
              .replace('₹', '')
              .replace('+', '')
              .replace('-', '')
              .replace(',', ''),
          );
          if (element.xDirection < 25) transaction.mode = 'DEBIT';
          else if (element.xDirection > 25) transaction.mode = 'CREDIT';
          if (element == scrapData[scrapData.length - 1])
            transactions.push(transaction);
        } else if (element.xDirection > 7 && element.xDirection < 11) {
          if (transaction.description == null)
            transaction.description = element.content;
          else
            transaction.description = transaction.description + element.content;
        }
      });
      console.log(transactions);
      return transactions;
    } catch (error) {
      console.log(error);
    }
  }

  private getIDFCDesktopLatestStatement(page: number, pdfData: any) {
    try {
      const textData: [any] = pdfData['formImage']['Pages'][page]['Texts'];
      const transactions: Transaction[] = [];
      let xTransactionType = 0;
      let xTransactionDescription = 0;
      let xTransactionCategory = 0;
      let xTransactionAmount = 0;
      const scrapData: ScrapModel[] = [];
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
          transaction.mode = element.content.includes('+') ? 'CREDIT' : 'DEBIT';
          transaction.amount = parseFloat(
            element.content.replace('₹', '').replace('+', '').replace(',', ''),
          );
          if (element == scrapData[scrapData.length - 1])
            transactions.push(transaction);
        }
      });
      return transactions;
    } catch (error) {
      console.log(error);
    }
  }
}
