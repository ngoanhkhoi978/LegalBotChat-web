---
name: Cổng Dịch vụ công Quốc gia
description: >
  Design system trích xuất từ Cổng Dịch vụ công Quốc gia Việt Nam
  (https://dichvucong.gov.vn). Phong cách hành chính công – trang trọng,
  rõ ràng, thân thiện; bảng màu lấy cảm hứng từ quốc kỳ (đỏ thẫm) kết
  hợp với tông terracotta ấm áp và xanh navy đậm cho văn bản.
source: https://dichvucong.gov.vn/
locale: vi-VN

colors:
  primary: "#903938"          # Đỏ thẫm – header/footer chính phủ
  primary-variant: "#7A2E2D"  # Hover/pressed của primary
  secondary: "#CE7A58"        # Terracotta – heading nhóm, accent ấm
  secondary-variant: "#E9926F" # Terracotta sáng – card hover, nhãn phụ
  accent: "#FFC251"           # Vàng nghệ – CTA shortcut chính
  accent-warm: "#CA5900"      # Cam đậm – badge/cảnh báo nhẹ
  info: "#2A6EBB"             # Xanh dương – liên kết, thông tin
  success: "#287867"          # Xanh lục – trạng thái hoàn thành
  error: "#B3261E"            # Đỏ tươi – lỗi/destructive
  surface: "#FFFFFF"          # Nền chính
  surface-variant: "#F5F5F5"  # Nền phụ – ô tìm kiếm, panel, button phụ
  on-surface: "#1E2F41"       # Văn bản chính trên nền sáng (navy)
  on-surface-muted: "#8F969C" # Văn bản phụ, metadata, ngày tháng
  on-primary: "#FFFFFF"       # Văn bản trên nền primary
  border: "#DBDCDC"           # Viền chia khối, hairline
  overlay: "rgba(0, 0, 0, 0.2)" # Lớp phủ modal/loading

typography:
  fontFamily-base: "Nunito, Arial, sans-serif"
  fontFamily-heading: "Nunito, Arial, sans-serif"

  display-lg:
    fontFamily: Nunito
    fontSize: 32px
    fontWeight: 700
    lineHeight: 40px
    letterSpacing: 0
  headline-md:
    fontFamily: Nunito
    fontSize: 23px
    fontWeight: 500
    lineHeight: 26px
    color: "#CE7A58"
  headline-sm:
    fontFamily: Nunito
    fontSize: 20px
    fontWeight: 600
    lineHeight: 24px
  title-md:
    fontFamily: Nunito
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
  body-lg:
    fontFamily: Nunito
    fontSize: 18px
    fontWeight: 400
    lineHeight: 24px
  body-md:
    fontFamily: Nunito
    fontSize: 16px
    fontWeight: 400
    lineHeight: 22px
  body-sm:
    fontFamily: Nunito
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label:
    fontFamily: Nunito
    fontSize: 13px
    fontWeight: 500
    lineHeight: 16px
    textTransform: uppercase
  caption:
    fontFamily: Nunito
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    color: "#8F969C"

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px

rounded:
  none: 0px
  sm: 3px        # góc nhỏ – ô input dính liền (0 3px 3px 0)
  md: 4px        # mặc định – button, input
  lg: 8px        # card lớn
  pill: 9999px   # chip/tag

elevation:
  none: "none"
  sm: "0 1px 2px rgba(0, 0, 0, 0.08)"
  md: "0 2px 6px rgba(0, 0, 0, 0.12)"
  lg: "0 4px 12px rgba(0, 0, 0, 0.16)"

layout:
  maxWidth: 1200px
  gutter: 24px
  columns: 12
  breakpoints:
    sm: 576px
    md: 768px
    lg: 992px
    xl: 1200px

motion:
  duration-fast: 120ms
  duration-base: 200ms
  duration-slow: 320ms
  easing-standard: "cubic-bezier(0.2, 0, 0, 1)"

components:
  button-primary:
    background: "#903938"
    color: "#FFFFFF"
    borderRadius: 4px
    padding: "10px 20px"
    fontWeight: 600
  button-accent:
    background: "#FFC251"
    color: "#1E2F41"
    borderRadius: 4px
    padding: "8px 16px"
    fontWeight: 500
  button-secondary:
    background: "#F5F5F5"
    color: "#1E2F41"
    borderRadius: "0 3px 3px 0"
    padding: "6px 12px"
    fontWeight: 400
  input-text:
    background: "#FFFFFF"
    color: "#1E2F41"
    border: "1px solid #DBDCDC"
    borderRadius: 4px
    padding: "8px 12px"
    fontSize: 16px
  card-event:
    background: "#FFFFFF"
    border: "1px solid #DBDCDC"
    borderRadius: 8px
    padding: 16px
    shadow: "0 1px 2px rgba(0,0,0,0.08)"
  banner-news:
    background: "#F5F5F5"
    color: "#1E2F41"
    borderRadius: 4px
    padding: "12px 16px"
  app-bar:
    background: "#FFFFFF"
    color: "#1E2F41"
    borderBottom: "1px solid #DBDCDC"
    padding: "15px 0"
  footer:
    background: "#903938"
    color: "#FFFFFF"
    padding: "10px 0"
---

# Design System – Cổng Dịch vụ công Quốc gia

## Overview

Hệ thống thiết kế cho cổng thông tin chính phủ điện tử của Việt Nam. Mục tiêu cảm xúc: **trang trọng nhưng dễ tiếp cận** – đủ uy tín để người dân tin tưởng nộp giấy tờ quan trọng, nhưng không lạnh lùng đến mức cản trở những người ít quen với công nghệ. Bố cục mật độ thông tin cao (kiểu portal/cổng), ưu tiên đường dẫn ngắn tới tác vụ thay vì khoảng trắng nghệ thuật.

Ngôn ngữ chính: tiếng Việt. Font phải hỗ trợ đầy đủ dấu thanh tiếng Việt — vì vậy lựa chọn **Nunito** (web-safe, hỗ trợ Latin Extended) làm nền tảng.

## Brand voice (visual)

- **Đỏ thẫm `#903938`** lấy cảm hứng từ quốc kỳ – là dấu hiệu nhận diện cơ quan chính phủ, dùng cho thanh app-bar / footer và các bề mặt mang tính "con dấu".
- **Terracotta `#CE7A58`** dùng cho heading và accent ấm, gợi cảm giác gần gũi, giảm độ "cứng" của tông đỏ.
- **Vàng nghệ `#FFC251`** dành riêng cho call-to-action có mức độ ưu tiên cao nhất (vd: "Dịch vụ công trực tuyến", "Khai sinh/Khai tử").
- **Navy `#1E2F41`** làm màu chữ chuẩn — đậm hơn xám, dễ đọc trên nền trắng.

## Colors

| Token | Hex | Dùng cho |
| --- | --- | --- |
| `primary` | `#903938` | App-bar, footer, dấu hiệu cơ quan |
| `primary-variant` | `#7A2E2D` | Hover/pressed của primary |
| `secondary` | `#CE7A58` | Heading nhóm ("CÔNG DÂN", "DOANH NGHIỆP"), accent ấm |
| `secondary-variant` | `#E9926F` | Hover của card sự kiện, gradient phụ |
| `accent` | `#FFC251` | CTA chính (nút shortcut quan trọng) |
| `accent-warm` | `#CA5900` | Badge "mới", nhãn ưu tiên |
| `info` | `#2A6EBB` | Liên kết, icon thông tin |
| `success` | `#287867` | Trạng thái hồ sơ hoàn tất |
| `error` | `#B3261E` | Cảnh báo, lỗi nhập liệu |
| `surface` | `#FFFFFF` | Nền trang |
| `surface-variant` | `#F5F5F5` | Ô input, panel, nút phụ |
| `on-surface` | `#1E2F41` | Văn bản chính |
| `on-surface-muted` | `#8F969C` | Ngày tháng, chú thích |
| `border` | `#DBDCDC` | Hairline, viền card |

> Ghi chú: hệ thống không sử dụng dark mode trong phiên bản hiện tại. Khi thiết kế screen mới, mặc định lấy nền sáng.

## Typography

- **Font:** Nunito (fallback: Arial → sans-serif). Nunito được chọn vì hỗ trợ đầy đủ dấu tiếng Việt, mềm mại nhưng không quá "trẻ trung" – phù hợp giọng văn hành chính.
- **Cỡ chữ nền:** 18px / line-height 24px. Lớn hơn chuẩn web thông thường để hỗ trợ người dùng cao tuổi.
- **Heading nhóm** dùng tông terracotta thay vì navy – tách biệt khỏi văn bản và tạo điểm nhấn ấm.
- **Caption** dùng cho dòng "Ngày 11/02/2026" – cỡ 12px, màu `on-surface-muted`.

| Token | Size / Weight | Use |
| --- | --- | --- |
| `display-lg` | 32 / 700 | Tiêu đề trang hero |
| `headline-md` | 23 / 500 | Heading nhóm sự kiện đời sống |
| `headline-sm` | 20 / 600 | Tiêu đề khối nội dung phụ |
| `title-md` | 18 / 600 | Tiêu đề card, mục thủ tục |
| `body-lg` | 18 / 400 | Văn bản mặc định |
| `body-md` | 16 / 400 | Văn bản trong form, table |
| `body-sm` | 14 / 400 | Chú thích form |
| `label` | 13 / 500 uppercase | Nhãn input, badge |
| `caption` | 12 / 400 muted | Metadata, timestamp |

## Spacing & Layout

- Sử dụng hệ scale 4-base: `4 / 8 / 12 / 16 / 24 / 32 / 48`.
- Container chính rộng tối đa **1200px**, lề trong (gutter) **24px**.
- Grid 12 cột cho desktop; trên mobile chuyển sang stack dọc, ô tìm kiếm full-width.
- Khối "CÔNG DÂN" và "DOANH NGHIỆP" trên desktop hiển thị song song 2 cột; trên `md` trở xuống đặt chồng (1 cột), heading sticky.

## Shape (rounded)

- **4px** là bo góc mặc định cho mọi input và button đơn.
- **0 3px 3px 0** dùng cho phần phải của một input dính liền với button (search bar).
- **8px** cho card nhóm sự kiện.
- **9999px (pill)** cho chip trạng thái.

## Elevation

Cổng dùng shadow rất tiết chế (phong cách "flat-with-hairline"). App-bar và footer **không** đổ bóng – ranh giới được tạo bởi `border` 1px màu `#DBDCDC`. Chỉ card sự kiện dùng `elevation.sm` khi ở trạng thái default, `elevation.md` khi hover.

## Components

### App bar / header
Nền trắng, văn bản navy, viền dưới mỏng. Logo bên trái, menu ngang giữa, cặp nút **Đăng ký / Đăng nhập** bên phải. Chiều cao tối thiểu 64px, padding `15px 0`.

### Footer
Nền `primary` (`#903938`), văn bản trắng. Bố cục 1–3 cột: cơ quan chủ quản, kênh hỗ trợ (`18001096`), email (`dichvucong@chinhphu.vn`).

### Search bar
Input bo góc `4px 0 0 4px`, button "Tìm kiếm" liền sát bên phải bo góc `0 4px 4px 0`. Button dùng `surface-variant` cho biến thể nhẹ hoặc `primary` cho biến thể CTA. Có thể đi kèm link "Tìm kiếm nâng cao" ở dưới.

### Buttons
- **Primary** – nền `primary` (`#903938`), chữ trắng, dùng tối đa **1 lần** cho hành động chính của trang.
- **Accent** – nền `accent` (`#FFC251`), chữ navy, dùng cho shortcut được quảng bá đặc biệt.
- **Secondary** – nền `surface-variant` (`#F5F5F5`), chữ navy, cho các thao tác phụ.
- **Ghost / link** – chỉ chữ màu `info`, gạch chân khi hover.

### Cards (nhóm sự kiện đời sống)
Nền trắng, viền 1px `#DBDCDC`, bo `8px`, padding `16px`, có icon minh hoạ ở trên + nhãn ngắn ("Có con nhỏ", "Hôn nhân và gia đình"). Hover: shadow `md` + biên đổi sang `secondary-variant`.

### News carousel
Mỗi item gồm tiêu đề (tối đa 2 dòng, `title-md`) + caption ngày `12 / muted`. Item active có viền dưới `accent`. Nút Previous/Next dạng tròn 36px nền `surface-variant`.

### Forms
- Input padding `8px 12px`, border `1px #DBDCDC`, focus ring `2px #2A6EBB`.
- Combobox phụ thuộc (Tỉnh → Huyện → Xã) hiển thị xếp tầng; khi cấp trên trống thì cấp dưới disable + đổi nền sang `#F5F5F5`.
- Radio nhóm dùng để chọn cấp thực hiện (Tỉnh/Thành phố · Bộ ngành · Phường/Xã · Sở) – stack ngang trên desktop.

### Banners / Notifications
Thông báo quan trọng (vd: "Dừng vận hành") dùng banner full-width nền `accent` với chữ navy, icon cảnh báo cam (`accent-warm`). Không được giấu trong carousel tin tức thường.

## Iconography

- Style outline 1.5px, bo tròn nhẹ – đồng bộ với chữ Nunito.
- Icon nhóm sự kiện đời sống vẽ minh hoạ kiểu glyph đơn sắc, dùng `secondary` hoặc `primary` làm màu chính.
- Tránh icon quá trẻ trung / hoạt hình – duy trì sự tôn nghiêm của cổng chính phủ.

## Tone of voice (visual)

- **Trang trọng**: căn chỉnh đều, ít hiệu ứng động, không gradient sặc sỡ.
- **Phục vụ**: ưu tiên label tiếng Việt rõ ràng, tránh thuật ngữ kỹ thuật ("submit" → "Gửi hồ sơ").
- **Khẳng định**: heading dùng terracotta nổi bật nhưng không kêu gọi cảm xúc thái quá.

## Do's and Don'ts

- **Do** dùng `primary` (`#903938`) cho duy nhất app-bar, footer, và badge cơ quan. Không dùng làm nền nút trên các trang con để tránh "đỏ ngợp".
- **Do** giữ cỡ chữ tối thiểu 14px cho mọi văn bản hành chính; tiếng Việt có dấu sẽ khó đọc dưới mức này.
- **Do** chỉ dùng MỘT nút `accent` (vàng) trên mỗi màn hình – để báo hiệu hành động số 1.
- **Don't** trộn nhiều màu accent (vàng + cam + xanh) trong cùng một khối – sẽ giảm uy tín thị giác.
- **Don't** dùng bo góc lớn (>12px) – ngôn ngữ thiết kế là "hộp chữ nhật mềm", không phải UI tiêu dùng.
- **Don't** ẩn thông báo quan trọng trong carousel; dùng banner cố định.
- **Do** đảm bảo tương phản tối thiểu 4.5:1 cho body text, 3:1 cho heading (`secondary` `#CE7A58` trên nền trắng chỉ đạt ~3.1:1 → chỉ dùng cho heading ≥ 18px).
- **Do** cung cấp focus indicator rõ (ring 2px màu `info`) cho mọi phần tử tương tác – đặc biệt quan trọng cho người dùng điều khiển bằng bàn phím.

## Sources

- [dichvucong.gov.vn — Trang chủ](https://dichvucong.gov.vn/p/home/dvc-trang-chu.html)
- [dichvucong.gov.vn — Giới thiệu](https://dichvucong.gov.vn/p/home/dvc-gioi-thieu.html)
