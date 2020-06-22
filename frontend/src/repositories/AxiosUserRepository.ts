import Client, {httpGet, httpPost} from "@/repositories/AxiosRepository";
import {
    Student,
    StudentPagination,
    Teacher,
    TeacherPagination,
    User, UserLogged,
    UserPagination,
    UserRepository
} from "@/interfaces/User";

const resource = '/user';

export default new class AxiosUserRepository implements UserRepository {
    async login(email: string, password: string): Promise<UserLogged> {
        return new Promise((resolve, reject) => {
            Client()
                .post(`${resource}/login`, {
                    email,
                    password
                })
                .then((data) => {
                    const user = data.data;
                    if(!user.token){
                        reject('Token not valid')
                    }
                    localStorage.setItem('user', JSON.stringify(user));
                    resolve(user);
                })
                .catch((e) => {
                    if (e.response && e.response.data && e.response.data.error) {
                        reject(e.response.data.error);
                    }
                    else reject(e);
                });
        });
    }
    logout(): void {
        localStorage.removeItem('user');
    }
    registerStudent(id: string, name: string, surname: string, email: string, password: string): Promise<UserLogged> {
        return httpPost(`${resource}/register/student`, {
            id,
            name,
            surname,
            email,
            password
        });
    }
    registerTeacher(id: string, name: string, surname: string, email: string, shortDescription: string, fullDescription: string, password: string): Promise<UserLogged> {
        return httpPost(`${resource}/register/teacher`, {
            id,
            name,
            surname,
            email,
            password,
            shortDescription,
            fullDescription
        });
    }
    user(id: string): Promise<User> {
        return httpGet(`${resource}/${id}`);
    }
    getUsersLessMeBy(offset: number, limit: number): Promise<UserPagination> {
        return httpGet(`${resource}/users`, {
            offset, limit
        });
    }
    teacher(id: string): Promise<Teacher> {
        return httpGet(`${resource}/teacher/${id}`);
    }
    getTeachersAcceptedBy(offset: number, limit: number): Promise<TeacherPagination> {
        return httpGet(`${resource}/teachersAccepted`, {
            offset, limit
        });
    }
    getTeachersNotAcceptedBy(offset: number, limit: number): Promise<TeacherPagination> {
        return httpGet(`${resource}/teachersNotAccepted`, {
            offset, limit
        });
    }
    student(id: string): Promise<Student> {
        return httpGet(`${resource}/student/${id}`);
    }
    getStudentsAcceptedBy(offset: number, limit: number): Promise<StudentPagination> {
        return httpGet(`${resource}/studentsAccepted`, {
            offset, limit
        });
    }
    getStudentsNotAcceptedBy(offset: number, limit: number): Promise<StudentPagination> {
        return httpGet(`${resource}/studentsNotAccepted`, {
            offset, limit
        });
    }
}