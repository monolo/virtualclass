<template>
    <div class="">
        <Table :fields="documentTable.fields" :items="documentTable.items">
            <template slot="actions">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Acciones
                    </button>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">
                        <a class="dropdown-item" href="#">Ver</a>
                        <a class="dropdown-item" href="#">Compartir</a>
                        <a class="dropdown-item" href="#">Borrar</a>
                    </div>
                </div>
            </template>
        </Table>
        <Pagination :total="total" :limit="limit" @page-changed="onChangePage"></Pagination>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Table, {Props} from "@/app/components/Shared/Table.vue";
    import Pagination from "@/app/components/Shared/Pagination.vue";
    import {Document} from "@/interfaces/Document";

    @Component({
        components: {
            Pagination,
            Table
        }
    })
    export default class DocumentsUser extends Vue {
        limit = 8;
        total = 0;
        documents: Array<Document> = [];
        offset = 0;
        documentTable: Props = {
            fields: [
                {
                    name: 'name',
                    title: 'Nombre',
                    width: '100%',
                    dataClass: 'ellipsis'
                },
                {
                    name: 'type',
                    title: 'Tipo'
                },
                {
                    name: '__slot:actions',
                    title: ''
                }
            ],
            items: this.documents
        }

        created() {
            this.syncDocuments();
        }

        async syncDocuments() {
            try {
                /*const {documents, total} = await container.repositories.documentRepository.getBy(this.offset, this.limit);
                this.documents = documents;
                this.total = total;*/
            }
            catch (e) {
                //Todo: no se ha podido conectar con el servidor
            }
        }

        onChangePage(page: number){
            this.offset = (page-1)*this.limit;
            this.syncDocuments();
        }
    }
</script>

<style scoped>
    table tr .btn-light{
        border: 1px solid #939393;
    }

    /deep/ .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 0;
    }
</style>
