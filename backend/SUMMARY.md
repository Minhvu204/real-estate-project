Sprint 2 — Tóm tắt nhanh

Sprint Goal

- Cho phép seller/agent tạo và quản lý tin đăng bất động sản (bao gồm upload nhiều ảnh), admin có thể kiểm duyệt/phê duyệt bài đăng, và admin quản lý taxonomy (types, features, cities, categories).

User Stories (cập nhật)

1. BE U008 — Seller chỉ định agent để quản lý property (Medium)
2. BE U009 — Agent/Seller tạo tin đăng (title, description, price, images[], city_id, type_id, features[]) (High)
3. BE U010 — Seller/Agent xem danh sách property của mình (seller: owner; agent: properties được chỉ định) (Medium)
4. BE U011 — Admin kiểm duyệt/phê duyệt bài đăng (High)
5. BE U012 — Agent/Seller chỉnh sửa hoặc xóa (soft-delete) property của mình (High)
6. BE U013 — Admin quản lý taxonomy (PropertyType, Feature, City, Category) CRUD (Medium)
7. BE U014 — Admin quản lý bài đăng (xem tất cả, ẩn/restore bài vi phạm) (Medium)

Các công việc chính & files liên quan

- Routes
  - `src/routes/client/common/properties.route.ts` (public/common endpoints)
  - `src/routes/client/common/profile.route.ts` (đã có)
  - `src/routes/client/seller/properties.route.ts` (seller-specific)
  - `src/routes/client/agent/*` và `src/routes/client/buyer/*`
  - `src/routes/admin/property.route.ts` (tạo mới)
  - `src/routes/admin/type|feature|city|category.route.ts` (taxonomy)

- Controllers
  - Thêm/viết: `src/controllers/client/common/property.controller.ts` (create, update, delete, getMyProperties, assignAgent)
  - Thêm: `src/controllers/admin/property.controller.ts` (approve/reject, hide/restore)
  - Thêm: `src/controllers/admin/*` cho taxonomy

- Services
  - Cập nhật: `src/services/property.service.ts` (createProperty, updateProperty, deleteProperty, assignAgent, updateStatus)
  - Thêm: `src/services/notification.service.ts` (optional)

- Middlewares / Upload
  - Đã thêm: `src/middlewares/uploadMultipleToCloudinary.middleware.ts` (hỗ trợ multer().array() và multer().fields()).
  - Pattern route: multer().array('images', 10) -> uploadMultipleToCloudinary -> controller
  - Lưu ý: middleware hiện log thành công cho từng file và summary.

- Models
  - Đã có đầy đủ 15 entities (User, Property, PropertyType, City, Feature, Category, PropertyFeature, Enquiry, Appointment, Offer, Deal, Payment, Contract, Agreement, Review, Notification).

Quality & Tests

- Viết unit test/service test cho các flow chính: tạo property (upload), update/delete, assign agent, admin approve.
- Postman collection: include examples multipart/form-data cho create property.

Checkpoints & Restore (recommended)

- Trước khi áp thay đổi lớn (db schema, upload logic): tạo Git commit + tag (ví dụ `vYYYYMMDD-sprint2-preupload`) — lưu ý tôi sẽ KHÔNG commit/push nếu bạn không cho phép.
- Backup .env (copy), DB dump (mongodump) trước migration.

Next actions (khi bạn quay lại)

1. Xác nhận policy xử lý ảnh (append vs replace; max file/size). 
2. Chọn ai sẽ implement từng user story (assign dev).
3. Nếu đồng ý, tôi có thể soạn snippets controller/service cụ thể cho U009 (create property) để dev copy-paste.

Ghi chú cuối

- Tôi đã tạo file này trong workspace nhưng sẽ KHÔNG thực hiện commit/push lên GitLab. Bạn có thể mở/kiểm tra `SUMMARY.md` tại project root.
- Khi bạn nhắn: “Tiếp tục Sprint 2” kèm Product Backlog/Detail Plan, tôi sẽ quét workspace và tiếp tục theo plan.

Ngày tạo: 2025-10-24
