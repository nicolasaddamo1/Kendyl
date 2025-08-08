// src/interviews/events/interview-started.event.ts
export class InterviewStartedEvent {
    constructor(
      public readonly interviewId: string,
      public readonly candidateId: string,
      public readonly interviewerId: string | null,
      public readonly aiConfig: any,
    ) {}
  }