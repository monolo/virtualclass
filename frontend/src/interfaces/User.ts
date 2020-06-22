export interface UserLogged {
    id: string;
    name: string;
    surname: string;
    email: string;
    roles: Array<string>
    token: string
}

export interface User {
    id: string;
    name: string;
    surname: string;
}

export interface Student extends User {
    requested?: boolean;
    accepted?: boolean;
}
export interface Teacher extends User{
    shortDescription: string;
    fullDescription: string;
    requested?: boolean;
    accepted?: boolean;
}

export interface UserPagination {
    users: Array<Teacher>,
    total: number
}

export interface TeacherPagination {
    teachers: Array<Teacher>,
    total: number
}

export interface StudentPagination {
    students: Array<Teacher>,
    total: number
}

export interface UserRepository {
    login(email: string, password: string): Promise<UserLogged>
    logout(): void
    registerTeacher(id: string, name: string, surname: string, email: string, shortDescription:string, fullDescription: string, password: string): Promise<UserLogged>
    registerStudent(id: string, name: string, surname: string, email: string, password: string): Promise<UserLogged>
    user(id: string): Promise<User>
    getUsersLessMeBy(offset: number, limit: number): Promise<UserPagination>
    teacher(id: string): Promise<Teacher>
    getTeachersAcceptedBy(offset: number, limit: number): Promise<TeacherPagination>
    getTeachersNotAcceptedBy(offset: number, limit: number): Promise<TeacherPagination>
    student(id: string): Promise<Student>
    getStudentsAcceptedBy(offset: number, limit: number): Promise<StudentPagination>
    getStudentsNotAcceptedBy(offset: number, limit: number): Promise<StudentPagination>
}