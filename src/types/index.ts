// search-table
export interface FormOptions {
    prop: 'name' | 'money' | 'state' | 'thumb' | 'id'
    label: string;
    type: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean,
    opts?: any[],
    activeValue?: any,
    inactiveValue?: any,
    activeText?: string,
    inactiveText?: string

}
export interface SearchTableProps {
    query: {
        name: string,
        money: string,
        state: boolean,
        thumb: string
    },
    //表单配置
    options: FormOptions[],
    search?: () => void
    reset?: () => void
}
export interface FormEditProps {
    options: FormOptions[],
    formData: TableList,
    edit: boolean,
    update: () => void,
    labelWidth?: number | string;
    span?: number;
}

// table-list
export interface TableList {
    id?: string,
    name: string,
    money: string | number,
    thumb: string,
    state: boolean
}

// table-detail
export interface TableDetailProps {
    list: Pick<FormOptions, 'prop' | 'label'>[]
    row: TableList
}