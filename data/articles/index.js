import { foundationArticles } from './foundation';
import { wealthArticles } from './wealth';
import { marketsArticles } from './markets';
import { protectionArticles } from './protection';
import { digitalArticles } from './digital';
import { systemsArticles } from './systems';

export const allFinanceArticles = {
  ...foundationArticles,
  ...wealthArticles,
  ...marketsArticles,
  ...protectionArticles,
  ...digitalArticles,
  ...systemsArticles,
};