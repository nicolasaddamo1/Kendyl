
// src/interviews/events/interview-ended.event.ts
export class InterviewEndedEvent {
    constructor(
      public readonly interviewId: string,
      public readonly candidateId: string,
      public readonly interviewerId: string | null,
    ) {}
  }