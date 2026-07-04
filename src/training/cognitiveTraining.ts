/**
 * Cognitive Training Specification 1.0
 *
 * Typed scaffolding for the CTS architecture component.
 * See docs/cognitive-training-spec.md for the full specification.
 */

/** Participant tier in the CTS ecosystem. */
export type CTSUserTier = 'civilian' | 'cadet' | 'industry';

/** CTS training layer (1 = basic, 4 = stress conditioning). */
export type CTSTrainingLayer = 1 | 2 | 3 | 4;

/** Ordered phases of a CTS training session. */
export type CTSTrainingPhase =
  | 'INITIATION'
  | 'CREDENTIAL_RECALL'
  | 'SEQUENCE_EXECUTION'
  | 'COGNITIVE_REINFORCEMENT'
  | 'OPERATOR_CONDITIONING';

/** Outcome of a CTS recall or sequence exercise. */
export type CTSEvaluationResult = 'PASS' | 'FAIL' | 'PARTIAL';

// ---------------------------------------------------------------------------
// Packet payloads (used with PacketType 'CTS_MEMORY_CHALLENGE',
// 'CTS_SEQUENCE_VALIDATION', and 'CTS_OPERATOR_READINESS')
// ---------------------------------------------------------------------------

/** Payload for a `CTS_MEMORY_CHALLENGE` packet (Layers 1–2). */
export interface CTSMemoryChallengePayload {
  sessionId: string;
  userTier: CTSUserTier;
  trainingLayer: CTSTrainingLayer;
  challengeSequence: string[];
  timeLimitMs?: number;
}

/** Payload for a `CTS_SEQUENCE_VALIDATION` packet (Layers 2–3). */
export interface CTSSequenceValidationPayload {
  sessionId: string;
  userTier: CTSUserTier;
  trainingLayer: CTSTrainingLayer;
  submittedSequence: string[];
  elapsedMs: number;
  result: CTSEvaluationResult;
}

/** Payload for a `CTS_OPERATOR_READINESS` packet (Layers 3–4). */
export interface CTSOperatorReadinessPayload {
  sessionId: string;
  userTier: CTSUserTier;
  trainingLayer: CTSTrainingLayer;
  operatorReadinessScore: number;
  phase: CTSTrainingPhase;
  result: CTSEvaluationResult;
}

// ---------------------------------------------------------------------------
// Telemetry event
// ---------------------------------------------------------------------------

/**
 * Telemetry event emitted by CTS modules.
 * Attach to `TelemetryLogEvent.metadata` or emit as a dedicated
 * `TelemetryMetricPoint` series.
 */
export interface CTSTelemetryEvent {
  sessionId: string;
  userTier: CTSUserTier;
  trainingLayer: CTSTrainingLayer;
  phase: CTSTrainingPhase;
  recallAccuracy?: number;
  sequenceTimingMs?: number;
  operatorReadinessScore?: number;
  result: CTSEvaluationResult;
}
