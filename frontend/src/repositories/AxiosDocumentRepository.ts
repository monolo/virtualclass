import Client from "@/repositories/AxiosRepository";
import {Document, DocumentPagination, DocumentRepository} from "@/interfaces/Document";

const resource = '/document';

export default class AxiosDocumentRepository implements DocumentRepository{
    find(id: string): Promise<Document> {
        return new Promise((resolve, reject) => {
            Client()
                .get(`${resource}/${id}`)
                .then((response) => {
                    const document: Document = response.data;
                    resolve(document);
                })
                .catch((error) => reject(error));
        });
    }

    getBy(offset = 0, limit = 8): Promise<DocumentPagination> {
        return new Promise((resolve, reject) => {
            Client()
                .get(`${resource}`, {
                    params: {
                        offset: offset,
                        limit: limit
                    }
                })
                .then((response) => {
                    const documentPagination: DocumentPagination = {
                        documents: response.data.items,
                        total: response.data.total
                    }
                    resolve(documentPagination);
                })
                .catch((error) => reject(error));
        });
    }

    upload(file: File, onUploadProgress?: any): Promise<Document> {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            Client()
                .post(`${resource}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: onUploadProgress
                })
                .then((response) => {
                    const document: Document = response.data;
                    resolve(document);
                })
                .catch((error) => reject(error));
        });
    }
}