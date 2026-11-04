// Operational Metrics Tracking for TermFlow
// Tracks retry counts and failures for monitoring and debugging

interface MetricEntry {
  count: number;
  lastUpdated: Date;
}

interface FailureEntry {
  count: number;
  lastError: string;
  lastOccurred: Date;
}

export interface OperationalMetrics {
  // Track feature flag retry attempts
  featureFlagRetries: Map<string, MetricEntry>;
  
  // Track webhook processing retry attempts
  webhookRetries: Map<string, MetricEntry>;
  
  // Track transaction failures with error details
  transactionFailures: Map<string, FailureEntry>;
  
  // Helper methods
  recordFeatureFlagRetry(landlordId: string, featureKey: string): void;
  recordWebhookRetry(provider: string, eventId: string): void;
  recordTransactionFailure(operation: string, error: string): void;
  
  getMetricsSummary(): object;
  resetMetrics(): void;
}

class MetricsCollector implements OperationalMetrics {
  featureFlagRetries: Map<string, MetricEntry>;
  webhookRetries: Map<string, MetricEntry>;
  transactionFailures: Map<string, FailureEntry>;
  
  private metricsStartTime: Date;
  
  constructor() {
    this.featureFlagRetries = new Map();
    this.webhookRetries = new Map();
    this.transactionFailures = new Map();
    this.metricsStartTime = new Date();
  }
  
  recordFeatureFlagRetry(landlordId: string, featureKey: string): void {
    const key = `${landlordId}:${featureKey}`;
    const existing = this.featureFlagRetries.get(key);
    
    if (existing) {
      existing.count++;
      existing.lastUpdated = new Date();
    } else {
      this.featureFlagRetries.set(key, {
        count: 1,
        lastUpdated: new Date(),
      });
    }
    
    console.log(`[Metrics] Feature flag retry recorded: ${key} (total: ${this.featureFlagRetries.get(key)?.count})`);
  }
  
  recordWebhookRetry(provider: string, eventId: string): void {
    const key = `${provider}:${eventId}`;
    const existing = this.webhookRetries.get(key);
    
    if (existing) {
      existing.count++;
      existing.lastUpdated = new Date();
    } else {
      this.webhookRetries.set(key, {
        count: 1,
        lastUpdated: new Date(),
      });
    }
    
    console.log(`[Metrics] Webhook retry recorded: ${key} (total: ${this.webhookRetries.get(key)?.count})`);
  }
  
  recordTransactionFailure(operation: string, error: string): void {
    const existing = this.transactionFailures.get(operation);
    
    if (existing) {
      existing.count++;
      existing.lastError = error;
      existing.lastOccurred = new Date();
    } else {
      this.transactionFailures.set(operation, {
        count: 1,
        lastError: error,
        lastOccurred: new Date(),
      });
    }
    
    console.error(`[Metrics] Transaction failure recorded: ${operation} - ${error}`);
  }
  
  getMetricsSummary(): object {
    const featureFlagRetriesArray = Array.from(this.featureFlagRetries.entries()).map(([key, value]) => {
      const [landlordId, featureKey] = key.split(':');
      return {
        landlordId,
        featureKey,
        retryCount: value.count,
        lastRetry: value.lastUpdated,
      };
    });
    
    const webhookRetriesArray = Array.from(this.webhookRetries.entries()).map(([key, value]) => {
      const [provider, eventId] = key.split(':');
      return {
        provider,
        eventId,
        retryCount: value.count,
        lastRetry: value.lastUpdated,
      };
    });
    
    const transactionFailuresArray = Array.from(this.transactionFailures.entries()).map(([operation, value]) => ({
      operation,
      failureCount: value.count,
      lastError: value.lastError,
      lastOccurred: value.lastOccurred,
    }));
    
    const totalFeatureFlagRetries = featureFlagRetriesArray.reduce((sum, item) => sum + item.retryCount, 0);
    const totalWebhookRetries = webhookRetriesArray.reduce((sum, item) => sum + item.retryCount, 0);
    const totalTransactionFailures = transactionFailuresArray.reduce((sum, item) => sum + item.failureCount, 0);
    
    return {
      summary: {
        metricsCollectionStarted: this.metricsStartTime,
        uptimeHours: ((Date.now() - this.metricsStartTime.getTime()) / (1000 * 60 * 60)).toFixed(2),
        totalFeatureFlagRetries,
        totalWebhookRetries,
        totalTransactionFailures,
      },
      featureFlagRetries: featureFlagRetriesArray,
      webhookRetries: webhookRetriesArray,
      transactionFailures: transactionFailuresArray,
    };
  }
  
  resetMetrics(): void {
    this.featureFlagRetries.clear();
    this.webhookRetries.clear();
    this.transactionFailures.clear();
    this.metricsStartTime = new Date();
    console.log('[Metrics] All metrics reset');
  }
}

export const metrics = new MetricsCollector();
