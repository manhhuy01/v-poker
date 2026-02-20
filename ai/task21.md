Modal bet (isOpenModalBet trong game.js) hiện tại có 1 nhược điểm là khi người chơi bấm vào nút bet thì sẽ focus vào input, và ở mobile sẽ mở bàn phím lên, làm che mất các button trong modal, tôi đề nghị làm gọn lại modal bet này như sau: 
0. hãy tách component modal bet ra thành 1 file riêng
1. các button 2x BB, 4xBB hoặc 6x BB, all in chuyển thành 1 thanh slider có các mốc cố định được tính ra trước (2x Big blind, 4x big blind, 6x big blind, 8x big blind, 10x big blind, all in)
2. Đảm bảo chiều cao modal dưới 50% dvh để cho khi bàn phím mở lên sẽ không bị che bất kì thành phần nào.
