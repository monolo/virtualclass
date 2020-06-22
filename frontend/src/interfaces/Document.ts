export interface Document {
    id: string;
    name: string;
    type: string;
    src: string;
}

export interface DocumentPagination {
    documents: Array<Document>,
    total: number
}

export interface DocumentRepository {
    find(id: string): Promise<Document>
    getBy(offset: number, limit: number): Promise<DocumentPagination>
    upload(file: File, onUploadProgress?: any): Promise<Document>
}