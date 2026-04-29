import { loanGuides } from './loan-emi';
import { investmentGuides } from './investment';
import { stockGuides } from './stock-business';
import { taxGuides } from './tax-quick';

export const allToolGuides = {
  ...loanGuides,
  ...investmentGuides,
  ...stockGuides,
  ...taxGuides,
};