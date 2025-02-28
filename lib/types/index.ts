


export interface ChildFormRef {
    validateAndGetData: () => Promise<{
        isValid: boolean;
        values: any;
        errors: any;
    }>;
}



export interface UserResponse {
    [key: string]: {
        question: string;
        answer: string;
    };
}

// Define the structure for therapists returned by AI
export interface MatchedTherapist {
    id: string;
    score: number;
    tags: string[];
}

// Define the full therapist structure
export interface Therapist {
    id: string;
    first_name: string;
    last_name: string;
    image: string;
    bio: string;
    booking_link: string;
}