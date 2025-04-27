export type ProjectFormInput = {
    title: string;
    short_description: string; // Keep this for initial creation
    pain_point: string; // New: Replaces problem_statement
    target_audience: string[];
    proposed_solution: string; // New: Concise description of the solution
    usp: string;
    monetisation_strategy: string;
    is_refined: boolean;
};

export type ProjectForm = ProjectFormInput & {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
};
