export const filterDataList = [{
    "name": '价格',
    "type": 'radio',
    "key": "sortvalue",
    "submenu": [{
        "name": '不限',
        "value": "",
    },
    {
        "name": '起拍价格升序',
        "value": "asc",
    }, {
        "name": '起拍价格降序',
        "value": "desc",
    }
    ]
},
{
    "name": '状态',
    "type": 'radio',
    "isSort": true,
    "key": "status",
    "submenu": [
        {
            "name": "不限",
            "value": ""
        },
        {
            "name": "即将开始",
            "value": "todo"
        },
        {
            "name": "正在进行",
            "value": "doing"
        },
        {
            "name": "已成交",
            "value": "done"
        }
    ]
},
{
    "name": '类型',
    "type": 'hierarchy',
    "submenu": [],
    "key": "typeCode"
},
{
    "type": 'filter',
    "name": '筛选',
    "key": "filter",
    "submenu": []
}
]
