<template>
    <div>
        <table :class="css.tableClass">
            <thead>
            <th v-for="field in tableFields"
                :key="field.name"
                :class="[{hide: !field.visible}, field.titleClass]"
                :style="{width: field.width}"
            >
                {{ field.title }}
            </th>
            </thead>
            <tbody>
            <template v-for="(item, itemIndex) in tableData">
                <tr
                        :key="itemIndex"
                        @click="onRowClicked(item, $event)"
                >
                    <template v-for="(field, fieldIndex) in tableFields">
                        <template>
                            <template v-if="isSpecialField(field.name)">
                                <td v-if="extractName(field.name) === '__slot'"
                                    :key="fieldIndex"
                                    :class="['vuetable-slot', field.dataClass]"
                                    :style="{width: field.width}"
                                >
                                    <slot :name="extractArgs(field.name)"
                                          :row-data="item" :row-index="itemIndex" :row-field="field.sortField"
                                    ></slot>
                                </td>
                            </template>
                            <template v-else>
                                <td v-if="hasCallback(field)"
                                    :key="fieldIndex"
                                    :class="field.dataClass"
                                    v-html="callCallback(field, item)"
                                    @click="onCellClicked(item, field, $event)"
                                    @dblclick="onCellDoubleClicked(item, field, $event)"
                                    @contextmenu="onCellRightClicked(item, field, $event)"
                                    :style="{width: field.width}"
                                ></td>
                                <td v-else
                                    :key="fieldIndex"
                                    :class="field.dataClass"
                                    v-html="getObjectValue(item, field.name, '')"
                                    @click="onCellClicked(item, field, $event)"
                                    @dblclick="onCellDoubleClicked(item, field, $event)"
                                    @contextmenu="onCellRightClicked(item, field, $event)"
                                    :style="{width: field.width}"
                                ></td>
                            </template>
                        </template>
                    </template>
                </tr>
            </template>
            <template v-if="tableData.length === 0">
                <tr>
                    <td :rowspan="tableFields.length">
                        <slot name="emptyTable">
                            No se han encontrado datos
                        </slot>
                    </td>
                </tr>
            </template>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    interface Field {
        index?: number;
        name: string;
        width?: string;
        title?: string;
        sortField?: string;
        titleClass?: string;
        dataClass?: string;
        callback?: ((value: any) => string) | string | null;
        visible?: boolean;
    }

    export interface Props {
        fields: Array<Field | string>;
        items: Array<any>;
    }

    @Component
    export default class Table extends Vue {
        @Prop({required: true}) readonly fields!: Array<Field | string>
        @Prop({required: true}) readonly items!: Array<any>;
        @Prop({
            required: false,
            default() {
                return {
                    tableClass: 'table table-bordered'
                }
            }
        }) readonly css!: Record<string, string>;

        eventPrefix = 'table:'
        tableFields: Field[] = []
        tableData: Array<any> = this.items;

        created() {
            this.normalizeFields();
        }

        normalizeFields() {
            if (typeof (this.fields) === 'undefined') {
                throw new Error('You need to provide "fields" prop.')
            }
            this.tableFields = []
            let obj: Field;
            this.fields.forEach((field, i) => {
                if (typeof (field) === 'string') {
                    obj = {
                        name: field,
                        title: this.setTitle(field),
                        titleClass: '',
                        dataClass: '',
                        callback: null,
                        visible: true,
                    }
                } else {
                    obj = {
                        name: field.name,
                        width: field.width,
                        title: (field.title === undefined) ? this.setTitle(field.name) : field.title,
                        sortField: field.sortField,
                        titleClass: (field.titleClass === undefined) ? '' : field.titleClass,
                        dataClass: (field.dataClass === undefined) ? '' : field.dataClass,
                        callback: (field.callback === undefined) ? null : field.callback,
                        visible: (field.visible === undefined) ? true : field.visible,
                    }
                }
                this.tableFields.push(obj)
            })
        }

        setTitle(str: string): string {
            if (this.isSpecialField(str)) {
                return ''
            }
            return this.titleCase(str)
        }

        isSpecialField(fieldName: string) {
            return fieldName.slice(0, 2) === '__'
        }

        titleCase(str: string) {
            return str.replace(/\w+/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            })
        }

        extractName(string: string) {
            return string.split(':')[0].trim()
        }

        extractArgs(string: string) {
            return string.split(':')[1]
        }

        hasCallback(item: Record<string, any>) {
            return !!item.callback
        }

        callCallback(field: Field, item: Record<string, any>) {
            if (!this.hasCallback(field)) return
            if (typeof (field.callback) == 'function') {
                return field.callback(this.getObjectValue(item, field.name))
            }
            return null
        }

        getObjectValue(object: Record<string, any>, path: string, defaultValue = ''): any {
            let obj: Record<string, any> | string | null;
            obj = object;
            if (path.trim() != '') {
                const keys = path.split('.')
                keys.forEach(function (key) {
                    if (obj !== null && typeof (obj) !== "string" && typeof obj[key] !== 'undefined' && obj[key] !== null) {
                        obj = obj[key]
                    } else {
                        obj = defaultValue
                        return
                    }
                })
            }
            return obj
        }

        //Events
        onRowClicked(dataItem: Record<string, any>, event: MouseEvent) {
            this.$emit(this.eventPrefix + 'row-clicked', dataItem, event)
            return true
        }

        onCellClicked(dataItem: any, field: Field, event: MouseEvent) {
            this.$emit(this.eventPrefix + 'cell-clicked', dataItem, field, event)
        }

        onCellDoubleClicked(dataItem: any, field: Field, event: MouseEvent) {
            this.$emit(this.eventPrefix + 'cell-dblclicked', dataItem, field, event)
        }

        onCellRightClicked(dataItem: any, field: Field, event: MouseEvent) {
            this.$emit(this.eventPrefix + 'cell-rightclicked', dataItem, field, event)
        }
    }
</script>

<style scoped>
    .hide {
        display: none;
    }
</style>
