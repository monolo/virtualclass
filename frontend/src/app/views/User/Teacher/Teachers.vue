<template>
    <div class="">
        <Table :fields="teachersTable.fields" :items="teachersTable.items">
            <template slot="image">
                test
            </template>
            <template slot="message">
                test
            </template>
        </Table>
        <Pagination v-if="chats.length > 0" :total="total" :limit="limit" @page-changed="onChangePage"></Pagination>
        <div class="text-center">
            <router-link to="/chat/new" class="btn btn-success">Nuevo chat</router-link>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Table, {Props} from "@/app/components/Shared/Table.vue";
    import Pagination from "@/app/components/Shared/Pagination.vue";
    import {Teacher} from "@/interfaces/User";
    import AxiosUserRepository from "@/repositories/AxiosUserRepository";

    @Component({
        components: {
            Pagination,
            Table
        }
    })
    export default class ChatsUser extends Vue {
        limit = 8;
        total = 0;
        teachers: Array<Teacher> = [];
        offset = 0;
        teachersTable: Props = {
            fields: [
                {
                    name: '__slot:image',
                    title: '',
                    visible: false
                },
                {
                    name: 'name',
                    title: 'Nombre',
                    width: '80%',
                    dataClass: 'ellipsis',
                    visible: false
                },
                {
                    name: 'shortDescription',
                    title: '',
                    width: '20%',
                    dataClass: 'ellipsis',
                    visible: false
                }
            ],
            items: this.teachers
        }

        created() {
            this.syncTeachers();
        }

        async syncTeachers() {
            try {
                const {teachers, total} = await AxiosUserRepository.getTeachersAcceptedBy(this.offset, this.limit);
                this.teachers = teachers;
                this.total = total;
            } catch (e) {
                await this.$store.dispatch('alert/error', e);
            }
        }

        onChangePage(page: number) {
            this.offset = (page - 1) * this.limit;
            this.syncTeachers();
        }
    }
</script>

<style scoped>
    table tr .btn-light {
        border: 1px solid #939393;
    }
    /deep/ .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 0;
    }
</style>
