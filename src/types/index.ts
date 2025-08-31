// search-table
export interface FormOptions {
    prop: 'name' | 'money' | 'state';
    label: string;
    type: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean,
    opts?: any[]
}
export interface SearchTableProps {
    query: {
        name: string,
        money: string,
        state: boolean
    },
    //表单配置
    options: FormOptions[],
    search?: () => void

}

// tbale-list
export interface TableList {
    id: string,
    name: string,
    money: string,
    thumb: string,
    state: boolean
}
