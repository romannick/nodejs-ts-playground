import { UserCredentials } from './userCredentials';
import { UserRole } from '@libs/types';
export declare class User {
    id: number;
    email: string;
    name: string;
    role: UserRole;
    credentials: UserCredentials;
}
