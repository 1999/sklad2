export class DatabaseBlockedError extends Error {
  public constructor() {
    super('Database is blocked');
  }
}

export class UnknownVersionUpgradeError extends Error {
  public constructor() {
    super('Request to upgrade the database to unknown version');
  }
}

export class StoreMissingError extends Error {
  public constructor() {
    super('Store is missing');
  }
}

export class IndexMissingError extends Error {
  public constructor() {
    super('Index is missing');
  }
}

export class TransactionAbortedError extends Error {
  public constructor() {
    super('Transaction was aborted');
  }
}

export class UpgradeTransactionClosedError extends Error {
  public constructor() {
    super('Upgrade transaction does not exist');
  }
}
