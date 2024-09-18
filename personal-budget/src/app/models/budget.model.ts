export interface BudgetItem {
  budget: number;
  title: string;
}

export interface BudgetResponse {
  myBudget: BudgetItem[];
}
