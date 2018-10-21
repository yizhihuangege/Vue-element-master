const tableBody = {
    isLoading: false,
    header: [],
    data: [{}],
    selectedRows: [],
    curPage: 1, // 当前页数
    pageSize: 10, // 页大小
    countTotal: 0 // 页总数
};



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

export { tableBody,timeRangeConfig }

