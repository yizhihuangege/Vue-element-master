//表格初始配置方法
const tableConfig = (tableHeader=[],pageSize=20)=>{
    return {
        isLoad: false,
        header: tableHeader,
        data: [],
        curPage: 1,
        pageSize: pageSize,
        countTotal: 0
    };
}

// 时间快捷查询配置
const timeRangeConfig = {
    shortcuts: [
        {
            text: "今天",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "昨日",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "近7日",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "近15日",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
                picker.$emit("pick", [start, end]);
            }
        },
        {
            text: "近30日",
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit("pick", [start, end]);
            }
        }
    ]
};

export { tableConfig,timeRangeConfig };

