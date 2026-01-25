import { Inngest } from 'inngest';
import { mapInterviewProblems } from '../modules/interviews/interview.inngest.js';

export const inngest = new Inngest({ id: "codehuddle"});

export const functions = [
    mapInterviewProblems
];