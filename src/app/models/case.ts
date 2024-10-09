export interface ICase {
  title: string;
  caseNumber: string;
  description: string;
  status: string;
}

export interface Cases extends ICase {
  id: string;
}
