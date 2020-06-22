<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{disabled: !canPrev()}">
                <a @click="goPrev()" class="page-link" href="#">Previous</a>
            </li>
            <li class="page-item" v-for="page in pages" :key="page" :class="{active: currentPage === page}">
                <a @click="goPage(page)" class="page-link" href="#">{{page}}</a>
            </li>
            <li class="page-item" :class="{disabled: !canNext()}">
                <a @click="goNext()" class="page-link" href="#">Next</a>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    @Component
    export default class Pagination extends Vue {
        @Prop({required: true, default: 0}) readonly total!: number;
        @Prop({required: true, default: 8}) readonly limit!: number;

        pages = 1
        currentPage = 1

        created() {
            this.pages = Math.ceil(this.total / this.limit) || 1
        }

        canPrev(): boolean {
            return this.currentPage > 1;
        }

        canNext(): boolean {
            return this.currentPage < this.pages;
        }

        goPage(page: number){
            if(1 <= page && page <= this.pages){
                this.currentPage = page;
                this.$emit('page-changed', this.currentPage);
            }
        }

        goPrev() {
            if(this.canPrev()) this.goPage(this.currentPage-1);
        }

        goNext() {
            if(this.canNext()) this.goPage(this.currentPage+1);
        }
    }
</script>

<style scoped>

</style>
