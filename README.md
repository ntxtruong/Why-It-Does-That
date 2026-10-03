# Why-It-Does-That
Repo lưu trữ cho kênh Youtube Why It Does That

## Cấu trúc

| Thư mục | Nội dung |
| --- | --- |
| `ep01/` | Tập 1 (cầu vồng): kịch bản `script.json`, tạo giọng đọc `tts.py`, cảnh hoạt hình `video.html`, dựng khung hình `render.js`, phụ đề, tiêu đề và mô tả YouTube |
| `brand/` | Nhân vật chibi, ảnh bìa, ảnh đại diện (`brandkit.js` vẽ lại được mọi thứ), nội dung thiết lập kênh |
| `media/` | File video 1080p và thumbnail của từng tập |

## Quy trình mỗi video (sáng thứ Tư và thứ Bảy)

| Bước | Claude làm | Trường quyết định |
| --- | --- | --- |
| 1. Ý tưởng | Đề xuất 1–3 ý tưởng | Chọn một, hoặc bỏ qua hôm đó |
| 2. Kịch bản | Kiểm tra nguồn, viết kịch bản tiếng Anh, gửi kèm tóm tắt tiếng Việt | Duyệt hoặc yêu cầu sửa |
| 3. Sản xuất | Giọng đọc, mô phỏng, xuất video 1080p, thumbnail, phụ đề, mô tả | — |
| 4. Đăng | Đẩy lên repo này, tải lên YouTube ở chế độ Không công khai, điền thông tin | Nghe và chọn nhạc trong Thư viện âm thanh YouTube, kiểm tra lần cuối, tự chuyển sang Công khai |

Chi tiết kỹ thuật của từng bước nằm trong `CLAUDE.md`.

## Dựng một tập

1. `python3 tts.py` tạo `narration.wav` và `timeline.json` (cần `kokoro-onnx` cùng hai file mô hình `kokoro-v1.0.onnx`, `voices-v1.0.bin` đặt ở thư mục `tts/` tại gốc repo, không lưu trên GitHub).
2. `node render.js <khung đầu> <khung cuối> out.mp4` dựng hình không tiếng (cần `playwright` và Chromium); chạy hai nửa song song.
3. Ghép hai nửa bằng `ffmpeg`, thêm lời đọc đã chuẩn hóa âm lượng về −16 LUFS, âm thanh AAC.

Giọng đọc: Kokoro (Apache 2.0), giọng `am_michael`, tốc độ 0.9.
