import { Injectable } from '@nestjs/common';
import { ScrapModel } from '@app/models/scrap.model';
import moment from 'moment';
import { Transaction } from '@app/models/transaction.model';

@Injectable()
export class StatementService {
  public getIDFCMobileLatestStatement(page: number, pdfData: any) {
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
            'Unless the constituent notifies the bank immediately of any discrepancy found by him',
          ) &&
          !scrapModel.content.includes(
            'Please call us at 1800 419 4332 in case of queries.',
          ) &&
          !scrapModel.content.includes('banker@idfcfirstbank.com') &&
          !scrapModel.content.includes(
            '------- End of the statement -------',
          ) &&
          !scrapModel.content.includes('IMPORTANT MESSAGE') &&
          !scrapModel.content.includes('for details.') &&
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
              .replace(',', '')
              .replace(',', '')
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
      return transactions;
    } catch (error) {
      console.log(error);
    }
  }

  public getIDFCDesktopLatestStatement(page: number, pdfData: any) {
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
            element.content
              .replace('₹', '')
              .replace('+', '')
              .replace(',', '')
              .replace(',', '')
              .replace(',', ''),
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

  public getQuickSummary(transactions: Transaction[]) {
    try {
      const creditTransactions: Transaction[] = [];
      const debitTransactions: Transaction[] = [];
      let investmentIncome = 0;
      let totalCredits = 0;
      let totalDebits = 0;
      let cashWithdrawls = 0;
      let foodExpenses = 0;
      let petrolExpenses = 0;
      let investmentExpenses = 0;
      let shoppingExpenses = 0;
      const salaries: Transaction[] = [];
      transactions.forEach((element) => {
        if (element.mode == 'CREDIT') {
          creditTransactions.push(element);
          totalCredits = totalCredits + element.amount;
          if (
            element.description.toLowerCase().includes(' sip ') ||
            element.description.toLowerCase().includes('zerodha') ||
            element.description.toLowerCase().includes('nach')
          )
            investmentIncome = investmentIncome + element.amount;
          else if (element.description.toLowerCase().includes('salary'))
            salaries.push(element);
          else if (element.type != null) {
            if (
              element.type.toLowerCase().includes('single transfer') &&
              element.category
                .toLowerCase()
                .includes('income • income (other)?')
            )
              salaries.push(element);
          }
        } else if (element.mode == 'DEBIT') {
          debitTransactions.push(element);
          totalDebits = totalDebits + element.amount;
          if (element.description.includes('CASH WITHDRAWAL'))
            cashWithdrawls = cashWithdrawls + element.amount;
          else if (
            element.description.toLowerCase().includes('pizza') ||
            element.description.toLowerCase().includes('zomato') ||
            element.description.toLowerCase().includes('restaurant') ||
            element.description.toLowerCase().includes('food')
          )
            foodExpenses = foodExpenses + element.amount;
          else if (
            element.description.toLowerCase().includes('shopping') ||
            element.description.toLowerCase().includes('dmart') ||
            element.description.toLowerCase().includes('amazon') ||
            element.description.toLowerCase().includes('chroma') ||
            element.description.toLowerCase().includes('flipkart')
          )
            shoppingExpenses = shoppingExpenses + element.amount;
          else if (element.description.toLowerCase().includes('petrol'))
            petrolExpenses = petrolExpenses + element.amount;
          else if (
            element.description.toLowerCase().includes(' sip ') ||
            element.description.toLowerCase().includes('zerodha') ||
            element.description.toLowerCase().includes('nach')
          )
            investmentExpenses = investmentExpenses + element.amount;
          else if (element.category != null) {
            if (element.category.toLowerCase().includes('cash withdrawals'))
              cashWithdrawls = cashWithdrawls + element.amount;
          }
        }
      });
      return {
        'Total credit amount': totalCredits,
        'Total debit amount': totalDebits,
        'Total Salaries': salaries,
        'Total investment income': investmentIncome,
        'Total investment expenses': investmentExpenses,
        'Total cash withdrawals': cashWithdrawls,
        'Total food expenses': foodExpenses,
        'Total petrol expenses': petrolExpenses,
        'Total shopping expenses': shoppingExpenses,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
