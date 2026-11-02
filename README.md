This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Chuyển giao diện bàn chơi (V1/V2/V3)

- Mở menu user ở góc trên bên phải → **Giao diện bàn chơi** → chọn V1, V2 hoặc V3.
- Lựa chọn được lưu ở `localStorage` theo từng user, key dạng `v-poker:ui-version:<userName>`.
- Không gọi API/server; lựa chọn của user này không ảnh hưởng tới user khác.
- Nếu chưa có giá trị trong `localStorage`, mặc định dùng V1 (giao diện trên nhánh `main`).
- Code V1 nằm ở `components/game-v1/`, V2 nằm ở `components/game.js` + `components/poker/`.

### V3 — "Ngọt ngào" (bản thử nghiệm)

V3 dùng chung logic và bố cục responsive của V2, nhưng khoác lên một skin mới:
tông pastel sáng (hồng, mint, chanh, sky), bàn chơi như kẹo bông, ghế và nút bấm
dạng viên kẹo bo tròn, cùng các chi tiết dễ thương (thỏ, trái tim, ngôi sao, mây,
cầu vồng, hoa văn chấm bi và chỉ khâu trên mặt bàn).

- Xem nhanh không cần đăng nhập: `/mock?ui=v3` (đổi `v1`/`v2` để so sánh).
- CSS của skin nằm ở `styles/theme-v3.css`, chỉ áp dụng dưới
  `<html data-ui-version="v3">` nên V1/V2 không bị ảnh hưởng.
- Các class `pk-*` (ví dụ `pk-pod`, `pk-btn-call`) được `composes ... from global`
  gắn vào CSS module của V2 để stylesheet V3 bám vào đúng phần tử mà không phải
  sửa JSX/logic. Đổi tên hook thì nhớ sửa cả hai nơi.
- Trang trí: `components/poker/cuteDecor.js`; icon hành động dễ thương:
  `components/poker/cuteIcons.js` (truyền `cute` vào `ActionDock`).
- Modal cược/tip dùng theme riêng qua prop `theme="sweet"` của `components/modal.js`;
  các modal hệ thống khác vẫn giữ giao diện tối.
- Font hiển thị (Baloo 2 + Nunito) chỉ được tải khi người dùng chọn V3.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
