export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface TelemetryLogEvent {
  timestamp: string;
  module: string;
  level: LogLevel;
  message: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;
}

export interface TelemetryMetricPoint {
  timestamp: string;
  module: string;
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
}

export interface TelemetryHeartbeat {
  timestamp: string;
  module: string;
  status: 'UP' | 'DEGRADED' | 'DOWN';
  uptimeSeconds: number;
}

export class InMemoryTelemetryCollector {
  public readonly logs: TelemetryLogEvent[] = [];
  public readonly metrics: TelemetryMetricPoint[] = [];
  public readonly heartbeats: TelemetryHeartbeat[] = [];

  emitLog(event: TelemetryLogEvent): void {
    this.logs.push(event);
  }

  emitMetric(metric: TelemetryMetricPoint): void {
    this.metrics.push(metric);
  }

  emitHeartbeat(heartbeat: TelemetryHeartbeat): void {
    this.heartbeats.push(heartbeat);
  }
}

export function createHeartbeat(
  module: string,
  status: TelemetryHeartbeat['status'],
  startedAt: Date,
  now: Date = new Date()
): TelemetryHeartbeat {
  return {
    timestamp: now.toISOString(),
    module,
    status,
    uptimeSeconds: Math.max(
      0,
      Math.floor((now.getTime() - startedAt.getTime()) / 1000)
    )
  };
}

