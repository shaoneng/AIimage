export default interface Prediction {
    id: string;
    detail: string;
    status: string;
    output?: string;
    version?: string;
    logs?: string;
    created_at: string;
    started_at: string;
    completed_at: string;
}

