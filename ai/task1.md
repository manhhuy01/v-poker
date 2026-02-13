1. tạo 1 trang mới /report (lấy user info từ token như trang index)
2. Trang report có 2 tab: 
    - Tab 1: nội dung report sumary, api get từ /report/summary
    - Tab 2: nội dung report của chính user đang dăng nhập, api post từ /report/game-logs/:userName, có phân trang và chọn khoảng thời gian (7 ngày, 30 ngày và 1 năm), page limit default 20. param là days, page, limit
    Tất cả api thì thêm vào api/poker.js nhé
3. example data tab 1: 
{
    "data": [
        {
            "username": "cuongvu",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 73,
            "totalGame": "0"
        },
        {
            "username": "daodaobao",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 114,
            "totalGame": "0"
        },
        {
            "username": "dealerfromhell2",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 0,
            "totalGame": "0"
        },
        {
            "username": "jendo",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 24,
            "totalGame": "0"
        },
        {
            "username": "locnguyen",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 64,
            "totalGame": "0"
        },
        {
            "username": "lycuong99",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 42,
            "totalGame": "0"
        },
        {
            "username": "manhhuy01",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 0,
            "totalGame": "0"
        },
        {
            "username": "manhhuy02",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 28,
            "totalGame": "1"
        },
        {
            "username": "mytrang",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 33,
            "totalGame": "0"
        },
        {
            "username": "nhat",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 68,
            "totalGame": "0"
        },
        {
            "username": "nhat",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 68,
            "totalGame": "0"
        },
        {
            "username": "nhatkool",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 0,
            "totalGame": "0"
        },
        {
            "username": "thu",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 0,
            "totalGame": "0"
        },
        {
            "username": "tu",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 190,
            "totalGame": "0"
        },
        {
            "username": "tuan",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 18,
            "totalGame": "0"
        },
        {
            "username": "viet",
            "totalDeposit": "0",
            "totalWithdraw": "0",
            "currentBalance": 132,
            "totalGame": "0"
        }
    ]
}

4. example data tab 2: 
{
    "data": [
        {
            "id": 2,
            "amount": "4.00",
            "type": "lose",
            "balance_after": "12.00",
            "created_at": "2026-02-13T16:16:38.976Z"
        }
    ],
    "page": 1,
    "limit": 20
}
5. UI bạn tự nghĩ ra sao cho đẹp và dễ nhìn nhé