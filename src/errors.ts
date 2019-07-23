export class DatabaseBlockedError extends Error {
  public constructor() {
    super('Database is blocked');
  }
}

export class DatabaseConnectionError extends Error {
  public constructor() {
    super('Count not connect to the database');
  }
}

export class UnknownVersionUpgradeError extends Error {
  public constructor() {
    super('Request to upgrade the database to unknown version');
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

export class DOMExceptionError extends Error {
  public constructor(ex: DOMException) {
    super(`${ex.name}: ${ex.message}`);
  }
}
